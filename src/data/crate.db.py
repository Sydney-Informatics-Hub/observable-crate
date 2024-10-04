
from rocrate.rocrate import ROCrate
import sqlite3
import sys
import io
import tempfile

CRATEDIR = "./src/data/crates/omaa/"

def get_as_list(entity, prop):
    v = entity.properties().get(prop, None)
    if v is None:
        return []
    if type(v) is str:
        return [ v ]
    if type(v) is list:
        return v
    raise Exception(f"Can't make a list out of {v}")

def main(cratedir):
    with tempfile.NamedTemporaryFile() as dbfp:
        connect = sqlite3.connect(dbfp.name)
        cursor = connect.cursor()
        # todo: rest of the properties
        cursor.execute("CREATE TABLE node(crate_id, name, types)")
        cursor.execute("CREATE TABLE type(node, name)")
        cursor.execute("CREATE TABLE link(source, target, relation)")
        connect.commit() 
        crate = ROCrate(cratedir)
        nodes = []
        links = []
        for e in crate.get_entities():
            ename = e.properties().get("name", None)
            eid = e.properties().get("@id", None)
            types = get_as_list(e, "@type")
            if eid is not None:
                cursor.execute("INSERT INTO node VALUES(?,?,?)", (eid, ename, str(types)))
                for p, v in e.properties().items():
                    if type(v) is dict:
                        mid = v.get("@id", None)
                        target = crate.dereference(mid) 
                        if target:
                            tid = target.properties().get("@id", None)
                            if tid is not None:
                                cursor.execute("INSERT INTO link VALUES(?,?,?)", (eid, tid, p))
                connect.commit()
        with open(dbfp.name, "rb") as dbfp2:
            sys.stdout.buffer.write(dbfp2.read())

if __name__ == "__main__":
    main(CRATEDIR)
