// See https://observablehq.com/framework/config for documentation.



// async function* get_crate_files() {

// }



export default {
  title: "RO-Crate Explorer",
  cleanUrls: false,
  pages: [
    {name: "Visual", path: "/visual.html"},
    {name: "About", path: "/about.html"},
  ],
  async *dynamicPaths() { 
    yield `/data/crate/0001fbbaaca311ec8db8f23c92f50f45.png`;
    // for await( const {path} of get_crate_files() ) {
    //   yield `/data/crate/${path}`;
    // }
  }
};
