---
title: Home
toc: false
---
<style>
ul.properties {
  max-height:100px;
  overflow:auto;
}
</style>

```js

import { root_entity_id, find_entity, entity_html } from "./components/crate.js";

const db = FileAttachment("./data/crate.db").sqlite();

// this sets an event to notice when the hash part of the location
// changes - this is triggered when the user clicks the links in 
//  
let hash = Generators.observe(notify => {
  const hashchange = () => notify(location.hash);
  hashchange();
  addEventListener("hashchange", hashchange);
  return () => removeEventListener("hashchange", hashchange);
});

```

```js
const root_id = await root_entity_id(db);
const root = await find_entity(db, root_id);

async function hash_to_item(hash) {
  if( hash ) {
    const eid = hash.substr(1);
    const node = await find_entity(db, eid);
    if( node ) {
      return node;
    }
  }
  return root;
}


let node = await hash_to_item(hash);

```

```js
const ehtml = await(entity_html(db, node)); 
display(node);

display(ehtml);

```

