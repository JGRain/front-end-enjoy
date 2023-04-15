<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节介绍获取每个页面目录的名字的过程。</p>
<!--more-->
<h2 id="项目约定" tabindex="-1"><a class="header-anchor" href="#项目约定" aria-hidden="true">#</a> 项目约定</h2>
<h3 id="多页面" tabindex="-1"><a class="header-anchor" href="#多页面" aria-hidden="true">#</a> 多页面</h3>
<p>上节我们讲述了项目的目录结构：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>├── build/                      <span class="token comment"># webpack配置参数文件</span>
│   └── <span class="token punctuation">..</span>.
├── src/                        <span class="token comment"># 项目代码入口</span>
│   ├── page1/                  <span class="token comment"># 第一个页面或者应用</span>
│   │   ├── main.js             <span class="token comment"># 页面/应用入口文件</span>
│   │   └── <span class="token punctuation">..</span>.
│   ├── page2/                  <span class="token comment"># 第二个页面或者应用</span>
│   │   ├── main.js             <span class="token comment"># 页面/应用入口文件</span>
│   │   └── <span class="token punctuation">..</span>.
│   └── pageN/                  <span class="token comment"># 第N个页面或者应用</span>
│       ├── main.js             <span class="token comment"># 页面/应用入口文件</span>
│       └── <span class="token punctuation">..</span>.
├── dist/                       <span class="token comment"># 项目打包代码</span>
│   ├── page1/                  <span class="token comment"># 第一个页面或者应用</span>
│   │   ├── <span class="token punctuation">[</span>hash<span class="token punctuation">]</span>.js
│   │   └── index.html          <span class="token comment"># 页面/应用入口文件</span>
│   ├── page2/                  <span class="token comment"># 第二个页面或者应用</span>
│   │   ├── <span class="token punctuation">[</span>hash<span class="token punctuation">]</span>.js
│   │   └── index.html          <span class="token comment"># 页面/应用入口文件</span>
│   └── pageN/                  <span class="token comment"># 第N个页面或者应用</span>
│       ├── <span class="token punctuation">[</span>hash<span class="token punctuation">]</span>.js
│       └── index.html          <span class="token comment"># 页面/应用入口文件</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们可以看到我们项目代码的入口位于<code v-pre>src</code>文件夹，并且每个页面或者 app 都以目录名为页面的名字。
而打包后的文件也一样，以目录为单位，支持单个打包或是全部打包。</p>
<h2 id="获取目录名" tabindex="-1"><a class="header-anchor" href="#获取目录名" aria-hidden="true">#</a> 获取目录名</h2>
<p>既然目录名字会在我们的项目搭建中起这么重要的作用，这里我们就将它们获取存起来。</p>
<h3 id="glob-模块" tabindex="-1"><a class="header-anchor" href="#glob-模块" aria-hidden="true">#</a> glob 模块</h3>
<p>这里我们将使用<a href="https://www.npmjs.com/package/glob" target="_blank" rel="noopener noreferrer"><code v-pre>glob</code>模块<ExternalLinkIcon/></a>，它允许你使用<code v-pre>*</code>等符号，来写一个<code v-pre>glob</code>规则，像在 shell 里一样，获取匹配对应规则的文件。</p>
<ul>
<li>安装依赖</li>
</ul>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>npm i glob
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>使用方式</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> glob <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"glob"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// options可选</span>
<span class="token function">glob</span><span class="token punctuation">(</span><span class="token string">"**/*.js"</span><span class="token punctuation">,</span> options<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">er<span class="token punctuation">,</span> files</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// files是匹配到文件的文件名数组</span>
  <span class="token comment">// 如果 `nonull` 选项被设置为true，而且没有找到任何文件</span>
  <span class="token comment">// 那么files就是glob规则本身，而不是空数组</span>
  <span class="token comment">// er是当寻找的过程中遇的错误</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>匹配规则
<ul>
<li><code v-pre>*</code>: 匹配该路径段中 0 个或多个任意字符</li>
<li><code v-pre>?</code>: 匹配该路径段中 1 个任意字符</li>
<li><code v-pre>[...]</code>: 匹配该路径段中在指定范围内字符</li>
<li><code v-pre>*(pattern|pattern|pattern)</code>: 匹配括号中多个模型的 0 个或多个或任意个的组合</li>
<li><code v-pre>!(pattern|pattern|pattern)</code>: 匹配不包含任何模型</li>
<li><code v-pre>?(pattern|pattern|pattern)</code>: 匹配多个模型中的 0 个或任意 1 个</li>
<li><code v-pre>+(pattern|pattern|pattern)</code>: 匹配多个模型中的 1 个或多个</li>
<li><code v-pre>@(pattern|pat*|pat?erN)</code>: 匹配多个模型中的任意 1 个</li>
<li><code v-pre>**</code>: 和<code v-pre>*</code>一样，可以匹配任何内容，但<code v-pre>**</code>不仅匹配路径中的某一段，而且可以匹配<code v-pre>'a/b/c'</code>这样带有<code v-pre>'/'</code>的内容，所以它还可以匹配子文件夹下的文件</li>
</ul>
</li>
</ul>
<p>如果熟悉正则的你，相信也对这些规则了如指掌了。</p>
<ul>
<li>参考
<ul>
<li><a href="http://www.cnblogs.com/liulangmao/p/4552339.html" target="_blank" rel="noopener noreferrer">《node-glob 学习》<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h3 id="utils" tabindex="-1"><a class="header-anchor" href="#utils" aria-hidden="true">#</a> utils</h3>
<p>我们把这块获取目录名的功能作为工具单独管理起来，放在<code v-pre>build/utils.js</code>文件里。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// build/utils.js文件</span>
<span class="token keyword">var</span> glob <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"glob"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">getEntries</span><span class="token punctuation">(</span><span class="token parameter">globPath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取所有匹配文件的文件名数组</span>
  <span class="token keyword">var</span> files <span class="token operator">=</span> glob<span class="token punctuation">.</span><span class="token function">sync</span><span class="token punctuation">(</span>globPath<span class="token punctuation">)</span><span class="token punctuation">,</span>
    entries <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  files<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">filepath</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 取倒数第二层(view下面的文件夹)做包名</span>
    <span class="token keyword">var</span> split <span class="token operator">=</span> filepath<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">"/"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> name <span class="token operator">=</span> split<span class="token punctuation">[</span>split<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token comment">// 保存{'目录名': '目录路径'}</span>
    entries<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">"./"</span> <span class="token operator">+</span> filepath<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> entries<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 获取所有匹配src下目录的文件夹名字，其中文件夹里main.js为页面入口</span>
<span class="token keyword">var</span> entries <span class="token operator">=</span> <span class="token function">getEntries</span><span class="token punctuation">(</span><span class="token string">"src/**/main.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">entries</span><span class="token operator">:</span> entries
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>本节介绍的内容不是很多，主要是声明了单页面的目录规范，以及简单介绍了<code v-pre>glob</code>模块，并提供了个获取目录名的工具。<br>
可参考代码<a href="https://github.com/godbasin/vue-multi-pages/blob/master/build/utils.js" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


