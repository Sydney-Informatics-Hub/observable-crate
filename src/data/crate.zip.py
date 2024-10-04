
from rocrate.rocrate import ROCrate
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import sys
import zipfile
import io

CRATEDIR = "./src/data/crates/omaa/"

def write_parquet(df, filename, zfh):
    buf = pa.BufferOutputStream()
    table = pa.Table.from_pandas(df)
    pq.write_table(table, buf, compression="snappy")
    buf_bytes = buf.getvalue().to_pybytes()
    zfh.writestr(filename, buf_bytes)


def main(cratedir):
    crate = ROCrate(cratedir)
    nodes = []
    links = []
    for e in crate.get_entities():
        ename = e.properties().get("name", None)
        eid = e.properties().get("@id", None)
        if eid is not None:
            nodes.append((eid, ename, str(e.type)))
            for p, v in e.properties().items():
                if type(v) is dict:
                    mid = v.get("@id", None)
                    target = crate.dereference(mid) 
                    if target:
                        tid = target.properties().get("@id", None)
                        if tid is not None:
                            links.append((eid, tid, p))
    nodesdf = pd.DataFrame(nodes, columns=["id", "name", "type"])
    linksdf = pd.DataFrame(links, columns=["source", "target", "relation"])

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w") as zfh:
        write_parquet(nodesdf, "nodes.parquet", zfh)

    with zipfile.ZipFile(zip_buffer, "a") as zfh:
        write_parquet(linksdf, "links.parquet", zfh)

    sys.stdout.buffer.write(zip_buffer.getvalue())

if __name__ == "__main__":
    main(CRATEDIR)
