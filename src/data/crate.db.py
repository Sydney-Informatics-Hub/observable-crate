
from rocrate.rocrate import ROCrate
from argparse import ArgumentParser
from pathlib import Path
import csv
import sqlite3
import sys
import io
import tempfile

CRATEDIR = "./src/data/crate/"

HEADERS = (
    "row_id",
    "source_id",
    "source_name",
    "property_uri",
    "property_label",
    "target_id",
    "target_name",
    "target_url",
    "value"
    )

def create_tables(connect):
    cursor = connect.cursor()
    cursor.execute("CREATE TABLE about(root_id, name, description)") #FIXME
    cursor.execute("""
CREATE TABLE property(
    row_id,
    source_id, source_name,
    property_uri, property_label,
    target_id, target_name, target_url,
    value)
""")
    connect.commit() 


def get_as_list(v):
    """Ensures that a value is a list"""
    if v is None:
        return []
    if type(v) is list:
        return v
    return [ v ]

def get_as_id(v):
    if type(v) is dict:
        mid = v.get("@id", None)
        if mid is not None:
            return mid
    return None


def entity_properties(crate, seq, e):
    """Returns a generator which yields all of this entity's rows"""
    eid = e.properties().get("@id", None)
    if eid is None:
        return
    ename = e.properties().get("name", "")
    for key, value in e.properties().items():
        if key != "@id":
            for v in get_as_list(value):
                maybe_id = get_as_id(v)
                if maybe_id is not None:
                    yield relation_row(crate, seq, eid, ename, key, maybe_id)
                else:
                    yield property_row(seq, eid, ename, key, v)
                seq += 1


def relation_row(crate, seq, eid, ename, prop, tid):
    target = crate.dereference(tid) 
    if target:
        tname = target.properties().get("name", None)
        return (seq, eid, ename, "", prop, tid, tname, "", "") 
    else:
        return (seq, eid, ename, "", prop, "", "", target, "") # FIXME


def property_row(seq, eid, ename, prop, value):
    return (seq, eid, ename, "", prop, "", "", "", value)


def tocsv(cratedir, csvfile):
    crate = ROCrate(cratedir)
    seq = 0
    with open(csvfile, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile, dialect='excel')
        csvwriter.writerow(HEADERS)
        for e in crate.get_entities():
            for row in entity_properties(crate, seq, e):
                csvwriter.writerow(row)
                seq += 1 # I hate this


def tosqlite(cratedir):
    with tempfile.NamedTemporaryFile() as dbfp:
        connect = sqlite3.connect(dbfp.name)
        cursor = connect.cursor()
        create_tables(connect)
        crate = ROCrate(cratedir)
        seq = 0
        for e in crate.get_entities():
            for row in entity_properties(crate, seq, e):
                cursor.execute(
                    "INSERT INTO property VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    row
                )
                seq += 1 # I hate this
            connect.commit()
        with open(dbfp.name, "rb") as dbfp2:
            sys.stdout.buffer.write(dbfp2.read())

if __name__ == "__main__":
    ap = ArgumentParser("RO-Crate to tables")
    ap.add_argument(
        "-c", "--crate",
        default="./src/data/crate",
        type=Path,
        help="RO-Crate directory",
    )
    ap.add_argument(
        "-o", "--output",
        default=None,
        type=Path,
        help="Don't generate an sqlite.db and send to stdout, write csv to a file instead",
    )
    args = ap.parse_args()

    if args.output:
        tocsv(args.crate, args.output)
    else:
        tosqlite(args.crate)
