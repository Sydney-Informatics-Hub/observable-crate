---
title: RO-Crate Upload
---
## Crate as two Parquet files

```js
const nodes = FileAttachment("./data/crate/nodes.parquet").parquet();
```

```js
const links = FileAttachment("./data/crate/links.parquet").parquet();
```

### Nodes

```js
Inputs.table(nodes)
```

### Links

```js
Inputs.table(links)
```