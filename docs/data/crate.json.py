
from rocrate.rocrate import ROCrate
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

CRATEDIR = "./docs/data/crates/omaa/"


def write_csv(file, headers, items):
    with open(file, "w") as fh:
        fh.write(",".join(headers) + "\n")
        for i in items:
            try:
                fh.write(",".join(i) + "\n")
            except Exception as e:
                pass


def main(cratedir):
    crate = ROCrate(cratedir)
    nodes = []
    links = []
    print(f"Loading RO-Crate from {cratedir}")
    for e in crate.get_entities():
        ename = e.properties().get("name", None)
        eid = e.properties().get("@id", None)
        if eid is not None:
            nodes.append((eid, ename, e.type))
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
    print(nodesdf)
    print(linksdf)

if __name__ == "__main__":
    main(CRATEDIR)
