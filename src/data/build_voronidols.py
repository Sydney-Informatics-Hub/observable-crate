from rocrate.rocrate import ROCrate

from pathlib import Path

d = Path("./src/data/crates/voronidols_images")

DEST = "./src/data/crates/voronidols"

crate = ROCrate()

for file in d.glob("*.png"):
    image = crate.add_file(file, properties={
        "name": file.name,
        "encodingFormat": "image/png"
        })

crate.write(DEST)
