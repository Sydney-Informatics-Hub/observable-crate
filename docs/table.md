---
title: Table
toc: false
---
## Table

```js
const crate = FileAttachment("./data/crate.json").json();
```

```js

const nodes_array = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);
const types_s = new Set;
nodes_array.map((n) => { types_s.add(n.type) });

```

```js
const search = view(Inputs.text({
  label: "Search",
  placeholder: "search names and descriptions",
  value: ""
}));

function match_node(n, search) {
  if( !search ) {
      return true;
  }
  const lcs = search.toLowerCase();
  return n.name?.toLowerCase().includes(lcs) || n.description?.toLowerCase().includes(lcs);
}
```

```js
const filtered = nodes_array.filter((n) => match_node(n, search));

display(Inputs.table(filtered, {
  rows: 100,
  maxHeight: 600,
  columns:["id", "type", "name", "description"]
}));

```
