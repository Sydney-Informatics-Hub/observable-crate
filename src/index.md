---
title: Home
toc: false
---
```js

import { root_entity, links_from, links_to } from "./components/crate.js";

const db = FileAttachment("./data/crate.db").sqlite();



```

```js
const root = await root_entity(db);
const links_f = await links_from(db, root.id);
const links_t = await links_to(db, root.id);
```

## root

```js
display(root);

```

## links_to
```js
display(links_t);
```

## links_from
```js
display(links_f);

```
