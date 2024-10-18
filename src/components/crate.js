import {html} from "npm:htl";


import * as d3 from "npm:d3";

export async function search(db) {
	return await db.query(`
SELECT node.id as id,
       node.name as name,
       node.description as description
FROM node
`);
}



export async function find_entity(db, eid) {
	const props = await db.query(`
SELECT source_id AS id, source_name AS name, property_label as property, target_id as target_id, target_name as target_name, value as value
 	FROM property
 	WHERE source_id = "${eid}"
`);
	if(! props ) {
		return False;
	}
	const parents = await db.query(`
SELECT source_id as id, source_name as name, property_label as property
       FROM property
       WHERE target_id = "${eid}"
`);
	const entity = { id: eid, properties: {}, ancestors: {} };
	for( const p of props ) {
		const relation = p.property;
		if(! entity.properties[relation] ) {
			entity.properties[relation] = [];
		}
		const prop = {
			"property": p.property,
		};
		if( p.target_id ) {
			prop["id"] = p.target_id;
			prop["value"] = p.target_name;
		} else {
			prop["value"] = p.value;
		}		
		entity.properties[relation].push(prop);
	}
	for( const p of parents ) {
		const relation = p.property;
		if(! entity.ancestors[relation] ) {
			entity.ancestors[relation] = [];
		}
		entity.ancestors[relation].push(p);
	}
	return entity;
}


export async function root_entity_id(db) {
	const row = await db.queryRow(`
SELECT target_id AS id
 	FROM property
 	WHERE source_id='ro-crate-metadata.json' AND property_label='about'
`);
	return row.id;
}


export async function links_to(db, eid) {
	return await db.query(`
SELECT link.source AS id, link.relation AS relation,
       node.name AS name, node.description AS description
	FROM link
	INNER JOIN node on link.source = node.id
	where target="${eid}"
`);
}



export async function entity_html(db, entity) {

	return html`<div class="card">
<h2>${entity.properties.name?.value || entity.id}</h2>
<p>${entity.properties.description?.value || ""}</p>

<p>Properties</p>
${relations_html(entity.properties)}

<p>Ancestors</p>
${relations_html(entity.ancestors)}

</div>`;
}


function relations_html(relations) {
	const props = Object.keys(relations).filter(
		(p) => p != 'name' && p != 'description'
	);
	const prop_html_bits = props.map((p) => property_html(p, relations[p]));
	return prop_html_bits;
}


function property_html(p, values) {
	if( values.length > 1 ) {
		return html`
<div>${p}</div>
<div>
	<ul class="properties">
		${values.map((l)=>html`<li>${value_html(l)}</li>`)}
	</ul>
</div>`;
	} else {
		return html`
<div>${p}<div>
<div>${value_html(values[0])}</div>`;
	}

}


function value_html(v) {
	if( v.id ) {
		return value_link(v);
	} else {
		return html`<span class="value">${v.value}</span>`;
	}
}


function value_link(l) {
	const text = l.value || l.id;
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





