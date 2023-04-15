<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文记录用 webpack 配置环境，启动 app 的过程。</p>
<!--more-->
<h2 id="关于-cycle-js" tabindex="-1"><a class="header-anchor" href="#关于-cycle-js" aria-hidden="true">#</a> 关于 Cycle.js</h2>
<h3 id="rxjs" tabindex="-1"><a class="header-anchor" href="#rxjs" aria-hidden="true">#</a> Rxjs</h3>
<p>接触 Rxjs 也是因为 Angular，关于 Angular 请查看<a href="https://github.com/godbasin/godbasin.github.io/issues/1" target="_blank" rel="noopener noreferrer">《重新认识 Angular》<ExternalLinkIcon/></a>。
关于 Rxjs 这里更多是来自<a href="https://zhuanlan.zhihu.com/p/20531896" target="_blank" rel="noopener noreferrer">《不要把 Rx 用成 Promise》<ExternalLinkIcon/></a>。</p>
<ul>
<li>
<p>核心思想: 数据响应式</p>
<ul>
<li><strong>Promise =&gt; 允诺</strong></li>
<li><strong>Rxjs =&gt; 由订阅/发布模式引出来</strong></li>
</ul>
</li>
<li>
<p>执行和响应</p>
<ul>
<li><strong><code v-pre>Promise</code>需要<code v-pre>then()</code>或<code v-pre>catch()</code>执行，并且是一次性的。</strong></li>
<li><strong><code v-pre>Rxjs</code>数据的流出不取决于是否<code v-pre>subscribe()</code>，并且可以多次响应</strong></li>
</ul>
</li>
<li>
<p>数据源头和消费</p>
<ul>
<li><strong><code v-pre>Promise</code>没有确切的数据消费者，每一个<code v-pre>then</code>都是数据消费者，同时也可能是数据源头，适合组装流程式（A 拿到数据处理，完了给 B，B 完了把处理后的数据给 C，以此类推）</strong></li>
<li><strong><code v-pre>Rxjs</code>则有明确的数据源头，以及数据消费者</strong></li>
</ul>
</li>
<li>
<p>Rxjs 例子</p>
</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> observable <span class="token operator">=</span> Rx<span class="token punctuation">.</span>Observable<span class="token punctuation">.</span><span class="token function">fromEvent</span><span class="token punctuation">(</span>input<span class="token punctuation">,</span> <span class="token string">"input"</span><span class="token punctuation">)</span> <span class="token comment">// 监听 input 元素的 input 事件</span>
  <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">e</span> <span class="token operator">=></span> e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span> <span class="token comment">// 一旦发生，把事件对象 e 映射成 input 元素的值</span>
  <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=></span> value<span class="token punctuation">.</span>length <span class="token operator">>=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token comment">// 接着过滤掉值长度小于 1 的</span>
  <span class="token punctuation">.</span><span class="token function">distinctUntilChanged</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 如果该值和过去最新的值相等，则忽略</span>
  <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span>
    <span class="token comment">// subscribe 拿到数据</span>
    <span class="token parameter">x</span> <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token parameter">err</span> <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 订阅</span>
observable<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cycle-js" tabindex="-1"><a class="header-anchor" href="#cycle-js" aria-hidden="true">#</a> Cycle.js</h3>
<p><a href="https://cycle.js.org" target="_blank" rel="noopener noreferrer">Cycle.js<ExternalLinkIcon/></a>则是把 Rxjs 极致化，不管是用户操作、http 请求、数据和状态变更，整个框架级都是通过 Rxjs 的思想实现的。</p>
<p>如果说状态管理的话，那么<a href="https://mobx.js.org/" target="_blank" rel="noopener noreferrer">MobX<ExternalLinkIcon/></a>也是基于 Rxjs 思想做出的与 Redux、Flux、Vuex 等相似的状态管理工具。</p>
<p>不知道大家会不会觉得，把所有的框架设计都使用 Rxjs 来实现，会不会跟我们目前的通用框架 Vue/React/Angular 等差异太大呢？</p>
<p>管他呢，既然无法想象，那么我们就直接去实践看看吧。</p>
<h2 id="基本依赖" tabindex="-1"><a class="header-anchor" href="#基本依赖" aria-hidden="true">#</a> 基本依赖</h2>
<h3 id="package-json" tabindex="-1"><a class="header-anchor" href="#package-json" aria-hidden="true">#</a> package.json</h3>
<p>在使用 Cycle.js 这个新兴框架的时候，本骚年会尽量选择跟常用的框架相似的架构和方式，去让这个切换来得更加易懂。</p>
<p>因此这里，我们选择使用 Webpack。（官方使用并不需要用到 Webpack，社区更是有 create-cycle-app 等脚手架，大家有兴趣也可以去看看）</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"cyclejs-demo"</span><span class="token punctuation">,</span>
  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>
  <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"cycle.js demo"</span><span class="token punctuation">,</span>
  <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"index.js"</span><span class="token punctuation">,</span>
  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"webpack-dev-server --config webpackdev.config.js --port 3333 --host 0.0.0.0 --devtool eval --progress --colors --hot --content-base dist"</span><span class="token punctuation">,</span>
    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"webpack --config webpack.config.js"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"keywords"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"cycle.js"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"author"</span><span class="token operator">:</span> <span class="token string">"godbasin &lt;wangbeishan@163.com> (https://github.com/godbasin)"</span><span class="token punctuation">,</span>
  <span class="token property">"license"</span><span class="token operator">:</span> <span class="token string">"MIT"</span><span class="token punctuation">,</span>
  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"@cycle/dom"</span><span class="token operator">:</span> <span class="token string">"^18.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@cycle/run"</span><span class="token operator">:</span> <span class="token string">"^3.1.0"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-plugin-transform-react-jsx"</span><span class="token operator">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>
    <span class="token property">"snabbdom-jsx"</span><span class="token operator">:</span> <span class="token string">"^0.3.1"</span><span class="token punctuation">,</span>
    <span class="token property">"xstream"</span><span class="token operator">:</span> <span class="token string">"^10.9.0"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"babel-core"</span><span class="token operator">:</span> <span class="token string">"^6.25.0"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-loader"</span><span class="token operator">:</span> <span class="token string">"^7.1.1"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-preset-es2015"</span><span class="token operator">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>
    <span class="token property">"html-webpack-plugin"</span><span class="token operator">:</span> <span class="token string">"^2.29.0"</span><span class="token punctuation">,</span>
    <span class="token property">"loglevel"</span><span class="token operator">:</span> <span class="token string">"^1.4.1"</span><span class="token punctuation">,</span>
    <span class="token property">"source-map-loader"</span><span class="token operator">:</span> <span class="token string">"^0.2.1"</span><span class="token punctuation">,</span>
    <span class="token property">"webpack"</span><span class="token operator">:</span> <span class="token string">"^3.3.0"</span><span class="token punctuation">,</span>
    <span class="token property">"webpack-dev-server"</span><span class="token operator">:</span> <span class="token string">"^2.5.1"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里可以大概看到，除了基本的 Cycle.js 的依赖，我们还用到了常用的一些工具或者库，像：</p>
<ul>
<li>webpack</li>
<li>babel</li>
<li>jsx</li>
<li>...</li>
</ul>
<p>本节我们主要涉及的是 webpack。
webpack 依赖安装，除了<code v-pre>npm install</code>外，还需要全局安装<code v-pre>npm install -g webpack</code>。</p>
<p>webpack 本骚年使用的是 v2.0+版本，而 1 迁 2 其实也不是什么难事情，官方有个很详细的<a href="https://webpack.js.org/guides/migrating/" target="_blank" rel="noopener noreferrer">migration 说明<ExternalLinkIcon/></a>，大家可以参考看看。</p>
<ul>
<li><code v-pre>script</code>命令</li>
</ul>
<p>至于 scripts 命令，这里有两个：</p>
<ol>
<li><code v-pre>npm run dev</code>：启动 webpack 服务。</li>
<li><code v-pre>npm run build</code>: 构建生成 dist 目录。</li>
</ol>
<h2 id="webpack-配置" tabindex="-1"><a class="header-anchor" href="#webpack-配置" aria-hidden="true">#</a> webpack 配置</h2>
<h3 id="webpack-config-js" tabindex="-1"><a class="header-anchor" href="#webpack-config-js" aria-hidden="true">#</a> webpack.config.js</h3>
<p>这里简单介绍一下几个使用到的 loader。</p>
<ul>
<li>babel-loader</li>
</ul>
<p>这里主要用来配置官方的 babel，用于 jsx 的使用：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// .babelrc</span>
<span class="token punctuation">{</span>
  <span class="token string-property property">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"es2015"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string-property property">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"syntax-jsx"</span><span class="token punctuation">,</span>
    <span class="token punctuation">[</span><span class="token string">"transform-react-jsx"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token string-property property">"pragma"</span><span class="token operator">:</span> <span class="token string">"html"</span><span class="token punctuation">}</span><span class="token punctuation">]</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上了 jsx 的话，我们的代码就会易懂一些啦。</p>
<ul>
<li>source-map-loader：当然是为了 source-map 了</li>
</ul>
<p>关于插件 plugins，这里主要用了一个<code v-pre>html-webpack-plugin</code>，用于插入<code v-pre>index.html</code>页面。</p>
<p>上码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//引入node的path库</span>
<span class="token keyword">var</span> HtmlwebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"html-webpack-plugin"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token punctuation">[</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"src/index.js"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">//入口文件</span>
  <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">path</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 指定编译后的代码位置为 dist/bundle.js</span>
    <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">"./bundle.js"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token comment">// 为webpack指定loaders</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"source-map-loader"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">enforce</span><span class="token operator">:</span> <span class="token string">"pre"</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.jsx?$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-loader"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token keyword">new</span> <span class="token class-name">HtmlwebpackPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">"cycle.js demo"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">template</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"index.html"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token literal-property property">inject</span><span class="token operator">:</span> <span class="token string">"body"</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>UglifyJsPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">compress</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">warnings</span><span class="token operator">:</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">devtool</span><span class="token operator">:</span> <span class="token string">"source-map"</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> config<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="webpackserver-config-js" tabindex="-1"><a class="header-anchor" href="#webpackserver-config-js" aria-hidden="true">#</a> webpackServer.config.js</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//引入node的path库</span>
<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./webpack.config.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
config<span class="token punctuation">.</span>entry<span class="token punctuation">.</span>app<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span>
  <span class="token string">"webpack/hot/dev-server"</span><span class="token punctuation">,</span>
  <span class="token string">"webpack-dev-server/client?http://localhost:3333"</span>
<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> config<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动应用" tabindex="-1"><a class="header-anchor" href="#启动应用" aria-hidden="true">#</a> 启动应用</h2>
<h3 id="项目代码" tabindex="-1"><a class="header-anchor" href="#项目代码" aria-hidden="true">#</a> 项目代码</h3>
<p>关于代码其实很简单，从官方代码里偷过来一个<code v-pre>app-root</code>的模块组件，然后拼到项目里，最终长这么一个样：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> run <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/run"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> makeDOMDriver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/dom"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> App <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./app"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> main <span class="token operator">=</span> App<span class="token punctuation">;</span>

<span class="token keyword">const</span> drivers <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token operator">:</span> <span class="token function">makeDOMDriver</span><span class="token punctuation">(</span><span class="token string">"#app"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token function">run</span><span class="token punctuation">(</span>main<span class="token punctuation">,</span> drivers<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于 App 长这样：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> xs <span class="token keyword">from</span> <span class="token string">"xstream"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> run <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/run"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> makeDOMDriver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/dom"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> html <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"snabbdom-jsx"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">App</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> sinks <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token constant">DOM</span><span class="token operator">:</span> sources<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"input"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">ev</span> <span class="token operator">=></span> ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>checked<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">toggled</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>div<span class="token operator">></span>
          <span class="token operator">&lt;</span>input type<span class="token operator">=</span><span class="token string">"checkbox"</span> <span class="token operator">/</span><span class="token operator">></span> Toggle me
          <span class="token operator">&lt;</span>p<span class="token operator">></span><span class="token punctuation">{</span>toggled <span class="token operator">?</span> <span class="token string">"ON"</span> <span class="token operator">:</span> <span class="token string">"off"</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
      <span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> sinks<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实使用 jsx 之后，跟 React 是有些相似，但数据和状态的管理则不一致了，毕竟从代码就能看到，我们是从一个<code v-pre>click</code>事件发起数据源，然后更新 Dom 的。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了 webpack/babel 一些相关配置，项目已经搭建起来了，但是很多东西我们还不完全理解，像 Driver、xstream 等等，后面大概也需要讲讲了呢。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/1-init-app-with-webpack" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://cyclejs-notes.godbasin.com/1-init-app-with-webpack/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


