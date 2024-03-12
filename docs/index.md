---
title: Home
toc: false
---
```js

import { root_entity, entity_links } from "./components/crate.js";

const crate = await FileAttachment("./data/crate.json").json();
const nodes = crate.nodes;
const root = root_entity(nodes);

let hash = Generators.observe(notify => {
  const hashchange = () => notify(location.hash);
  hashchange();
  addEventListener("hashchange", hashchange);
  return () => removeEventListener("hashchange", hashchange);
});

```

```js
function hash_to_item(hash) {
	if( hash ) {
		const eid = hash.substr(1);
		if( nodes[eid] ) {
			return nodes[eid];
		}
	}
	return root;
}

let node = hash_to_item(hash);


```

## ${node.id == "./" ? "RO-Crate" : root.name }

<div class="card">
<h2>${node.name || node.id}</h2>
<p>${node.description || ""}</p>
</div>

<div class="grid grid-cols-2">
<div class="card">
${entity_links(nodes, "left", node)}
</div>

<div class="card">
${entity_links(nodes, "right", node)}
</div>
</div



