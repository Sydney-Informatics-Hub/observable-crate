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

import { root_entity, entity } from "./components/crate.js";

const crate = await FileAttachment("./data/crate.json").json();
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

## ${root.name }

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
  display(entity(nodes, node));
}
```
