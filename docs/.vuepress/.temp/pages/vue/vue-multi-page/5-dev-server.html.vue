<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节介绍开发环境路由的设计，以及实现服务启动过程。</p>
<!--more-->
<h1 id="开发部署" tabindex="-1"><a class="header-anchor" href="#开发部署" aria-hidden="true">#</a> 开发部署</h1>
<h2 id="逻辑思路" tabindex="-1"><a class="header-anchor" href="#逻辑思路" aria-hidden="true">#</a> 逻辑思路</h2>
<p>开发环境的部署和生产环境不一致，我们规划的本地环境实现的效果如下：</p>
<ol>
<li>整个项目启动一次，多页面共享相同环境。</li>
<li>根据路由来匹配不同页面，路由与页面目录一致。</li>
</ol>
<p>如：
路由为<code v-pre>/page1</code>时，打开<code v-pre>page1</code>页面。
路由为<code v-pre>/page2</code>时，打开<code v-pre>page2</code>页面。
路由匹配不到对应页面时，进行相关提示。</p>
<h2 id="express模块" tabindex="-1"><a class="header-anchor" href="#express模块" aria-hidden="true">#</a> <a href="http://www.expressjs.com.cn/" target="_blank" rel="noopener noreferrer"><code v-pre>Express</code>模块<ExternalLinkIcon/></a></h2>
<p><code v-pre>Express</code>是一个基于<code v-pre>Node.js</code>平台的极简、灵活的<code v-pre>web</code>应用开发框架，它提供一系列强大的特性，帮助你创建各种<code v-pre>Web</code>应用。</p>
<p>既然我们需要路由的匹配，这里我们使用<code v-pre>express</code>模块。</p>
<p>路由（<code v-pre>Routing</code>）是由一个<code v-pre>URI</code>（或者叫路径）和一个特定的<code v-pre>HTTP</code>方法（<code v-pre>GET</code>、<code v-pre>POST</code>等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。
每一个路由都可以有一个或者多个处理器函数，当匹配到路由时，这个/函数将被执行。</p>
<p>路由的定义由如下结构组成：<code v-pre>app.METHOD(PATH, HANDLER)</code>。
其中，<code v-pre>app</code>是一个<code v-pre>express</code>实例，<code v-pre>METHOD</code>是某个<code v-pre>HTTP</code>请求方式中的一个，<code v-pre>PATH</code>是服务器端的路径，<code v-pre>HANDLER</code>是当路由匹配到时需要执行的函数。</p>
<p>官方示例：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 对网站首页的访问返回 "Hello World!" 字样</span>
app<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"/"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">"Hello World!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 网站首页接受 POST 请求</span>
app<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token string">"/"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">req<span class="token punctuation">,</span> res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  res<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">"Got a POST request"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>请求对象（<code v-pre>req</code>）</p>
<ul>
<li><code v-pre>req.params</code>: 这是一个数组对象，命名过的参数会以键值对的形式存放
<ul>
<li>比如有一个路由<code v-pre>/user/:name</code>，<code v-pre>&quot;name&quot;</code>属性会存放在<code v-pre>req.params.name</code>， 这个对象默认为<code v-pre>{}</code></li>
</ul>
</li>
<li><code v-pre>req.query</code>: 一个解析过的请求参数对象，默认为<code v-pre>{}</code></li>
<li><code v-pre>req.body</code>: 这个对应的是解析过的请求体，
<ul>
<li>这个特性是<code v-pre>bodyParser()</code>中间件提供，其它的请求体解析中间件可以放在这个中间件之后。当<code v-pre>bodyParser()</code>中间件使用后，这个对象默认为<code v-pre>{}</code></li>
</ul>
</li>
<li><code v-pre>req.route</code>: 这个对象里是当前匹配的<code v-pre>Route</code>里包含的属性，比如原始路径字符串，产生的正则，等等</li>
<li><code v-pre>req.path</code>: 返回请求的<code v-pre>URL</code>的路径名</li>
<li><code v-pre>req.host</code>: 返回从<code v-pre>&quot;Host&quot;</code>请求头里取的主机名,不包含端口号</li>
<li>...</li>
</ul>
</li>
<li>
<p>响应对象（<code v-pre>res</code>）</p>
<ul>
<li><code v-pre>res.end()</code>: 终结响应处理流程</li>
<li><code v-pre>res.json()</code>: 发送一个<code v-pre>JSON</code>格式的响应</li>
<li><code v-pre>res.jsonp()</code>: 发送一个支持<code v-pre>JSONP</code>的<code v-pre>JSON</code>格式的响应</li>
<li><code v-pre>res.redirect()</code>: 重定向请求</li>
<li><code v-pre>res.render()</code>: 渲染视图模板</li>
<li><code v-pre>res.send()</code>: 发送各种类型的响应</li>
<li><code v-pre>res.sendFile</code>: 以八位字节流的形式发送文件</li>
<li><code v-pre>res.sendStatus()</code>: 设置响应状态代码，并将其以字符串形式作为响应体的一部分发送</li>
<li>...</li>
</ul>
</li>
</ul>
<h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2>
<p>我们的开发部署代码放置在<code v-pre>build</code>文件夹下的<code v-pre>dev-server.js</code>，则我们的<code v-pre>package.json</code>中的<code v-pre>script</code>：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"node build/dev-server.js"</span><span class="token punctuation">,</span>
    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"node build/build.js"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同时，我们将每个页面的主页面命名为<code v-pre>[pageName].html</code>，然后匹配路由之后就能获取相关页面：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// dev-server.js</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> express <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"express"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> utils <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./utils"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> webpackConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./webpack.config"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> HtmlWebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"html-webpack-plugin"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Express实例</span>
<span class="token keyword">var</span> app <span class="token operator">=</span> <span class="token function">express</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 获取页面目录</span>
<span class="token keyword">var</span> entries <span class="token operator">=</span> utils<span class="token punctuation">.</span>entries<span class="token punctuation">;</span>

<span class="token comment">// 重置入口entry</span>
webpackConfig<span class="token punctuation">.</span>entry <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">// 设置output为每个页面[name].js</span>
webpackConfig<span class="token punctuation">.</span>output<span class="token punctuation">.</span>filename <span class="token operator">=</span> <span class="token string">"[name].js"</span><span class="token punctuation">;</span>
webpackConfig<span class="token punctuation">.</span>output<span class="token punctuation">.</span>path <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>entries<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry</span>
  webpackConfig<span class="token punctuation">.</span>entry<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> entries<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">;</span>

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

<span class="token comment">// webpack编译器</span>
<span class="token keyword">var</span> compiler <span class="token operator">=</span> <span class="token function">webpack</span><span class="token punctuation">(</span>webpackConfig<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// webpack-dev-server中间件</span>
<span class="token keyword">var</span> devMiddleware <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack-dev-middleware"</span><span class="token punctuation">)</span><span class="token punctuation">(</span>compiler<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">publicPath</span><span class="token operator">:</span> <span class="token string">"/"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">stats</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">colors</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">chunks</span><span class="token operator">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">progress</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">inline</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">hot</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 使用webpack中间件</span>
app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>devMiddleware<span class="token punctuation">)</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里面我们使用到<code v-pre>webpack-dev-middleware</code>模块，主要用于监视文件变化后重新编译，但这里并没有结合热加载来刷新页面，后面我们一起讲吧。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们针对开发部署的场景，来对服务的启动做了些调整，当然还有很多地方如热加载、source-map 等都需要完善。<br>
可参考代码<a href="https://github.com/godbasin/vue-multi-pages" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


