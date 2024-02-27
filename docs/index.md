---
toc: false
---
<div>
  <h1>RO-Crate Viewer</h1>

```js

import { forcegraph } from "./components/forcegraph.js";

const crate_graph = FileAttachment("./data/graph.json").json();

```

```js
const svg = forcegraph(crate_graph);

display(svg.node());
//display(crate_graph);
```
</div>

