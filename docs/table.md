---
title: Table
toc: true
---
## Table

```js
const crate = FileAttachment("./data/table.json").json();
```

```js
const types_s = new Set;

crate.map((n) => { types_s.add(n.type) });

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
  return n.name?.includes(search) || n.description?.includes(search);
}
```
```js
const filtered = crate.filter((n) => match_node(n, search));

display(Inputs.table(filtered));

display(Plot.plot({
  y: {grid: true},
  marks: [
    Plot.rectY(filtered, Plot.groupX({y: "count"}, {x: "type", fill:"type"})),
    Plot.ruleY([0]),
    Plot.axisX({tickRotate: 45})
    ]
  }
));
```