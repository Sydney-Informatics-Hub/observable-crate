---
title: Explorer
toc: false
---
<style>
ul.relations {
	max-height:100px;
	overflow:auto;
}
</style>
```js

import { root_entity, entity, current_crate } from "./components/crate.js";

const crate = current_crate();
const nodes = crate.nodes;

const nodes_array = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);

const root = root_entity(nodes);

let hash = Generators.observe(notify => {
  const hashchange = () => notify(location.hash);
  hashchange();
  addEventListener("hashchange", hashchange);
  return () => removeEventListener("hashchange", hashchange);
});

```

## ${root ? root.name : 'No RO-Crate loaded'}

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

function match_node(n, search) {
  if( !search ) {
      return true;
  }
  const lcs = search.toLowerCase();
  return n.name?.toLowerCase().includes(lcs) || n.description?.toLowerCase().includes(lcs);
}

const search = view(Inputs.text({
  label: "Search",
  placeholder: "search names and descriptions",
  value: ""
}));

```

```js

const filtered = nodes_array.filter((n) => match_node(n, search));

if( search ) {
  filtered.map((n) => display(entity(nodes, n)));
} else {
  if( node ) {
    display(entity(nodes, node));
  } else {
    display(html`<p><a href="load.html">Load an RO-Crate</a></p>`)
  }
}
```
