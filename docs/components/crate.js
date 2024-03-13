import {html} from "npm:htl";

export function root_entity(entities) {
	const root_id = entities['ro-crate-metadata.json']['right']['about'][0];
	return entities[root_id];
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

