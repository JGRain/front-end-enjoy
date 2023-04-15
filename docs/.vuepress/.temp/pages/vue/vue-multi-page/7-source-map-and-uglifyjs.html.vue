<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节介绍开发部署和生产环境打包时，启用 source map 相关配置。</p>
<!--more-->
<h1 id="devtool" tabindex="-1"><a class="header-anchor" href="#devtool" aria-hidden="true">#</a> devtool</h1>
<p>此选项控制是否生成，以及如何生成<code v-pre>source map</code>。</p>
<h2 id="关于-source-map" tabindex="-1"><a class="header-anchor" href="#关于-source-map" aria-hidden="true">#</a> 关于 source map</h2>
<p>当 webpack 打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。
例如，如果将多个源文件打包到一个文件中，而其中一个源文件包含一个错误，那么堆栈跟踪就会简单地指向到该文件。这并通常没有太多帮助，因为你可能需要准确地知道错误来自于哪个源文件。</p>
<p>为了更容易地追踪错误和警告，JavaScript 提供了<code v-pre>source map</code>功能，将编译后的代码映射回原始源代码。</p>
<h2 id="devtool-选项" tabindex="-1"><a class="header-anchor" href="#devtool-选项" aria-hidden="true">#</a> devtool 选项</h2>
<p>对于开发环境，通常希望更快速的<code v-pre>Source Map</code>，需要添加到<code v-pre>bundle</code>中以增加体积为代价。
但是对于生产环境，则希望更精准的<code v-pre>Source Map</code>，需要从<code v-pre>bundle</code>中分离并独立存在。</p>
<ul>
<li>
<p>开发环境</p>
<ul>
<li><code v-pre>eval</code>
<ul>
<li>每个模块都使用<code v-pre>eval()</code>执行，并且都有<code v-pre>//@ sourceURL</code>。</li>
<li>此选项会相当快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码，所以不能正确的显示显示行数。</li>
</ul>
</li>
<li><code v-pre>inline-source-map</code>
<ul>
<li><code v-pre>SourceMap</code>转换为<code v-pre>DataUrl</code>后添加到<code v-pre>bundle</code>中。</li>
</ul>
</li>
<li><code v-pre>eval-source-map</code>
<ul>
<li>每个模块使用<code v-pre>eval()</code>执行，并且<code v-pre>SourceMap</code>转换为<code v-pre>DataUrl</code>后添加到<code v-pre>eval()</code>中。</li>
<li>初始化<code v-pre>SourceMap</code>时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。</li>
</ul>
</li>
<li><code v-pre>cheap-eval-source-map</code>
<ul>
<li>和<code v-pre>eval-source-map</code>类似，每个模块都使用<code v-pre>eval()</code>执行。</li>
<li>使用此选项，<code v-pre>Source Map</code>将传递给<code v-pre>eval()</code>作为<code v-pre>Data URL</code>调用。它是“低性能开销”的，因为它没有映射到列，只映射到行数。</li>
</ul>
</li>
<li><code v-pre>cheap-module-eval-source-map</code>（推荐使用）
<ul>
<li>和<code v-pre>cheap-eval-source-map</code>类似，然而，在这种情况下，<code v-pre>loader</code>能够处理映射以获得更好的结果。</li>
</ul>
</li>
</ul>
</li>
<li>
<p>生产环境</p>
<ul>
<li><code v-pre>source-map</code>
<ul>
<li>生成完整的<code v-pre>SourceMap</code>，输出为独立文件。</li>
<li>由于在<code v-pre>bundle</code>中添加了引用注释，所以开发工具知道在哪里去找到<code v-pre>SourceMap</code>。</li>
</ul>
</li>
<li><code v-pre>hidden-source-map</code>
<ul>
<li>和<code v-pre>source-map</code>相同，但是没有在<code v-pre>bundle</code>中添加引用注释。</li>
<li>如果你只想要<code v-pre>SourceMap</code>映射错误报告中的错误堆栈跟踪信息，但不希望将<code v-pre>SourceMap</code>暴露给浏览器开发工具。</li>
</ul>
</li>
<li><code v-pre>cheap-source-map</code>
<ul>
<li>不带列映射(column-map)的<code v-pre>SourceMap</code>，忽略加载的<code v-pre>Source Map</code>。</li>
</ul>
</li>
<li><code v-pre>cheap-module-source-map</code>
<ul>
<li>不带列映射(column-map)的<code v-pre>SourceMap</code>，将加载的<code v-pre>Source Map</code>简化为每行单独映射。</li>
</ul>
</li>
<li><code v-pre>nosources-source-map</code>
<ul>
<li>创建一个没有<code v-pre>sourcesContent</code>的<code v-pre>SourceMap</code>。</li>
<li>它可以用来映射客户端上的堆栈跟踪，而不会暴露所有的源码。</li>
</ul>
</li>
</ul>
</li>
</ul>
<p>参考<a href="https://doc.webpack-china.org/configuration/devtool/" target="_blank" rel="noopener noreferrer">开发辅助调试工具(Devtool)<ExternalLinkIcon/></a>。</p>
<h2 id="开发环境添加-source-map" tabindex="-1"><a class="header-anchor" href="#开发环境添加-source-map" aria-hidden="true">#</a> 开发环境添加 source map</h2>
<p>这里我们简单地添加<code v-pre>devtool</code>：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// build/dev-server.js</span>
webpackConfig<span class="token punctuation">.</span>devtool <span class="token operator">=</span> <span class="token string">"eval-cheap-module-source-map"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>同时，在配置文件中，还有一个要点是<code v-pre>publicPath</code>不是<code v-pre>/</code>这样的值，而是<code v-pre>http://localhost:3000/</code>这样的绝对地址。这是因为，在使用?sourceMap 的时候，style-loader 会把 css 的引入做成这样：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>blob:http://localhost:3000/asdasd<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这种 blob 的形式可能会使得 css 里的 url()引用的图片失效，因此建议用带 http 的绝对地址（这也只有开发环境会用到）。</p>
<p>所以我们有：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// webpack-dev-server中间件</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>
  <span class="token function">WebpackDevMiddleware</span><span class="token punctuation">(</span>compiler<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">publicPath</span><span class="token operator">:</span> <span class="token string">"http://localhost:3000/"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">stats</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">colors</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token literal-property property">chunks</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">progress</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">inline</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">hot</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="生产环境-source-map" tabindex="-1"><a class="header-anchor" href="#生产环境-source-map" aria-hidden="true">#</a> 生产环境 source map</h2>
<p>同样的我们添加<code v-pre>devtool</code>：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// build/dev-server.js</span>
webpackConfig<span class="token punctuation">.</span>devtool <span class="token operator">=</span> <span class="token string">"source-map"</span><span class="token punctuation">;</span>
<span class="token comment">// 或者不需要source map</span>
webpackConfig<span class="token punctuation">.</span>devtool <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生产环境很多时候我们会压缩代码，压缩的时候如果需要生成 source map 还需要配置：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
  <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>UglifyJsPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">sourceMap</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>参考了<a href="http://acgtofe.com/posts/2016/02/full-live-reload-for-express-with-webpack" target="_blank" rel="noopener noreferrer">《Express 结合 Webpack 的全栈自动刷新》<ExternalLinkIcon/></a>。</p>
<h2 id="代码压缩" tabindex="-1"><a class="header-anchor" href="#代码压缩" aria-hidden="true">#</a> 代码压缩</h2>
<p>既然说到<code v-pre>UglifyJsPlugin</code>了，就顺便讲一下代码压缩吧。</p>
<p>其实也没有多少东西，就是上面大家看到的<code v-pre>new webpack.optimize.UglifyJsPlugin()</code>，不过配置选项除了<code v-pre>sourceMap</code>还有注释<code v-pre>comments</code>相关、压缩<code v-pre>compress</code>相关。</p>
<p>还有一个问题就是，<code v-pre>UglifyJs</code>不支持 ES6 的压缩，如果代码压缩前没有编译到 ES5，则打包任务会报错，通常显示：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token constant">ERROR</span> <span class="token keyword">in</span> xx<span class="token operator">/</span>xxxxx<span class="token punctuation">.</span>js from UglifyJs
Unexpected token xxxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候我们需要将代码先通过<code v-pre>babel</code>生成<code v-pre>ES5</code>，然后再压缩：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"babel-loader"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 其他loader排在后面</span>
  <span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大致就酱啦。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们大致了解了 source map 的功能和一些 devtool 的选项，包括生产环境和开发环境可能需要注意的地方，以及简单说了个代码压缩的坑。<br>
可参考代码<a href="https://github.com/godbasin/vue-multi-pages" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


