
from rocrate.rocrate import ROCrate
import sqlite3
import sys
import io
import tempfile

CRATEDIR = "./src/data/crate/"

def get_as_list(entity, prop):
    v = entity.properties().get(prop, None)
    if v is None:
        return []
    if type(v) is str:
        return [ v ]
    if type(v) is list:
        return v
    raise Exception(f"Can't make a list out of {v}")

def get_target_ids(v):
    ids = []
    if type(v) is list and type(v[0]) is dict:
        ids = [ v1.get('@id', None) for v1 in v ]
    if type(v) is dict:
        ids = [ v.get('@id', None) ]
    return filter(lambda x: x is not None, ids)

def main(cratedir):
    with tempfile.NamedTemporaryFile() as dbfp:
        connect = sqlite3.connect(dbfp.name)
        cursor = connect.cursor()
        # todo: rest of the properties
        cursor.execute("CREATE TABLE node(crate_id, name, description, types)")
        cursor.execute("CREATE TABLE type(node, name)")
        cursor.execute("CREATE TABLE link(source, target, relation)")
        connect.commit() 
        crate = ROCrate(cratedir)
        nodes = []
        links = []
        for e in crate.get_entities():
            ename = e.properties().get("name", None)
            eid = e.properties().get("@id", None)
            desc = e.properties().get("description", "")
            types = get_as_list(e, "@type")
            if eid is not None:
                cursor.execute("INSERT INTO node VALUES(?,?,?,?)", (eid, ename, str(desc), str(types)))
                for p, v in e.properties().items():
                    for tid in get_target_ids(v):
                        target = crate.dereference(tid) 
                        if target:
                            tid = target.properties().get("@id", None)
                            if tid is not None:
                                cursor.execute("INSERT INTO link VALUES(?,?,?)", (eid, tid, p))
                connect.commit()
        with open(dbfp.name, "rb") as dbfp2:
            sys.stdout.buffer.write(dbfp2.read())

if __name__ == "__main__":
    main(CRATEDIR)
