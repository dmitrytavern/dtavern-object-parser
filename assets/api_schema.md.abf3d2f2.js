import{_ as s,c as a,o as n,a as p}from"./app.0827ef81.js";const F=JSON.parse('{"title":".schema(object)","description":"","frontmatter":{},"headers":[],"relativePath":"api/schema.md","lastUpdated":1687019925000}'),l={name:"api/schema.md"},e=p(`<h1 id="schema-object" tabindex="-1">.schema(object) <a class="header-anchor" href="#schema-object" aria-hidden="true">#</a></h1><p>Creates an object schema.</p><ul><li><code>object</code> - a raw object or an array of strings. See <a href="./types/raw-schema">RawSchema</a> type.</li></ul><h2 id="schema-from-a-raw-object" tabindex="-1">Schema from a raw object <a class="header-anchor" href="#schema-from-a-raw-object" aria-hidden="true">#</a></h2><p>Schema creates by an object, where properies can be: <a href="./types/constructor">Constructor</a>, <a href="./types/constructor">Constructor[]</a>, <a href="./types/schema">Schema</a>, <a href="./types/property-schema">PropertySchema</a> or <strong>nested object</strong>.</p><p>Structure example:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  // Creates a default property schema</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: null</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // Creates a default property schema</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: undefined</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // Creates a property schema where type is String</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: String</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // Creates a property schema where type is String and Boolean</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: [String, Boolean]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // Uses a created nested schema</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: parser.schema()</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // Uses a created property schema</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: parser.property()</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  // Creates a nested schema</span></span>
<span class="line"><span style="color:#A6ACCD;">  &lt;property-name&gt;: {</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;property-name&gt;: String</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;property-name&gt;: [String, Boolean]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Code example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">a</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">null,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">b</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">undefined,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">c</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">d</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [String</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Boolean]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">i</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">f</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">property</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">g</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">a</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> String</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">b</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [String</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Boolean]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">Recommendation</p><p>If you are using already created schemes, they will <strong>not be re-created</strong>. Since schemas are immutable, they can be combined to minimize memory usage.</p></div><h2 id="schema-from-an-array" tabindex="-1">Schema from an array <a class="header-anchor" href="#schema-from-an-array" aria-hidden="true">#</a></h2><p>Schema creates by an array of strings.</p><p>Structure example:</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">[</span></span>
<span class="line"><span style="color:#A6ACCD;">  &#39;a&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  &#39;a.b&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  &#39;c.d.f&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>Code example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">([</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">a</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">a.b</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">c.d</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">])</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   a: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     b: parser.property(null) // A default schema property</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   },</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   c: {</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//     d: parser.property(null) // A default schema property</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">//   }</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// }</span></span>
<span class="line"></span></code></pre></div><h2 id="error-handling" tabindex="-1">Error handling <a class="header-anchor" href="#error-handling" aria-hidden="true">#</a></h2><p>If the attribute is invalid, the properties of the object will be of the wrong type, or the object will have a circular structure - throws.</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">undefined</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; throwns an error</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">a</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">string</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; throwns an error</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> obj </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">a</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">b</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">obj</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">a</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">b</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">c </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> obj</span></span>
<span class="line"><span style="color:#A6ACCD;">parser</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">schema</span><span style="color:#A6ACCD;">(obj)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; throwns an error (a circular structure)</span></span>
<span class="line"></span></code></pre></div>`,19),o=[e];function t(c,r,y,D,C,i){return n(),a("div",null,o)}const h=s(l,[["render",t]]);export{F as __pageData,h as default};
