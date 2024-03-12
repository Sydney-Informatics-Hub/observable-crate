---
title: RO-Crate explorer
toc: true
---
```js

import { root_entity, entity_links } from "./components/crate.js";

const entities = await FileAttachment("./data/entities.json").json();
const root = root_entity(entities);
let entity = root;

let hash = Generators.observe(notify => {
  const hashchange = () => notify(location.hash);
  hashchange();
  addEventListener("hashchange", hashchange);
  return () => removeEventListener("hashchange", hashchange);
});

function load_entity(eid) {
	if( eid in entities) {
		entity = entities[eid]
	}
}



```

## ${root.name}


<h2>${entity.name}</h2>
<p><pre>${entity.id}</pre></p>
<p>${entity.description}</p>

${entity_links(entities, entity, (eid) => load_entity(eid))}

<p>hash is ${hash}</p>


