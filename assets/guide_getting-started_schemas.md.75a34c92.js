import{_ as s,o as a,c as n,O as p}from"./chunks/framework.4cdeba06.js";const i=JSON.parse('{"title":"ObjectPaser schemas","description":"","frontmatter":{},"headers":[],"relativePath":"guide/getting-started/schemas.md","filePath":"guide/getting-started/schemas.md","lastUpdated":1687021949000}'),l={name:"guide/getting-started/schemas.md"},e=p(`<h1 id="objectpaser-schemas" tabindex="-1">ObjectPaser schemas <a class="header-anchor" href="#objectpaser-schemas" aria-label="Permalink to &quot;ObjectPaser schemas&quot;">​</a></h1><p>ObjectParser has 2 structures that are needed to parse objects: <a href="./../../api/types/schema">ObjectSchema</a> and <a href="./../../api/types/property-schema">PropertySchema</a>. They describe what an object and its properties should be.</p><h2 id="object-schema" tabindex="-1">Object schema <a class="header-anchor" href="#object-schema" aria-label="Permalink to &quot;Object schema&quot;">​</a></h2><p>This schema type is used to describe object hierarchies and applied to an object. Use <a href="./../../api/schema">.schema()</a> to create.</p><p>Example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">a</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">b</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [Number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Number]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">c</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">d</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> Function</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>The object that was passed to the function will be converted to a schema, where each property will be a property schema or a nested schema.</p><h2 id="property-schema" tabindex="-1">Property schema <a class="header-anchor" href="#property-schema" aria-label="Permalink to &quot;Property schema&quot;">​</a></h2><p>This type of schema is used to describe a property of an object and applied to an object property. Use <a href="./../../api/property">.property()</a> to create.</p><p>Example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">property</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">required</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">default</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Hello World</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">validator</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">val</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> val</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">length </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="immutable" tabindex="-1">Immutable <a class="header-anchor" href="#immutable" aria-label="Permalink to &quot;Immutable&quot;">​</a></h2><p><strong>All schemas are immutable</strong>, which guarantees that they will not change properties at runtime and that two identical objects will have same results at different intervals.</p><p>Example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> propertySchema </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">property</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">propertySchema</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">type </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [Number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Boolean]</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; throws an error</span></span></code></pre></div><h2 id="combining" tabindex="-1">Combining <a class="header-anchor" href="#combining" aria-label="Permalink to &quot;Combining&quot;">​</a></h2><p><strong>All schemas are reusable</strong>, which allows you to create complex structures from smaller ones and can completely remove the need to duplicate code. It also allows for more efficient use of memory.</p><p>Example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">// Shared schemas</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> id </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">property</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [Number</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> String]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> username </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">property</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> tag </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  id</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> tags </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">property</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> Array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">element</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> tag</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// Other schemas</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userInfoSchema </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  id</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> userName</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> postDataSchema </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  id</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  tags</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">title</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">user</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> userInfoSchema</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><p>In this example, we have created <code>id</code>, <code>username</code>, <code>tags</code> property schemas, where the tags schema depends on the <code>tag</code> object schema. And then, they used them in complex schemes <code>userInfoSchema</code> and <code>postDataSchema</code>.</p>`,20),o=[e];function t(c,r,D,y,A,F){return a(),n("div",null,o)}const h=s(l,[["render",t]]);export{i as __pageData,h as default};