---
title: Home
toc: false
---
```js
const crate_db = FileAttachment("./data/crate.db").sqlite();
```

```js
const nodes = crate_db.sql`SELECT * FROM node`;
const links = crate_db.sql`SELECT * FROM link`;
```

## Nodes

```js
display(Inputs.table(nodes));
```
## Links

```js
display(Inputs.table(links));
```
