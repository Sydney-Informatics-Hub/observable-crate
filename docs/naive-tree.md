---
title: Naive Tree
toc: false
---
```js

import { root_entity, naive_tree } from "./components/crate.js";

const crate = await FileAttachment("./data/crate.json").json();
const root = root_entity(crate.nodes);

const tree = naive_tree(crate);


```
## ${root.name}

${root.description}

Tree visualisation

```js

display(Plot.plot({
  height: 4080,
  marginLeft: 100,
  axis: null,
  marks: [
    Plot.tree(tree, {textStroke: "white", delimiter: "|"})
  ]
}));

```

