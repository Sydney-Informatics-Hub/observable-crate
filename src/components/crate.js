import {html} from "npm:htl";


import * as d3 from "npm:d3";

export async function search(db) {
	return await db.query(`
SELECT node.crate_id as id,
       node.name as name,
       node.description as description
FROM node
`);
}

export async function find_entity(db, eid) {
	return await db.queryRow(`
SELECT node.crate_id AS id, node.name AS name, node.description AS description
 	FROM node
 	WHERE node.crate_id = "${eid}"
`);
}


export async function root_entity(db) {
	return await db.queryRow(`
SELECT link.target AS id, node.name AS name, node.description AS description
 	FROM link
 	INNER JOIN node ON link.target = node.crate_id
 	WHERE source='ro-crate-metadata.json' AND relation='about'
`);
}

export async function links_from(db, eid) {
	return await db.query(`
SELECT link.target AS id, link.relation AS relation,
       node.name AS name, node.description AS description
	FROM link
	INNER JOIN node on link.target = node.crate_id
	where source="${eid}"
`);
}

export async function links_to(db, eid) {
	return await db.query(`
SELECT link.source AS id, link.relation AS relation,
       node.name AS name, node.description AS description
	FROM link
	INNER JOIN node on link.source = node.crate_id
	where target="${eid}"
`);
}



export async function entity_html(db, node) {
	const to_this = await links_to(db, node.id);
	const from_this = await links_from(db, node.id);

	return html`<div class="card">
<h2>${node.name || node.id}</h2>
<p>${node.description || ""}</p>
</div>

<div class="grid grid-cols-2">
<div class="card">
<p>Links to this entity:</p>
${link_list(to_this)}
</div>
<div class="card">
<p>Links from this entity:</p>
${link_list(from_this)}
</div>
</div>`;
}



function link_list(links) {
	return html`<ul class="relations">
		${links.map((l)=>html`<li>${crate_link(l)}</li>`)}
	</ul>`
}



function crate_link(l) {
	const text = l.name || l.id;
	return html`<a href="#${l.id}">${text}</a>`;
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





