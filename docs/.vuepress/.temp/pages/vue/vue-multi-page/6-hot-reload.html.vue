<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节介绍开发部署时，实现热加载和页面刷新。</p>
<!--more-->
<h1 id="webpack-插件" tabindex="-1"><a class="header-anchor" href="#webpack-插件" aria-hidden="true">#</a> webpack 插件</h1>
<h2 id="express-和-webpack" tabindex="-1"><a class="header-anchor" href="#express-和-webpack" aria-hidden="true">#</a> Express 和 Webpack</h2>
<p><code v-pre>Express</code>本质是一系列<code v-pre>middleware</code>的集合，因此，适合<code v-pre>Express</code>的<code v-pre>webpack</code>开发工具是<code v-pre>webpack-dev-middleware</code>和<code v-pre>webpack-hot-middleware</code>。
详细例子说明也可参考<a href="https://segmentfault.com/a/1190000004505747" target="_blank" rel="noopener noreferrer">《Express 结合 Webpack 的全栈自动刷新》<ExternalLinkIcon/></a>。</p>
<h2 id="webpack-dev-middleware" tabindex="-1"><a class="header-anchor" href="#webpack-dev-middleware" aria-hidden="true">#</a> <a href="https://www.npmjs.com/package/webpack-dev-middleware" target="_blank" rel="noopener noreferrer">webpack-dev-middleware<ExternalLinkIcon/></a></h2>
<p><code v-pre>webpack-dev-middleware</code>是一个处理静态资源的<code v-pre>middleware</code>。</p>
<p>有时候我们无需使用到<code v-pre>Express</code>，我们常常使用<code v-pre>webpack-dev-server</code>开启动服务。
<code v-pre>webpack-dev-server</code>实际上是一个小型<code v-pre>Express</code>服务器，它也是用<code v-pre>webpack-dev-middleware</code>来处理<code v-pre>webpack</code>编译后的输出。</p>
<h2 id="webpack-hot-middleware" tabindex="-1"><a class="header-anchor" href="#webpack-hot-middleware" aria-hidden="true">#</a> <a href="https://www.npmjs.com/package/webpack-hot-middleware" target="_blank" rel="noopener noreferrer">webpack-hot-middleware<ExternalLinkIcon/></a></h2>
<p><code v-pre>webpack-hot-middleware</code>是一个结合<code v-pre>webpack-dev-middleware</code>使用的<code v-pre>middleware</code>，它可以实现浏览器的无刷新更新（<code v-pre>hot reload</code>）。
这也是<code v-pre>webpack</code>文档里常说的 HMR（Hot Module Replacement）。</p>
<h2 id="实现热加载和页面刷新" tabindex="-1"><a class="header-anchor" href="#实现热加载和页面刷新" aria-hidden="true">#</a> 实现热加载和页面刷新</h2>
<p>其实如果将热加载定义为文件变动时重新编译的话，其实我们上一节已经完成了。
但热加载的功能，不搭配页面自动刷新的话，其实就不完整了呢。</p>
<p>需要调整三个地方：</p>
<ol>
<li>每个页面入口需要添加<code v-pre>webpack-hot-middleware/client?reload=true</code>。</li>
<li>在 webpack 配置中添加 plugin 插件<code v-pre>new webpack.HotModuleReplacementPlugin()</code>。</li>
<li>在<code v-pre>Express</code>实例中添加中间件<code v-pre>'webpack-hot-middleware'</code>。</li>
</ol>
<p>故我们的代码为：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// build/dev-server.js</span>
<span class="token comment">// dev-server.js</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"express"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> utils <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./utils"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> webpackConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./webpack.config"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> HtmlWebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"html-webpack-plugin"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> WebpackDevMiddleware <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack-dev-middleware"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> WebpackHotMiddleware <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack-hot-middleware"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Express实例</span>
<span class="token keyword">var</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 获取页面目录</span>
<span class="token keyword">var</span> entries <span class="token operator">=</span> utils<span class="token punctuation">.</span>entries<span class="token punctuation">;</span>
<span class="token comment">// entry中添加HotUpdate地址</span>
<span class="token keyword">var</span> hotMiddlewareScript <span class="token operator">=</span> <span class="token string">"webpack-hot-middleware/client?reload=true"</span><span class="token punctuation">;</span>

<span class="token comment">// 重置入口entry</span>
webpackConfig<span class="token punctuation">.</span>entry <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">// 设置output为每个页面[name].js</span>
webpackConfig<span class="token punctuation">.</span>output<span class="token punctuation">.</span>filename <span class="token operator">=</span> <span class="token string">"[name].js"</span><span class="token punctuation">;</span>
webpackConfig<span class="token punctuation">.</span>output<span class="token punctuation">.</span>path <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>entries<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 每个页面生成一个entry</span>
  <span class="token comment">// 这里修改entry实现HotUpdate</span>
  webpackConfig<span class="token punctuation">.</span>entry<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>entries<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">,</span> hotMiddlewareScript<span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token comment">// 每个页面生成一个[name].html</span>
  <span class="token keyword">var</span> plugin <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HtmlWebpackPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token comment">// 生成出来的html文件名</span>
    <span class="token literal-property property">filename</span><span class="token operator">:</span> name <span class="token operator">+</span> <span class="token string">".html"</span><span class="token punctuation">,</span>
    <span class="token comment">// 每个html的模版，这里多个页面使用同一个模版</span>
    <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token string">"./index.html"</span><span class="token punctuation">,</span>
    <span class="token comment">// 自动将引用插入html</span>
    <span class="token literal-property property">inject</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token comment">// 每个html引用的js模块，也可以在这里加上vendor等公用模块</span>
    <span class="token literal-property property">chunks</span><span class="token operator">:</span> <span class="token punctuation">[</span>name<span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  webpackConfig<span class="token punctuation">.</span>plugins<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>plugin<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

webpackConfig<span class="token punctuation">.</span>plugins<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>HotModuleReplacementPlugin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// webpack编译器</span>
<span class="token keyword">var</span> compiler <span class="token operator">=</span> <span class="token function">webpack</span><span class="token punctuation">(</span>webpackConfig<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// webpack-dev-server中间件</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>
  <span class="token function">WebpackDevMiddleware</span><span class="token punctuation">(</span>compiler<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">publicPath</span><span class="token operator">:</span> <span class="token string">"/"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">stats</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">colors</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token literal-property property">chunks</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">progress</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">inline</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">hot</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token function">WebpackHotMiddleware</span><span class="token punctuation">(</span>compiler<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 路由</span>
app<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"/:pagename?"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> pagename <span class="token operator">=</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>pagename
    <span class="token operator">?</span> req<span class="token punctuation">.</span>params<span class="token punctuation">.</span>pagename <span class="token operator">+</span> <span class="token string">".html"</span>
    <span class="token operator">:</span> <span class="token string">"index.html"</span><span class="token punctuation">;</span>

  <span class="token keyword">var</span> filepath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>compiler<span class="token punctuation">.</span>outputPath<span class="token punctuation">,</span> pagename<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 使用webpack提供的outputFileSystem</span>
  compiler<span class="token punctuation">.</span>outputFileSystem<span class="token punctuation">.</span><span class="token function">readFile</span><span class="token punctuation">(</span>filepath<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> result</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// something error</span>
      <span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span>
        <span class="token string">"输入路径无效，请输入目录名作为路径，有效路径有：\n/"</span> <span class="token operator">+</span>
          Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>entries<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">"\n/"</span><span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 发送获取到的页面</span>
    res<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">"content-type"</span><span class="token punctuation">,</span> <span class="token string">"text/html"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    res<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span>
    res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> app<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">8080</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// do something</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Listening at http://localhost:8080\n"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们就实现了代码的热加载以及页面自动刷新了。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们讲述了在 webpack 中添加代码热加载和页面自动刷新的功能，主要使用了<code v-pre>webpack-dev-middleware</code>和<code v-pre>webpack-hot-middleware</code>两个插件工具。<br>
可参考代码<a href="https://github.com/godbasin/vue-multi-pages" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


