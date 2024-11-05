
from rocrate.rocrate import ROCrate
from argparse import ArgumentParser
from pathlib import Path
from sqlite_utils import Database
import csv
import sys
import io
import tempfile

CRATEDIR = "./src/data/crate/"

PROPERTIES = {
    "row_id": str,
    "source_id": str,
    "source_name": str,
    "property_label": str,
    "target_id": str,
    "value": str
}

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


def entity_properties(crate, e):
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
                    yield relation_row(crate, eid, ename, key, maybe_id)
                else:
                    yield property_row(eid, ename, key, v)


def relation_row(crate, eid, ename, prop, tid):
    target = crate.dereference(tid) 
    if target:
        return {
            "source_id": eid,
            "source_name": ename,
            "property_label": prop,
            "target_id": tid,
        }
    else:
        return property_row(eid, ename, prop, target)


def property_row(eid, ename, prop, value):
    return {
            "source_id": eid,
            "source_name": ename,
            "property_label": prop,
            "value": value
        }


def tocsv(cratedir, csvfile):
    crate = ROCrate(cratedir)
    seq = 0
    with open(csvfile, 'w', newline='', encoding='utf-8') as csvfile:
        csvwriter = csv.writer(csvfile, dialect='excel')
        csvwriter.writerow(HEADERS)
        for e in crate.get_entities():
            for row in entity_properties(crate, seq, e):
                csvwriter.writerow(row)
                seq += 1


def tosqlite(cratedir):
    with tempfile.NamedTemporaryFile() as dbfp:
        db = Database(dbfp.name, recreate=True)
        properties = db["property"].create(PROPERTIES)
        crate = ROCrate(cratedir)
        seq = 0
        propList = []
        for e in crate.get_entities():
            for row in entity_properties(crate, e):
                row["row_id"] = seq
                seq += 1
                propList.append(row)
        properties.insert_all(propList)
        with open(dbfp.name, "rb") as dbfp2:
            sys.stdout.buffer.write(dbfp2.read())

def test(cratedir):
    crate = ROCrate(cratedir)
    seq = 0
    for e in crate.get_entities():
        for row in entity_properties(crate, e):
            row["row_id"] = seq
            seq += 1 
            print(row)





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

    tosqlite(args.crate)
    # if args.output:
    #     tocsv(args.crate, args.output)
    # else:
    #     
