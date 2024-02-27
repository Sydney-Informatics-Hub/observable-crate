// fetch an RO-Crate and turn the graph into nodes and links for 
// the d3 force-directed graph


const CRATE_URL = 'https://raw.githubusercontent.com/Sydney-Informatics-Hub/Heurist-Integration/main/ro-crates/OMAA/ro-crate-metadata.json';

import {ROCrate} from 'ro-crate';

const response = await fetch(CRATE_URL);
if( !response.ok ) {
	throw new Error(`fetch failed: ${response.status}`);
}

const crateJson = await response.json();
const crate = new ROCrate(crateJson);

const types = [];
const relations = [];

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

function node_found(nodes, i) {
	const found = nodes.filter((e) => e.id === i);
	return found.length > 0;
}

// build a list of nodes

const nodes = crate.graph.map((e) => {
	const t = makeId(types, e['@type']);
	return {
		id: e['@id'],
		group: t,
		name: e['name'],
		description: e['description']
	};
});


// add the links

const links = [];

crate.graph.map((e) => {
	for ( const prop in e ) {
		if( prop[0] !== '@' ) {
			const vals = asArray(e[prop]);
			vals.map((v) => {
				if( v['@id'] ) {
					const rel = makeId(relations, prop);
					if( node_found(nodes, e['@id']) && node_found(nodes, v['@id']) ) {
						links.push({
							source: e['@id'],
							target: v['@id'],
							value: rel,
						})
					}
				}
			});
		}
	}
}) 

process.stdout.write(JSON.stringify({ nodes: nodes, links: links }));
