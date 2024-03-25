---
title: Force Graph
toc: false
---
```js

import { forcegraph } from "./components/forcegraph.js";
import { root_entity, make_colour_map } from "./components/crate.js";

const crate = await FileAttachment("./data/crate.json").json();
const root = root_entity(crate.nodes);

const nodes_array = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);

const colours = make_colour_map(crate.types);

```
## ${root.name}

${root.description}



```js

const svg = forcegraph({nodes: nodes_array, links: crate.links}, colours);

display(svg.node());
```

