---
title: Statistics
toc: false
---
## Entities by type

```js
import { make_colour_map } from "./components/crate.js";

const crate = FileAttachment("./data/crate.json").json();

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