

import {ROCrate} from "https://cdn.jsdelivr.net/npm/ro-crate@3.3.5/+esm";


function makeId(collection, thing) {
	const i = collection.findIndex((t) => t === thing);
	if( i === -1 ) {
		collection.push(thing);
		return collection.length - 1; 
	}
	return i;
}

function asArray(value) {
	if( Array.isArray(value) ) {
		return value;
	}
	return [ value ];
}

function notArray(value) {
	if( Array.isArray(value) ) {
		return value.join(' ')
	} else {
		return value;
	}
}

function addLink(proplist, prop, id) {
	if( !(prop in proplist) ) {
		proplist[prop] = [];
	}
	proplist[prop].push(id);
}

function isValidURL(id) {
	try {
		const url_id = new URL(id);
		return url_id;
	} catch(e) {
		return null;
	}
}


export function load_crate(json) {

	const crate = new ROCrate(json);

	const types = [];
	const relations = [];
	const externals = [];


	// build a hash-by-id of entities
	const nodes = {};


	crate.graph.map((e) => {
		const node = {};
		node['id'] = e['@id'];
		node['name'] = notArray(e['name']);
		node['description'] = notArray(e['description']);
		node['type'] = asArray(e['@type']);
		node['type'].map((t) => makeId(types, t));
		node['links_to'] = {};
		node['links_from'] = {};
		nodes[e['@id']] = node;
	});


	const links = [];

	const external = [];

	// Add right and left links to the nodes and
	// build a separate links array for the graph
	// FIXME - if the crate has bidirectional links this will create too many

	crate.graph.map((s) => {
		for ( const prop in s ) {
			const sid = s['@id'];
			if( prop[0] !== '@' ) {
				const vals = asArray(s[prop]);
				vals.map((t) => {
					const tid = t['@id'];
					if( tid ) {
						const rel = makeId(relations, prop);
						if( tid in nodes ) {
							addLink(nodes[sid].links_from, prop, tid);
							addLink(nodes[tid].links_to, prop, sid);
							links.push({
								source: sid,
								target: tid,
								value: rel,
								property: prop,
							})
						} else {
							const external_id = isValidURL(tid);
							if( external_id ) {
								makeId(externals, external_id.origin);
							}
						}
					}
				});
			}
		}
	});
	return {
		nodes: nodes,
		links: links,
		types: types.sort(),
		relations: relations.sort(),
		externals: externals.sort(),
 	};
 }
