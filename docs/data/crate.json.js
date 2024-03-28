// turn an RO-Crate into a hash of entities

// const CRATE_URL = 'https://raw.githubusercontent.com/Sydney-Informatics-Hub/Heurist-Integration/main/ro-crates/OMAA/ro-crate-metadata.json';

//const CRATE_URL = 'https://data.ldaca.edu.au/api/object/meta?resolve-parts&noUrid&id=arcp%3A%2F%2Fname%2Cinternational-corpus-of-english-australia';

// const CRATE_URL = 'https://data.ldaca.edu.au/api/object/meta?resolve-parts&noUrid&id=arcp%3A%2F%2Fname%2CAustLit';

// const CRATE_URL = 'https://data.ldaca.edu.au/api/object/meta?resolve-parts&noUrid&id=arcp%3A%2F%2Fname%2Cdoi10.25910%252Fjkwy-wk76';

const CRATE_URL = 'https://raw.githubusercontent.com/Language-Research-Technology/language-data-commons-vocabs/master/ontology/ro-crate-metadata.json';
import {ROCrate} from 'ro-crate';

const response = await fetch(CRATE_URL);
if( !response.ok ) {
	throw new Error(`fetch failed: ${response.status}`);
}

const crateJson = await response.json();
const crate = new ROCrate(crateJson);

const types = [];
const relations = [];
const externals = [];

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
		process.stderr.write(`${id} not a url: ${e}`);
		return null;
	}
}


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
}) 

// 

process.stdout.write(JSON.stringify({
	nodes: nodes,
	links: links,
	types: types.sort(),
	relations: relations.sort(),
	externals: externals.sort(),
 }, null, 2));
