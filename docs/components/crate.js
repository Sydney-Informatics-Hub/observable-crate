import {html} from "npm:htl";

export function root_entity(entities) {
	const root_id = entities['ro-crate-metadata.json']['right']['about'][0];
	return entities[root_id];
}

export function crate_link(entities, i) {
	const target = entities[i];
	return html`<a href="#${i}">${target.name}</a>`;
}

export function entity_links(entities, entity) {
	return html`<ul>${
		Object.keys(entity.right).map((prop) => html`<li>${prop}
			<ul>
				${entity.right[prop].map((i)=>html`<li>${crate_link(entities, i)}</li>`)}
			</ul>
		</li>`)
	}</ul>`
}
