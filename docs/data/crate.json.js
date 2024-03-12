// turn an RO-Crate into a hash of entities

// const CRATE_URL = 'https://raw.githubusercontent.com/Sydney-Informatics-Hub/Heurist-Integration/main/ro-crates/OMAA/ro-crate-metadata.json';

//const CRATE_URL = 'https://data.ldaca.edu.au/api/object/meta?resolve-parts&noUrid&id=arcp%3A%2F%2Fname%2Cinternational-corpus-of-english-australia';

const CRATE_URL = 'https://data.ldaca.edu.au/api/object/meta?resolve-parts&noUrid&id=arcp%3A%2F%2Fname%2CAustLit';

// const CRATE_URL = 'https://data.ldaca.edu.au/api/object/meta?resolve-parts&noUrid&id=arcp%3A%2F%2Fname%2Cdoi10.25910%252Fjkwy-wk76';

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

function addLink(proplist, prop, id) {
	if( !(prop in proplist) ) {
		proplist[prop] = [];
	}
	proplist[prop].push(id);
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
	node['type'] = e['@type'];
	node['right'] = {};
	node['left'] = {};
	nodes[e['@id']] = node;
});


const links = [];

// Add right and left links to the nodes and
// build a separate links array for the graph

crate.graph.map((s) => {
	for ( const prop in s ) {
		const sid = s['@id'];
		if( prop[0] !== '@' ) {
			const vals = asArray(s[prop]);
			vals.map((t) => {
				const tid = t['@id'];
				if( tid ) {
					const rel = makeId(relations, prop);
					if( sid in nodes && tid in nodes ) {
						addLink(nodes[sid].right, prop, tid);
						addLink(nodes[tid].left, prop, sid);
						links.push({
							source: sid,
							target: tid,
							value: rel,
						})
					}
				}
			});
		}
	}
}) 

process.stdout.write(JSON.stringify({ nodes: nodes, links: links }));
