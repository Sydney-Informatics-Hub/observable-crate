// fetch an RO-Crate and turn the graph into nodes and links for 
// the d3 force-directed graph


const CRATE_URL = 'https://raw.githubusercontent.com/Sydney-Informatics-Hub/Heurist-Integration/main/ro-crates/OMAA/ro-crate-metadata.json';

const {ROCrate} = require('ro-crate');

const response = await fetch(CRATE_URL);
if( !response.ok ) {
	thrown new Error(`fetch failed: ${response.status}`);
}

const crateJson = await response.json();
const crate = new ROCrate(crateJson);

const nodes = [];
const links = [];
const types = [];

function typeId(type) {
	const i = types.findIndex((t) => t === type);
	if( i === -1 ) {
		types.push(type);
		return types.length - 1; 
	}
	return i;
}



crate.graph.map((e) => {
	const t = typeId(e['@type']);
	nodes.push({
		id: e['@id'],
		group: t,
		name: e['name'],
		description: e['description']
	}
});

process.stdout.write(JSON.stringify({ nodes: nodes }));
