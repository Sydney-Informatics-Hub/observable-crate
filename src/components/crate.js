import {html} from "npm:htl";

import * as d3 from "npm:d3";

const crate_db = FileAttachment("./data/crate.db").sqlite();

export function root_entity() {
//
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


