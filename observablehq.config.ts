// See https://observablehq.com/framework/config for documentation.


import fs from 'fs-extra';
import {ROCrate} from 'ro-crate';


async function* get_crate_files() {
  const crateJson = await fs.readJson(`./src/data/crate/ro-crate-metadata.json`);
  const crate = new ROCrate(crateJson);
  for( const file_e of crate.graph.filter((e) => e['@type'] =='File') ) {
    const filename = file_e['name'];
    const exists = await fs.pathExists(`./src/data/crate/${filename}`);
    if( exists ) {
      console.log(`Found file ${filename}`);
      // the files need to be relative to src/
      yield `data/crate/${filename}`;
    }
  }
}

// the first time I did this it ended up in _files but now it doesn't?

export default {
  root: "src",
  title: "RO-Crate Explorer",
  cleanUrls: false,
  pages: [
    {name: "Map", path: "/map.html"},
    {name: "About", path: "/about.html"},
  ],
  // dynamicPaths: [
  //    'data/crate/800571f2cf9211ee8b63f23c92f50f45.png',
  //    'data/crate/fffa406a249311ec84d2f23c92f50f45.png',
  //    'data/crate/800e2bfc7f9511ec81e8f23c92f50f45.png', 
  //    'data/crate/fffcbb78e14611ebba0af23c92f50f45.png',
  // ]
  async *dynamicPaths() { 
    for await( const path of get_crate_files() ) {
       yield path;
    }
  }
};
