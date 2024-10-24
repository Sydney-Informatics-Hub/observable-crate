import {html} from "npm:htl";


import * as d3 from "npm:d3";

const SUPERSET_RELS = [ "hasPart", "memberOf" ];

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
		entity.ancestors[relation].push({
			"id": p.id,
			"value": p.name
		});
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



function to_feature(point) {
	return {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [ 
				point.latitude,
				point.longitude
			]
		}
	};
}



export async function locations(db) {
	const rows = await db.query(`
select p1.source_id as id, p1.property_label as property, p1.value as value
from property p1
   where p1.source_id IN (
   	select p2.source_id
   	FROM property p2
   	WHERE p2.value = 'GeoCoordinates' AND p2.property_label = '@type'
   )
  `);
// SELECT p1.source_id as id, p1.property_label AS property, p1.value AS value
//     FROM property p1
//     LEFT JOIN property p2 ON p2.source_id == p1.source_id
//         AND (p1.property_label = '@type' AND p1.value = 'GeoCoordinates')
// `);
	const points = {};
	rows.map((r) => {
		if( ! points[r.id] ) {
			points[r.id] = {};
		}
		points[r.id][r.property] = r.value;
	});
	const features = Object.keys(points).map((i) => to_feature(points[i]));
   	return {
		"type": "FeatureCollection",
		"features": features
   	} 
}


export async function entity_html(db, entity) {

	return html`

<div class="grid grid-cols-1">

<div class="card">
<h2>${entity.properties.name?.value || entity.id}</h2>
<p>${entity.properties.description?.value || ""}</p>
</div>

</div>

<div class="grid grid-cols-2">

<div class="card">
${relations_html(entity.properties)}
</div>

<div class="card nav">
${navigation(entity)}
</div>

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
	if( values.length === 0 ) {
		return '';
	}
	if( values.length > 1 ) {
		return html`
<p><span class="property">${p}</span>
	<ul class="properties">
		${values.map((l)=>html`<li>${value_html(l)}</li>`)}
	</ul>
</p>`;
	}
	return html`

<p><span class="property">${p}</span> ${value_html(values[0])}</p>
`;

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


function navigation(entity) {
	const used = new Set();
	const parts = [];
	const references = [];
	if( entity.ancestors ) {
		for( const rel of SUPERSET_RELS ) {
			if( entity.ancestors[rel] ) {
				entity.ancestors[rel].map((p) => {
					if( !used.has(p.id) ) {
						parts.push(p);
						used.add(p.id);
					}
				});
			}
		}
		for( const rel of Object.keys(entity.ancestors) ) {
			entity.ancestors[rel].map((p) => {
				if( !used.has(p.id) ) {
					references.push(p);
					used.add(p.id);
				}
			});
		}
	}
	return html`
${property_html("Part of", parts)}

${property_html("Referred to by", references)}
`;
}
