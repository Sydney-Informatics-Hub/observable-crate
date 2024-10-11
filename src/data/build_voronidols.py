from rocrate.rocrate import ROCrate

from pathlib import Path

MAX = 100

d = Path("./crates/voronidols_images")

DEST = "./src/data/crate"

crate = ROCrate()

i = 0

for file in d.glob("*.png"):
    if i < MAX:
        image = crate.add_file(file, properties={
            "name": file.name,
            "encodingFormat": "image/png"
            })
    i += 1

crate.write(DEST)
