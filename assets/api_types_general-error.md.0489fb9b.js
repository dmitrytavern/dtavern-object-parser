import{_ as e,c as s,o as r,a}from"./app.0827ef81.js";const C=JSON.parse('{"title":"GeneralError type","description":"","frontmatter":{},"headers":[],"relativePath":"api/types/general-error.md","lastUpdated":1675532630000}'),o={name:"api/types/general-error.md"},n=a(`<h1 id="generalerror-type" tabindex="-1">GeneralError type <a class="header-anchor" href="#generalerror-type" aria-hidden="true">#</a></h1><p>The property error wrapper for the parser. Keys:</p><ul><li><code>key</code> - key of invalid property.</li><li><code>error</code> - an error object. Can be <a href="./property-error">PropertyError</a> or <a href="./object-error">ObjectError</a>.</li></ul><p>Usage example:</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> obj</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">GeneralError</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">key</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">propertyKey</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">error</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{...},</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// PropertyError or ObjectError</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,5),p=[n];function l(t,c,y,i,D,d){return r(),s("div",null,p)}const F=e(o,[["render",l]]);export{C as __pageData,F as default};