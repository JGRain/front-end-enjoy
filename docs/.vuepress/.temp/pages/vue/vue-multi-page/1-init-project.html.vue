<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节作为首节内容，主要简单介绍一些 webpack 相关的常用配置。</p>
<!--more-->
<h1 id="webpack-基本概念" tabindex="-1"><a class="header-anchor" href="#webpack-基本概念" aria-hidden="true">#</a> Webpack 基本概念</h1>
<p>更多的相关配置小伙伴们可以参考<a href="https://godbasin.github.io/2017/05/21/webpack-common-setting/" target="_blank" rel="noopener noreferrer">《正确的 Webpack 配置姿势，快速启动各式框架》<ExternalLinkIcon/></a>。
这里我们主要介绍搭建时涉及的一些配置。</p>
<p><strong>四个核心概念：入口(entry)、输出(output)、loader、插件(plugins)。</strong></p>
<h2 id="入口-entry" tabindex="-1"><a class="header-anchor" href="#入口-entry" aria-hidden="true">#</a> 入口(entry)</h2>
<p>将您应用程序的入口起点认为是根上下文(contextual root)或 app 第一个启动文件。
一般来说，在 Angular 中我们将是启动<code v-pre>.bootstrap()</code>的文件，在 Vue 中则是<code v-pre>new Vue()</code>的位置，在 React 中则是<code v-pre>ReactDOM.render()</code>或者是<code v-pre>React.render()</code>的启动文件。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token string">"./path/to/my/entry/file.js"</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="出口-output" tabindex="-1"><a class="header-anchor" href="#出口-output" aria-hidden="true">#</a> 出口(output)</h2>
<p>output 属性描述了如何处理归拢在一起的代码(bundled code)，在哪里打包应用程序。一般需要以下两点：</p>
<ul>
<li>filename: 编译文件的文件名(main.js/bundle.js/index.js 等)</li>
<li>path：对应一个绝对路径，此路径是你希望一次性打包的目录</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">"bundle.js"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">"/home/proj/public/assets"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="loader" tabindex="-1"><a class="header-anchor" href="#loader" aria-hidden="true">#</a> loader</h2>
<p>webpack 把每个文件(.css, .html, .scss, .jpg, etc.) 都作为模块处理。但 webpack 只理解 JavaScript。</p>
<p>如果你看过生成的<code v-pre>bundle.js</code>代码就会发现，Webpack 将所有的模块打包一起，每个模块添加标记 id，通过这样一个 id 去获取所需模块的代码。
而我们的 loader 的作用，就是把不同的模块和文件转换为这样一个模块，打包进去。</p>
<p><strong>loader 支持链式传递。能够对资源使用流水线(pipeline)。loader 链式地按照先后顺序进行编译，从后往前，最终需要返回 javascript。</strong></p>
<p>不同的应用场景需要不同的 loader，这里我简单介绍几个（loader 使用前都需要安装，请自行查找依赖安装）：</p>
<ul>
<li>babel-loader</li>
</ul>
<p><a href="https://babeljs.io/learn-es2015/" target="_blank" rel="noopener noreferrer">官网<ExternalLinkIcon/></a>在此，想要了解的也可以参考<a href="http://www.ruanyifeng.com/blog/2016/01/babel.html" target="_blank" rel="noopener noreferrer">Babel 入门教程<ExternalLinkIcon/></a>。
<code v-pre>babel-loader</code>将 ES6/ES7 语法编译生成 ES5，当然有些特性还是需要<code v-pre>babel-polyfill</code>支持的（Babel 默认只转换新的 JavaScript 句法，而不转换新的 API，如 Promise 等全局对象）。</p>
<p>而对于 babel-loader 的配置，可以通过<code v-pre>options</code>进行，但一般更常使用<code v-pre>.babelrc</code>文件进行：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token punctuation">{</span>
    <span class="token string-property property">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// 设定转码规则</span>
    <span class="token string-property property">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">// 插件</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>css 相关 loader</p>
<ul>
<li>css-loader: 处理 css 文件中的 url()</li>
<li>style-loader: 将 css 插入到页面的 style 标签</li>
<li>less-loader: less 转换为 css</li>
<li>postcss-loader(autoprefixer-loader): 自动添加兼容前缀(<code v-pre>-webkit-</code>、<code v-pre>-moz-</code>等)</li>
</ul>
</li>
<li>
<p>url-loader/file-loader: 修改文件名，放在输出目录下，并返其对应的 url</p>
<ul>
<li>url-loader 在当文件大小小于限制值时，它可以返回一个 Data Url</li>
</ul>
</li>
<li>
<p>html-loader/raw-loader: 把 Html 文件输出成字符串</p>
<ul>
<li>html-loader 默认处理 html 中的<code v-pre>&lt;img src=&quot;image.png&quot;&gt;</code>为 require(&quot;./image.png&quot;)，需要在配置中指定 image 文件的加载器</li>
</ul>
</li>
</ul>
<h2 id="插件-plugins" tabindex="-1"><a class="header-anchor" href="#插件-plugins" aria-hidden="true">#</a> 插件(plugins)</h2>
<p>loader 仅在每个文件的基础上执行转换，<strong>插件目的在于解决 loader 无法实现的其他事</strong>。
由于 plugin 可以携带参数/选项，需要在 wepback 配置中，向 plugins 属性传入<code v-pre>new</code>实例。</p>
<h2 id="解析-resolve" tabindex="-1"><a class="header-anchor" href="#解析-resolve" aria-hidden="true">#</a> 解析(resolve)</h2>
<p>这些选项能设置模块如何被解析，因为这里会使用到所以也介绍一下用到的：</p>
<ul>
<li>
<p>resolve.extensions</p>
<ul>
<li>自动解析确定的扩展。默认值为：<code v-pre>[&quot;.js&quot;, &quot;.json&quot;]</code></li>
</ul>
</li>
<li>
<p>resolve.alias</p>
<ul>
<li>创建<code v-pre>import</code>或<code v-pre>require</code>的别名，来确保模块引入变得更简单。
<blockquote>
<p>如果使用 typescript 的话，我们还需要配置<code v-pre>tsconfig.json</code>：</p>
</blockquote>
</li>
</ul>
</li>
</ul>
<h1 id="项目配置" tabindex="-1"><a class="header-anchor" href="#项目配置" aria-hidden="true">#</a> 项目配置</h1>
<h2 id="目录组织" tabindex="-1"><a class="header-anchor" href="#目录组织" aria-hidden="true">#</a> 目录组织</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>├── build/                      <span class="token comment"># webpack配置参数文件</span>
│   └── <span class="token punctuation">..</span>.
├── src/                        <span class="token comment"># 项目代码入口</span>
│   ├── page1/                  <span class="token comment"># 第一个页面或者应用</span>
│   │   ├── main.js             <span class="token comment"># 页面/应用入口文件</span>
│   │   └── <span class="token punctuation">..</span>.
│   └── page2/                  <span class="token comment"># 第二个页面或者应用</span>
│   │   ├── main.js             <span class="token comment"># 页面/应用入口文件</span>
│   │   └── <span class="token punctuation">..</span>.
│   └── pageN/                  <span class="token comment"># 第N个页面或者应用</span>
│       ├── main.js             <span class="token comment"># 页面/应用入口文件</span>
│       └── <span class="token punctuation">..</span>.
├── .babelrc                    <span class="token comment"># babel编译参数</span>
├── index.html                  <span class="token comment"># 主页模板，所有的页面共用该index.html入口</span>
└── package.json                <span class="token comment"># 项目文件，记载着一些命令和依赖还有简要的项目描述信息</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基本配置文件" tabindex="-1"><a class="header-anchor" href="#基本配置文件" aria-hidden="true">#</a> 基本配置文件</h2>
<p>由于我们需要实现开发时多页面共同启动，打包时分块打包的功能，故在不同环境下我们的入口<code v-pre>entry</code>和<code v-pre>plugins</code>等将会不一致，这里我们先省略：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> webpackConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">path</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">"./[hash].js"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">resolve</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">extensions</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">".js"</span><span class="token punctuation">,</span> <span class="token string">".json"</span><span class="token punctuation">]</span> <span class="token comment">// '.ts' and more</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"babel-loader"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">include</span><span class="token operator">:</span> <span class="token punctuation">[</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"./src"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// more loaders...</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> webpackConfig<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这里我们搭建了最基本的目录结构以及不完整的 webpack 配置，后续我们将深入进行 build 和 dev 的过程。<br>
目前的代码并没有什么太大的作用，后面补上完整项目的代码吧。</p>
</div></template>


