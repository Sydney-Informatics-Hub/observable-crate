import {html} from "https://cdn.jsdelivr.net/npm/htl@0.3.1/+esm";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

export function root_entity(entities) {
	const root_id = entities['ro-crate-metadata.json']['links_from']['about'][0];
	return entities[root_id];
}

export function crate_link(entities, i) {
	const target = entities[i];
	const text = target.name || i;
	return html`<a href="#${i}">${text}</a>`;
}

export function entity_links(entities, dir, entity) {
	return html`<ul>${
		Object.keys(entity[dir]).map((prop) => html`<li>${prop}
			${link_list(entities, entity[dir][prop])}
		</li>`)
	}</ul>`
} 

function link_list(entities, links) {
	return html`<ul class="relations">
		${links.map((i)=>html`<li>${crate_link(entities, i)}</li>`)}
	</ul>`
}

export function make_colour_map(types) {
	const tlist = Array.from(types);
	const cmap = {};
	for( const i in tlist) {
		cmap[tlist[i]] = d3.schemeCategory10[i];
	}
	return (tarray) => {
		return cmap[tarray[0]]
	} 
}



export function entity(nodes, node) {
	return html`<div class="card">
<h2>${node.name || node.id}</h2>
<p>${node.description || ""}</p>
</div>

<div class="grid grid-cols-2">
<div class="card">
<p>Links to this entity:</p>
${entity_links(nodes, "links_to", node)}
</div>
<div class="card">
<p>Links from this entity:</p>
${entity_links(nodes, "links_from", node)}
</div>
</div>`;
}


export function naive_tree(crate) {
	const nodes = crate.nodes;
	const links = crate.links;
	const seen = new Set();
	const tree = {};
	const path_delim = "|";

	const root = root_entity(crate.nodes);

	tree[root.id] = root.name;

	naive_tree_r(nodes, seen, root.id, tree, root.links_from);
	return Object.keys(tree);
}

function naive_tree_r(nodes, seen, stem, tree, links) {
	for( const prop in links ) {
		for( const i of links[prop] ) {
			if( !seen.has(i) ) {
				seen.add(i);
				const path = stem + '|' + nodes[i].name;
				tree[path] = nodes[i].name;
				naive_tree_r(nodes, seen, path, tree, nodes[i].links_from)
			}
		}
	}
}

