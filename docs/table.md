---
title: Table
toc: true
---
## Table

```js
const crate = FileAttachment("./data/table.json").json();
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
display(Inputs.table(filtered, {height: 600}));
```
