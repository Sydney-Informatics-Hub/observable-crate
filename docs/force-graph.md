---
title: Force graph
toc: true
---
```js

import { forcegraph } from "./components/forcegraph.js";
import { root_entity } from "./components/crate.js";

const entities = await FileAttachment("./data/entities.json").json();
const root = root_entity(entities);

const crate_graph = FileAttachment("./data/graph.json").json();

```
## ${root.name}

${root.description}



```js
const svg = forcegraph(crate_graph);

display(svg.node());
```

