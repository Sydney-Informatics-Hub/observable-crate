import {html} from "npm:htl";
import {Generators} from "npm:@observablehq/stdlib"

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
			<ul>
				${entity[dir][prop].map((i)=>html`<li>${crate_link(entities, i)}</li>`)}
			</ul>
		</li>`)
	}</ul>`
}

