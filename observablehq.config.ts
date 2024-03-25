// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "RO-Crate Viewer",
  cleanUrls: false,
  pages: [
    {name: "Summary", path: "/summary.html"},
    {name: "Table", path: "/table.html"},
    {name: "Histogram", path: "/histogram.html"},
    {name: "Force graph", path: "/force-graph.html"},
  ]

  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
};
