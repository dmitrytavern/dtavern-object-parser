import{_ as s,o as t,c as o,O as n}from"./chunks/framework.4cdeba06.js";const C=JSON.parse('{"title":".utils.isPrimitiveConstructors(constructors)","description":"","frontmatter":{},"headers":[],"relativePath":"api/utilities/is-primitive-constructors.md","filePath":"api/utilities/is-primitive-constructors.md","lastUpdated":1687021949000}'),e={name:"api/utilities/is-primitive-constructors.md"},a=n(`<h1 id="utils-isprimitiveconstructors-constructors" tabindex="-1">.utils.isPrimitiveConstructors(constructors) <a class="header-anchor" href="#utils-isprimitiveconstructors-constructors" aria-label="Permalink to &quot;.utils.isPrimitiveConstructors(constructors)&quot;">​</a></h1><p>Returns <code>true</code> if the argument is a <strong>primitive constructor</strong> or an <strong>array of primitive constructors</strong>, otherwise returns <code>false</code>.</p><p>Primitive constructors: <code>String</code>, <code>Number</code>, <code>Boolean</code>, <code>BigInt</code>, <code>Symbol</code>.</p><p>Usage exmaple:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">isPrimitiveConstructors</span><span style="color:#A6ACCD;">(String)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">isPrimitiveConstructors</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">null</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#82AAFF;">isPrimitiveConstructors</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">undefined</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#82AAFF;">isPrimitiveConstructors</span><span style="color:#A6ACCD;">(Object)</span></span>
<span class="line"><span style="color:#82AAFF;">isPrimitiveConstructors</span><span style="color:#A6ACCD;">([])</span></span>
<span class="line"><span style="color:#82AAFF;">isPrimitiveConstructors</span><span style="color:#A6ACCD;">([String</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Object])</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; false</span></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">Note</p><p>If you pass <code>null</code> or <code>undefined</code> type, the function returns false. These types are not a constructor.</p></div>`,6),i=[a];function r(c,l,p,u,d,m){return t(),o("div",null,i)}const y=s(e,[["render",r]]);export{C as __pageData,y as default};