import{_ as s,o as t,c as n,O as a}from"./chunks/framework.4cdeba06.js";const g=JSON.parse('{"title":".utils.getConstructors(argument)","description":"","frontmatter":{},"headers":[],"relativePath":"api/utilities/get-constructors.md","filePath":"api/utilities/get-constructors.md","lastUpdated":1687021949000}'),e={name:"api/utilities/get-constructors.md"},o=a(`<h1 id="utils-getconstructors-argument" tabindex="-1">.utils.getConstructors(argument) <a class="header-anchor" href="#utils-getconstructors-argument" aria-label="Permalink to &quot;.utils.getConstructors(argument)&quot;">​</a></h1><p>Returns an <strong>array of constructors</strong> by the object prototype hierarchy. See <a href="./../types/constructor">Constructor[]</a> type.</p><p>Usage example:</p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#82AAFF;">getConstructors</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">null</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; []</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">getConstructors</span><span style="color:#A6ACCD;">(</span><span style="color:#FF9CAC;">true</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; [Boolean, Object]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">getConstructors</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; [Object]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">getConstructors</span><span style="color:#A6ACCD;">([])</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; [Array, Object]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">getConstructors</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// =&gt; [Function, Object]</span></span></code></pre></div>`,4),l=[o];function p(c,r,i,u,y,C){return t(),n("div",null,l)}const _=s(e,[["render",p]]);export{g as __pageData,_ as default};
