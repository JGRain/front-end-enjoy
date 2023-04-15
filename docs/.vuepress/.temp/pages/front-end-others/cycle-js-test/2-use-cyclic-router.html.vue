<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文记录使用 cyclic-router 来启动页面路由的过程。</p>
<!--more-->
<h1 id="启用页面路由" tabindex="-1"><a class="header-anchor" href="#启用页面路由" aria-hidden="true">#</a> 启用页面路由</h1>
<h2 id="cyclic-router" tabindex="-1"><a class="header-anchor" href="#cyclic-router" aria-hidden="true">#</a> <a href="https://github.com/cyclejs-community/cyclic-router" target="_blank" rel="noopener noreferrer">cyclic-router<ExternalLinkIcon/></a></h2>
<p>cyclic-router 是为 Cycle.js 设计的路由驱动。</p>
<ul>
<li>安装模块：</li>
</ul>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>npm install --save cyclic-router switch-path
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里面我们直接使用了官方推荐的<a href="https://github.com/staltz/switch-path" target="_blank" rel="noopener noreferrer"><code v-pre>switch-path</code><ExternalLinkIcon/></a>，它提供路由匹配功能。
cyclic-router 在 V3 和 V4 版本是需要注入路由匹配模块，而在 V2 版本前是内置<code v-pre>switch-path</code>，则不需要安装。</p>
<p>更多关于 cyclic-router 大家可以参考<a href="https://github.com/cyclejs-community/cyclic-router" target="_blank" rel="noopener noreferrer">github--cyclic-router<ExternalLinkIcon/></a>。</p>
<h2 id="路由入口" tabindex="-1"><a class="header-anchor" href="#路由入口" aria-hidden="true">#</a> 路由入口</h2>
<p>我们将在启动主入口<code v-pre>run()</code>的时候添加进路由：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> run <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/run"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> xs <span class="token keyword">from</span> <span class="token string">"xstream"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> makeDOMDriver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/dom"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> makeRouterDriver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"cyclic-router"</span><span class="token punctuation">;</span>
<span class="token comment">// 这里我们使用hash锚做路由，故使用createHashHistory替代createBrowserHistory</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createHashHistory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"history"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> switchPath <span class="token keyword">from</span> <span class="token string">"switch-path"</span><span class="token punctuation">;</span> <span class="token comment">// Required in v3, not required in v2 or below</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> AppComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./app"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> LoginComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./login"</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 设置路由匹配规则</span>
  <span class="token comment">// 这里需要注意的是，必须有跟路由'/'，否则将会报错：</span>
  <span class="token keyword">const</span> match$ <span class="token operator">=</span> sources<span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">define</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token string-property property">"/login"</span><span class="token operator">:</span> LoginComponent<span class="token punctuation">,</span>
    <span class="token string-property property">"/app"</span><span class="token operator">:</span> AppComponent<span class="token punctuation">,</span>
    <span class="token string-property property">"*"</span><span class="token operator">:</span> LoginComponent
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 匹配路由后处理</span>
  <span class="token keyword">const</span> page$ <span class="token operator">=</span> match$<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> path<span class="token punctuation">,</span> value <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">value</span><span class="token punctuation">(</span>
      Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> sources<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">router</span><span class="token operator">:</span> sources<span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">path</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token comment">// 匹配路由后获取DOM作为流</span>
    <span class="token constant">DOM</span><span class="token operator">:</span> page$<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">c</span> <span class="token operator">=></span> c<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">flatten</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment">// 匹配路由后获取对应的router作为流，为空则设置''</span>
    <span class="token comment">// 然后flatten()将多个流抚平</span>
    <span class="token literal-property property">router</span><span class="token operator">:</span> xs<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>
      page$
        <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">c</span> <span class="token operator">=></span> c<span class="token punctuation">.</span>router<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> x <span class="token operator">||</span> <span class="token string">""</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">flatten</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">run</span><span class="token punctuation">(</span>main<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token operator">:</span> <span class="token function">makeDOMDriver</span><span class="token punctuation">(</span><span class="token string">"#app"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token literal-property property">router</span><span class="token operator">:</span> <span class="token function">makeRouterDriver</span><span class="token punctuation">(</span><span class="token function">createHashHistory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> switchPath<span class="token punctuation">)</span> <span class="token comment">// v3</span>
  <span class="token comment">// router: makeRouterDriver(createHistory()) // &lt;= v2</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="添加登陆页面跳转" tabindex="-1"><a class="header-anchor" href="#添加登陆页面跳转" aria-hidden="true">#</a> 添加登陆页面跳转</h2>
<p>这里我们添加一个登陆页面，主要用于登陆后路由跳转：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> html <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"snabbdom-jsx"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> xs <span class="token keyword">from</span> <span class="token string">"xstream"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">LoginComponent</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domSource <span class="token operator">=</span> sources<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">;</span>
  <span class="token comment">// 添加点击事件流</span>
  <span class="token keyword">const</span> loginClick$ <span class="token operator">=</span> domSource<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#submit"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 添加html流</span>
  <span class="token keyword">const</span> loginView$ <span class="token operator">=</span> xs<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>form<span class="token operator">></span>
      <span class="token operator">&lt;</span>h1<span class="token operator">></span>System<span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">></span>
      <span class="token operator">&lt;</span>div<span class="token operator">></span>
        <span class="token operator">&lt;</span>input type<span class="token operator">=</span><span class="token string">"text"</span> placeholder<span class="token operator">=</span><span class="token string">"username"</span> <span class="token operator">/</span><span class="token operator">></span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
      <span class="token operator">&lt;</span>div<span class="token operator">></span>
        <span class="token operator">&lt;</span>input type<span class="token operator">=</span><span class="token string">"password"</span> placeholder<span class="token operator">=</span><span class="token string">"password"</span> <span class="token operator">/</span><span class="token operator">></span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
      <span class="token operator">&lt;</span>div<span class="token operator">></span>
        <span class="token operator">&lt;</span>button<span class="token operator">></span>Login<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">></span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>form<span class="token operator">></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token constant">DOM</span><span class="token operator">:</span> loginView$<span class="token punctuation">,</span>
    <span class="token literal-property property">router</span><span class="token operator">:</span> xs<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>
      <span class="token comment">// 点击事件将流转为'/app'</span>
      loginClick$<span class="token punctuation">.</span><span class="token function">mapTo</span><span class="token punctuation">(</span><span class="token string">"/app"</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跳转这个功能，本骚年可能尝试了无数遍，终于发现并不是登录页面的路由有问题，而是主入口的路由：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">return</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token operator">:</span> page$<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">c</span> <span class="token operator">=></span> c<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">flatten</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// 官方文档这个坑，这样写的话，是无法获取页面里面的router流了</span>
  <span class="token comment">// 这只是设置了个初始的流，匹配到'/other'路由</span>
  <span class="token literal-property property">router</span><span class="token operator">:</span> xs<span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"/other"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经过深思熟虑之后，本骚年这样使用：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">return</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token operator">:</span> page$<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">c</span> <span class="token operator">=></span> c<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">flatten</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// 匹配路由后获取对应的router作为流，为空则设置''</span>
  <span class="token comment">// 然后flatten()将多个流抚平</span>
  <span class="token literal-property property">router</span><span class="token operator">:</span> xs<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>
    page$
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">c</span> <span class="token operator">=></span> c<span class="token punctuation">.</span>router<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> x <span class="token operator">||</span> <span class="token string">""</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">flatten</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>终于成功啦。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了使用 cyclic-router 来搭建路由，实现路由匹配和页面跳转等功能。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/2-use-cyclic-router" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://cyclejs-notes.godbasin.com/2-use-cyclic-router/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


