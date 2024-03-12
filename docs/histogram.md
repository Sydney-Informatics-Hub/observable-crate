---
title: Histogram
toc: false
---
## Entities by type

```js
const crate = FileAttachment("./data/crate.json").json();
```

```js

const nodes_array = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);

// disaggregate types for histogram

const entities = [];

nodes_array.map((n) => {
  n.type.map((t) => {
    entities.push({name: n.name, id: n.id, type: t})
  })
});

```

```js

display(Plot.plot({
  y: {grid: true},
  marginBottom: 120,
  marginRight: 100,
  marks: [
    Plot.rectY(entities, Plot.groupX({y: "count"}, {x: "type", fill:"type"})),
    Plot.ruleY([0]),
    Plot.axisX({tickRotate: 45})
    ]
  }
));

```