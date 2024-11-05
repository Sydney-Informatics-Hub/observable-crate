---
title: Map
toc: false
---
<style>
ul.properties {
  max-height:100px;
  overflow:auto;
}
</style>

```js

import { locations } from "./components/crate.js";

const db = FileAttachment("./data/crate.db").sqlite();

```

```js
const points = await locations(db);

const div = display(document.createElement("div"));
div.style = "height: 400px;";



const map = L.map(div)
  .setView([-26, 134.2], 3);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})
  .addTo(map);

L.geoJSON(points, {
  onEachFeature: (feature, layer) => {
      layer.bindPopup(`<b>${feature.properties.name}</b>`);
  }
}).addTo(map);

// display(ehtml);


```

