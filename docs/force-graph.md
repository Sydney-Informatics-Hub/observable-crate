---
title: Force graph
toc: true
---
```js

import { forcegraph } from "./components/forcegraph.js";
import { root_entity } from "./components/crate.js";

const crate = await FileAttachment("./data/crate.json").json();
const root = root_entity(crate.nodes);

const nodes_array = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);

```
## ${root.name}

${root.description}



```js
const svg = forcegraph({nodes: nodes_array, links: crate.links});

display(svg.node());
```

