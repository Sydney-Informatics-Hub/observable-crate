const u=new Map;function m(n,e){const t=String(new URL(n,location.href));e==null?u.delete(t):u.set(t,e)}function h(n,e=location.href){if(new.target!==void 0)throw new TypeError("FileAttachment is not a constructor");const t=String(new URL(n,e)),r=u.get(t);if(!r)throw new Error(`File not found: ${n}`);const{path:i,mimeType:o}=r;return new f(i,n.split("/").pop(),o)}async function a(n){const e=await fetch(await n.url());if(!e.ok)throw new Error(`Unable to load file: ${n.name}`);return e}async function y(n,e,{array:t=!1,typed:r=!1}={}){const[i,o]=await Promise.all([n.text(),import("https://cdn.jsdelivr.net/npm/d3-dsv@3.0.1/+esm")]);return(e==="	"?t?o.tsvParseRows:o.tsvParse:t?o.csvParseRows:o.csvParse)(i,r&&o.autoType)}class p{constructor(e,t){Object.defineProperty(this,"name",{value:e,enumerable:!0}),t!==void 0&&Object.defineProperty(this,"mimeType",{value:t+"",enumerable:!0})}async blob(){return(await a(this)).blob()}async arrayBuffer(){return(await a(this)).arrayBuffer()}async text(e){return e===void 0?(await a(this)).text():new TextDecoder(e).decode(await this.arrayBuffer())}async json(){return(await a(this)).json()}async stream(){return(await a(this)).body}async csv(e){return y(this,",",e)}async tsv(e){return y(this,"	",e)}async image(e){const t=await this.url();return new Promise((r,i)=>{const o=new Image;new URL(t,document.baseURI).origin!==new URL(location).origin&&(o.crossOrigin="anonymous"),Object.assign(o,e),o.onload=()=>r(o),o.onerror=()=>i(new Error(`Unable to load file: ${this.name}`)),o.src=t})}async arrow(){const[e,t]=await Promise.all([import("https://cdn.jsdelivr.net/npm/apache-arrow@13.0.0/+esm"),a(this)]);return e.tableFromIPC(t)}async parquet(){const[e,t,r]=await Promise.all([import("https://cdn.jsdelivr.net/npm/apache-arrow@13.0.0/+esm"),import("https://cdn.jsdelivr.net/npm/parquet-wasm@0.5.0/esm/arrow1.js").then(async i=>(await i.default(),i)),this.arrayBuffer()]);return e.tableFromIPC(t.readParquet(new Uint8Array(r)).intoIPCStream())}async sqlite(){const[{SQLiteDatabaseClient:e},t]=await Promise.all([import("./stdlib/sqlite.js"),this.arrayBuffer()]);return e.open(t)}async zip(){const[{ZipArchive:e},t]=await Promise.all([import("./stdlib/zip.js"),this.arrayBuffer()]);return e.from(t)}async xml(e="application/xml"){return new DOMParser().parseFromString(await this.text(),e)}async html(){return this.xml("text/html")}async xlsx(){const[{Workbook:e},t]=await Promise.all([import("./stdlib/xlsx.js"),this.arrayBuffer()]);return e.load(t)}}class f extends p{constructor(e,t,r){super(t,r),Object.defineProperty(this,"_url",{value:e})}async url(){return await this._url+""}}Object.defineProperty(f,"name",{value:"FileAttachment"}),h.prototype=f.prototype;async function*c(n){let e,t,r=!1;const i=n(o=>(t=o,e?(e(o),e=null):r=!0,o));if(i!=null&&typeof i!="function")throw new Error(typeof i.then=="function"?"async initializers are not supported":"initializer returned something, but not a dispose function");try{for(;;)yield r?(r=!1,t):new Promise(o=>e=o)}finally{i?.()}}function d(n){return c(e=>{const t=b(n);let r=w(n);const i=()=>e(w(n));return n.addEventListener(t,i),r!==void 0&&e(r),()=>n.removeEventListener(t,i)})}function w(n){switch(n.type){case"range":case"number":return n.valueAsNumber;case"date":return n.valueAsDate;case"checkbox":return n.checked;case"file":return n.multiple?n.files:n.files[0];case"select-multiple":return Array.from(n.selectedOptions,e=>e.value);default:return n.value}}function b(n){switch(n.type){case"button":case"submit":case"checkbox":return"click";case"file":return"change";default:return"input"}}async function*v(){for(;;)yield Date.now()}async function*P(n){let e;const t=[],r=n(i=>(t.push(i),e&&(e(t.shift()),e=null),i));if(r!=null&&typeof r!="function")throw new Error(typeof r.then=="function"?"async initializers are not supported":"initializer returned something, but not a dispose function");try{for(;;)yield t.length?t.shift():new Promise(i=>e=i)}finally{r?.()}}function g(n,e){return c(t=>{let r;const i=new ResizeObserver(([o])=>{const s=o.contentRect.width;s!==r&&t(r=s)});return i.observe(n,e),()=>i.disconnect()})}var x=Object.freeze({__proto__:null,input:d,now:v,observe:c,queue:P,width:g});function O(n){let e;return Object.defineProperty(c(t=>{e=t,n!==void 0&&e(n)}),"value",{get:()=>n,set:t=>void e(n=t)})}function R(n,e){const t=document.createElement("div");t.style.position="relative",n.length!==1&&(t.style.height="100%");const r=new ResizeObserver(([i])=>{const{width:o,height:s}=i.contentRect;for(;t.lastChild;)t.lastChild.remove();if(o>0){const l=n(o,s);n.length!==1&&j(l)&&(l.style.position="absolute"),t.append(l)}});return r.observe(t),e?.then(()=>r.disconnect()),t}function j(n){return n.nodeType===1}export{p as AbstractFile,h as FileAttachment,x as Generators,O as Mutable,m as registerFile,R as resize};