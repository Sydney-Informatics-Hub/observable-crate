---
title: RO-Crate Upload
toc: false
---
```js

import { load_crate } from "./components/loader.js";
import { current_crate, root_entity  } from "./components/crate.js";


```
## RO-Crate

Load an rocrate-metadata.json file: as this is a static site, the crate is
stored in your browser session and won't persist.

Note that this is very experimental and will likely fail for files > 5MB.

```js

const cratefile = view(Inputs.file({label: "ro-crate JSON", accept: ".json", required: true}));

```

```js

const cratejson = cratefile.json();
```

```js


const crate = load_crate(cratejson);
const root = root_entity(crate.nodes);


```

```js

sessionStorage.setItem('ro-crate', JSON.stringify(crate))

display(html`<p>RO-Crate file loaded</p>`);

display(html`<h3>${root.name}</h3>`);
display(html`<p>${root.description}</p>`);
display(html`<a href="./">Explore this crate...</a>`);

```



