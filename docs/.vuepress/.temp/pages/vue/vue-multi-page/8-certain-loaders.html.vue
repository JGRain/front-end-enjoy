<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节介绍比较经常使用到的静态资源相关 loader 们，像 css-loader、url-loader 等。</p>
<!--more-->
<h1 id="loader" tabindex="-1"><a class="header-anchor" href="#loader" aria-hidden="true">#</a> Loader</h1>
<p>参考<a href="http://zhaoda.net/webpack-handbook/loader.html" target="_blank" rel="noopener noreferrer">《Loader》<ExternalLinkIcon/></a>。</p>
<h2 id="loader-的存在" tabindex="-1"><a class="header-anchor" href="#loader-的存在" aria-hidden="true">#</a> Loader 的存在</h2>
<p>Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的文件，就需要使用 loader 进行转换。</p>
<p>Loader 可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。
这样，我们就可以通过<code v-pre>require</code>来加载任何类型的模块或文件，比如<code v-pre>CoffeeScript、 JSX、 LESS</code>或图片。</p>
<h2 id="loader-的特性" tabindex="-1"><a class="header-anchor" href="#loader-的特性" aria-hidden="true">#</a> Loader 的特性</h2>
<ul>
<li><strong>Loader 可以通过管道方式链式调用，每个<code v-pre>loader</code>可以把资源转换成任意格式并传递给下一个<code v-pre>loader</code>，但是最后一个<code v-pre>loader</code>必须返回 JavaScript</strong>。</li>
<li>Loader 可以同步或异步执行。</li>
<li>Loader 运行在<code v-pre>node.js</code>环境中，所以可以做任何可能的事情。</li>
<li>Loader 可以接受参数，以此来传递配置项给<code v-pre>loader</code>。</li>
<li>Loader 可以通过文件扩展名（或正则表达式）绑定给不同类型的文件。</li>
<li>Loader 可以通过<code v-pre>npm</code>发布和安装。</li>
<li>除了通过<code v-pre>package.json</code>的<code v-pre>main</code>指定，通常的模块也可以导出一个<code v-pre>loader</code>来使用。</li>
<li>Loader 可以访问配置。</li>
<li>插件可以让<code v-pre>loader</code>拥有更多特性。</li>
<li>Loader 可以分发出附加的任意文件。</li>
</ul>
<p>Loader 本身也是运行在<code v-pre>node.js</code>环境中的<code v-pre>JavaScript</code>模块，它通常会返回一个函数。
大多数情况下，我们通过<code v-pre>npm</code>来管理<code v-pre>loader</code>，但是你也可以在项目中自己写<code v-pre>loader</code>模块。</p>
<h2 id="使用-loader" tabindex="-1"><a class="header-anchor" href="#使用-loader" aria-hidden="true">#</a> 使用 Loader</h2>
<p>在你的应用程序中，有三种使用<code v-pre>loader</code>的方式：</p>
<ol>
<li>配置（推荐）：在<code v-pre>webpack.config.js</code>文件中指定<code v-pre>loader</code>。</li>
<li>内联：在每个<code v-pre>import</code>语句中显式指定<code v-pre>loader</code>。</li>
<li>CLI：在<code v-pre>shell</code>命令中指定它们。</li>
</ol>
<h2 id="静态资源-loader" tabindex="-1"><a class="header-anchor" href="#静态资源-loader" aria-hidden="true">#</a> 静态资源 Loader</h2>
<p>我们来看看静态资源相关的 Loader 们。</p>
<h3 id="css-相关-loader" tabindex="-1"><a class="header-anchor" href="#css-相关-loader" aria-hidden="true">#</a> CSS 相关 Loader</h3>
<p>加载 CSS 需要<code v-pre>css-loader</code>和<code v-pre>style-loader</code>。
他们做两件不同的事情，<code v-pre>css-loader</code>会遍历 CSS 文件，然后找到<code v-pre>url()</code>表达式然后处理他们，<code v-pre>style-loader</code>会把原来的 CSS 代码插入页面中的一个<code v-pre>style</code>标签中。</p>
<ol>
<li><a href="https://doc.webpack-china.org/loaders/css-loader/" target="_blank" rel="noopener noreferrer"><code v-pre>css-loader</code><ExternalLinkIcon/></a></li>
</ol>
<p>我们看<a href="https://doc.webpack-china.org/loaders/css-loader/" target="_blank" rel="noopener noreferrer">webpack<ExternalLinkIcon/></a>上解释：
<code v-pre>css-loader</code> 解释(interpret)<code v-pre>@import</code>和<code v-pre>url()</code>，会<code v-pre>import/require()</code>后再解析(resolve)它们。</p>
<p>说白了是用来处理 css 文件中的<code v-pre>url()</code>或者<code v-pre>@import</code>的路径。</p>
<ol start="2">
<li><a href="https://doc.webpack-china.org/loaders/style-loader/" target="_blank" rel="noopener noreferrer"><code v-pre>style-loader</code><ExternalLinkIcon/></a></li>
</ol>
<p>通过注入<code v-pre>&lt;style&gt;</code>标签将 CSS 添加到 DOM 中。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 通过webpack配置使用</span>
<span class="token comment">// css-loader和style-loader推荐一起使用，注意顺序</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.css$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"style-loader"</span><span class="token punctuation">,</span> <span class="token string">"css-loader"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li><a href="http://www.css88.com/doc/webpack2/loaders/less-loader/" target="_blank" rel="noopener noreferrer"><code v-pre>less-loader</code><ExternalLinkIcon/></a></li>
</ol>
<p>一看就知道，<code v-pre>less-loader</code>主要用于将 LESS 转换成 CSS 的。
将<code v-pre>css-loader</code>、<code v-pre>style-loader</code>和<code v-pre>less-loader</code>链式调用，添加对 webpack 的 LESS 支持，可以把所有样式立即应用于 DOM。</p>
<p>LESS 将 CSS 赋予了动态语言的特性，如变量，继承，运算，函数。</p>
<p>如果需要启用 CSS 的 source map，需要配置选项：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
            <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.less$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
            <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span>
                <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"style-loader"</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"css-loader"</span><span class="token punctuation">,</span> <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                    <span class="token literal-property property">sourceMap</span><span class="token operator">:</span> <span class="token boolean">true</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"less-loader"</span><span class="token punctuation">,</span> <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>
                    <span class="token literal-property property">sourceMap</span><span class="token operator">:</span> <span class="token boolean">true</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li><code v-pre>postcss-loader</code>
<code v-pre>postcss-loader</code>提供了一种方式用 JavaScript 代码来处理 CSS。负责把 CSS 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。
插件基于 CSS 代码的 AST 所能进行的操作是多种多样的，比如可以支持变量和混入（mixin），增加浏览器相关的声明前缀，或是把使用将来的 CSS 规范的样式规则转译（transpile）成当前的 CSS 规范支持的格式。</li>
</ol>
<p><code v-pre>postcss-loader</code>的使用依赖一些插件。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 配置webpack.config.js</span>
<span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">loaders</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.css$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
      <span class="token comment">// loader: "style-loader!css-loader!postcss-loader"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token function-variable function">postcss</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token punctuation">[</span>
    <span class="token comment">// 里面是我们要用的插件</span>
	<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下插件都需要单独安装相关 npm 模块：</p>
<ul>
<li><code v-pre>autoprefixer</code>
<ul>
<li>解析 CSS 文件并且添加浏览器前缀到 CSS 规则里，对浏览器兼容补全还是挺方便的</li>
</ul>
</li>
<li><code v-pre>stylelint</code>
<ul>
<li>Stylelint 插件可以让你在编译的时候就知道自己 CSS 文件里的错误</li>
</ul>
</li>
<li><code v-pre>postcss-cssnext</code>
<ul>
<li>可以让你写 CSS4 的语言，并能配合 autoprefixer 进行浏览器兼容的不全，而且还支持嵌套语法</li>
</ul>
</li>
<li><code v-pre>postcss-import</code>
<ul>
<li>在<code v-pre>@import</code> css 文件的时候让 webpack 监听并编译</li>
</ul>
</li>
</ul>
<p>更多的可以参考<a href="https://github.com/ecmadao/Coding-Guide/blob/master/Notes/CSS/PostCSS%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8C%97.md" target="_blank" rel="noopener noreferrer">《PostCSS 配置指北》<ExternalLinkIcon/></a>。</p>
<h2 id="文件相关-loader" tabindex="-1"><a class="header-anchor" href="#文件相关-loader" aria-hidden="true">#</a> 文件相关 Loader</h2>
<ol>
<li><code v-pre>file-loader</code></li>
</ol>
<p><code v-pre>file-loader</code>主要用来处理图片。</p>
<ol start="2">
<li><code v-pre>url-loader</code></li>
</ol>
<p><code v-pre>url-loader</code>的功能类似<code v-pre>file-loader</code>加载器，但是在文件大小低于指定的限制时（单位 bytes）可以返回一个<code v-pre>Data Url</code>。</p>
<p>大小限制可以通过传递查询参数来指定。（默认为无限制）
如果文件大小大于限制，将转为使用<code v-pre>file-loader</code>，所有的查询参数也会透传过去。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// => 如果 "file.png" 大小小于 10kb 将返回 DataUrl</span>
<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"url-loader?limit=10000!./file.png"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// webpack配置</span>
<span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">loaders</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.(png|jpe?g|gif|svg)(\?.*)?$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"url-loader"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">limit</span><span class="token operator">:</span> <span class="token number">10000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们大致了解静态资源相关 loader 们，当时具体使用的时候还是得历练一番的。<br>
代码的话，大家可以看看<a href="https://github.com/godbasin/vue-multi-pages" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


