// turn an RO-Crate into a hash of entities

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


// build a hash-by-id of entities

const nodes = {};


crate.graph.map((e) => {
	const type_g = makeId(types, e['@type']); // mutiple types!!
	const node = {};
	node['id'] = e['@id'];
	node['name'] = e['name'];
	node['description'] = e['description'];
	node['group'] = type_g;
	node['children'] = [];
	node['parents'] = [];
	nodes[e['@id']] = node;
});


// add links in -> (parent) and links out -> (child)

crate.graph.map((source) => {
	for ( const prop in source ) {
		const sid = source['@id'];
		if( prop[0] !== '@' ) {
			const vals = asArray(source[prop]);
			vals.map((target) => {
				const tid = target['@id'];
				if( tid ) {
					if( sid in nodes && tid in nodes ) {
						nodes[sid].children.push(`${prop}|${tid}`);
						nodes[tid].parents.push(`${prop}|${sid})`);
					}
				}
			});
		}
	}
}) 

process.stdout.write(JSON.stringify(nodes));
