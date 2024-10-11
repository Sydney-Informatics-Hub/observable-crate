---
title: RO-Crate explorer
toc: false
---
```js

import { root_entity, current_crate, make_colour_map  } from "./components/crate.js";
import { forcegraph } from "./components/forcegraph.js";

const crate = current_crate();
const root = root_entity(crate.nodes);
const nodes = Object.keys(crate.nodes).map((eid) => crate.nodes[eid]);


const colours = make_colour_map(crate.types);

```
## ${root.name}

${root.description}

```js
const use_types = view(Inputs.checkbox(crate.types, { 
  multiple: true, 
  label: "Entity types",
  value: crate.types,
}));
```

```js
const use_rels = view(Inputs.checkbox(crate.relations, {
  multiple: true,
  label: "Relationships",
  value: crate.relations,
}));
```

```js
const use_externals = view(Inputs.checkbox(crate.externals, {
  multiple: true,
  label: "External ID domains",
}));
```


```js
const show_nodes = nodes.filter((n) => use_types.includes(n.type[0]));
const show_ids = show_nodes.map((n) => n.id);
const show_links = crate.links.filter(
  (l) => {
    if( !use_rels.includes(l.property) ) {
      return false;
    }
    return show_ids.includes(l.source) && show_ids.includes(l.target);
  });

const svg = forcegraph({nodes: show_nodes, links: show_links}, colours);

display(svg.node());

```