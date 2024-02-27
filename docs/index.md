---
toc: false
---
## RO-Crate viewer

Experimenting with using Observable Framework to explore an RO-Crate.

This is the RO-Crate from [Opening the Multilingual Archive of Australia](https://omaa-arts.sydney.edu.au/) rendered as a force graph.


```js

import { forcegraph } from "./components/forcegraph.js";

const crate_graph = FileAttachment("./data/graph.json").json();

```

```js
const svg = forcegraph(crate_graph);

display(svg.node());
```

