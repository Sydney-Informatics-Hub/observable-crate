---
title: Statistics
toc: false
---
## Entities by type

```js
import { current_crate, make_colour_map } from "./components/crate.js";

const crate = current_crate();

```

```js

const nodes_array = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);
const colour_map = make_colour_map(crate.types);


// disaggregate types for histogram

const entities = [];

const myCategoricalColors = ["orange", "#56B4e9", "#009e73", "tomato", "steelblue", "#f0e442"];

nodes_array.map((n) => {
  n.type.map((t) => {
    entities.push({name: n.name, id: n.id, type: t})
  })
});

```

```js

display(Plot.plot({
  color: { type: "categorical", scheme: "category10" },
  y: {grid: true},
  marginBottom: 120,
  marginRight: 100,
  marks: [
    Plot.rectY(entities, Plot.groupX({y: "count"}, {x: "type", fill: "type"})),
    Plot.ruleY([0]),
    Plot.axisX({tickRotate: 45})
    ]
  }
));

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
