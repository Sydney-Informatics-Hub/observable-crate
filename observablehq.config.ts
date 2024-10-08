// See https://observablehq.com/framework/config for documentation.


import fs from 'fs-extra';
import {ROCrate} from 'ro-crate';


async function* get_crate_files() {
  const crateJson = await fs.readJson('./src/data/crate/ro-crate-metadata.json');
  const crate = new ROCrate(crateJson);
  for( const file_e of crate.graph.filter((e) => e['@type'] =='File') ) {
    console.log(file_e['name']);
    yield file_e['name'];
  }
}






export default {
  title: "RO-Crate Explorer",
  cleanUrls: false,
  pages: [
    {name: "Visual", path: "/visual.html"},
    {name: "About", path: "/about.html"},
  ],
  async *dynamicPaths() { 
    //yield `/data/crate/0001fbbaaca311ec8db8f23c92f50f45.png`;
    for await( const path of get_crate_files() ) {
       yield `/data/crate/${path}`;
    }
  }
};
