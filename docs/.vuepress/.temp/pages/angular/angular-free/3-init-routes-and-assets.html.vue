<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文记录启用路由 Router，以及添加静态资源的过程。</p>
<!--more-->
<h2 id="使用路由" tabindex="-1"><a class="header-anchor" href="#使用路由" aria-hidden="true">#</a> 使用路由</h2>
<h3 id="有关路由" tabindex="-1"><a class="header-anchor" href="#有关路由" aria-hidden="true">#</a> 有关路由</h3>
<p>现在流行的前端框架，像 React/Vue/Angular 等，都不可避免地自带路由模块。</p>
<p>要说为什么呢，本骚年是这么认为的（个人意见仅供参考）：</p>
<ol>
<li>单页应用已经十分流行了，尤其在 PC 端，而使用前端路由，配合模块化，便使得开发单页应用得心应手。</li>
<li>路由的设计很简单，事件的监听配合框架自行封装的一些<code v-pre>[router-link]</code>等组件，便在开发效率锦上添花。</li>
</ol>
<p>(本骚年也不知道为啥突然懂得这么多的成语，开心逃</p>
<ul>
<li>Angular 的 Router</li>
</ul>
<p>Angular 的 Router 借鉴了浏览器的导航模型。它把浏览器中的 URL 看做一个操作指南， 据此导航到一个由客户端生成的视图，并可以把参数传给支撑视图的相应组件，帮它决定具体该展现哪些内容。</p>
<p>路由器还在浏览器的历史日志中记录下这些活动，这样浏览器的前进和后退按钮也能照常工作。</p>
<h3 id="在视图中跳转" tabindex="-1"><a class="header-anchor" href="#在视图中跳转" aria-hidden="true">#</a> 在视图中跳转</h3>
<p>这里只介绍常用的两种，它们都需要在 A 标签上使用：</p>
<ul>
<li>[routerLink]属性</li>
</ul>
<p>不用说，一看就知道<code v-pre>[routerLink]</code>属性是用来定位到具体的路由的，当然我们同样可以使用 angular 中常用的绑定来传入需要的变量。</p>
<ul>
<li>[routerLinkActive]属性</li>
</ul>
<p>该属性可配置在带<code v-pre>[routerLink]</code>属性的 A 标签上，则当<code v-pre>[routerLink]</code>对应的路由被触发了，则<code v-pre>[routerLinkActive]</code>绑定的 Class 样式将被激活。</p>
<h3 id="注册路由模块" tabindex="-1"><a class="header-anchor" href="#注册路由模块" aria-hidden="true">#</a> 注册路由模块</h3>
<p>在 Angular 的 release 版本开始，加入了 NgModule 这样一个模块设计，首先我们需注册这样一个路由模块：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> NgModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> RouterModule<span class="token punctuation">,</span> Routes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
<span class="token operator">...</span> <span class="token comment">// 引入其他Component</span>

<span class="token keyword">const</span> <span class="token literal-property property">appRoutes</span><span class="token operator">:</span> Routes <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">'one-path'</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> OneComponent <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">'other-path'</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> OtherComponent <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">'**'</span><span class="token punctuation">,</span> <span class="token literal-property property">redirectTo</span><span class="token operator">:</span> <span class="token string">'one-path'</span> <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>

@<span class="token function">NgModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">imports</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    RouterModule<span class="token punctuation">.</span><span class="token function">forRoot</span><span class="token punctuation">(</span>appRoutes<span class="token punctuation">)</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">exports</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    RouterModule
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppRoutingModule</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>根路由注册使用<code v-pre>RouterModule.forRoot()</code></li>
<li>子路由注册使用<code v-pre>RouterModule.forChild()</code></li>
</ul>
<p>对于根路由和子路由，一个应用有一个根路由，但可以有多个子路由，像我们的 DOM 树结构一样，层层向下伸展。</p>
<p>这样的设计思想现在也很流行了，像还有 Angular 中的依赖注入 DI，或者是 React 的虚拟 DOM 设计等。</p>
<h3 id="使用-router" tabindex="-1"><a class="header-anchor" href="#使用-router" aria-hidden="true">#</a> 使用 Router</h3>
<ul>
<li>在 js 中跳转</li>
</ul>
<p>一般来说，我们使用<code v-pre>router.navigate()</code>来进行跳转，像我们的登陆页面：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Router <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'app-login'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">templateUrl</span><span class="token operator">:</span> <span class="token string">'./login.component.html'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">LoginComponent</span> <span class="token keyword">implements</span> <span class="token class-name">OnInit</span><span class="token punctuation">,</span> OnDestroy <span class="token punctuation">{</span>
  <span class="token comment">// 注入router</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">private</span> <span class="token literal-property property">router</span><span class="token operator">:</span> Router</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 登录事件</span>
  <span class="token function">onSubmit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">navigate</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">'/home'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，<code v-pre>router.navigate()</code>还可以传入其他的 params，使用方法大家可以查阅文档。</p>
<ul>
<li>监听路由</li>
</ul>
<p>在 Angular2 的 release 版本之后，路由进行了调整，我们需要通过<code v-pre>subscribe()</code>这样的方式对事件进行订阅：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 监听导航事件变更</span>
<span class="token comment">// NavigationEnd表示导航事件变更完毕</span>
<span class="token comment">// 通过对事件进行filter过滤，我们可以订阅想要的路由事件消息</span>
router<span class="token punctuation">.</span>events
  <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">event</span> <span class="token operator">=></span> event <span class="token keyword">instanceof</span> <span class="token class-name">NavigationEnd</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">event</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若要写面包屑功能，可参考该文章<a href="http://brianflove.com/2016/10/23/angular2-breadcrumb-using-router/" target="_blank" rel="noopener noreferrer">Angular2 Breadcrumb using Router<ExternalLinkIcon/></a>。</p>
<h3 id="获取路由信息" tabindex="-1"><a class="header-anchor" href="#获取路由信息" aria-hidden="true">#</a> 获取路由信息</h3>
<ul>
<li>ActivatedRoute：一站式获取路由信息</li>
</ul>
<p>路由的路径和参数可以通过注入<code v-pre>ActivatedRoute</code>的路由服务来获取，包括：</p>
<ul>
<li>url: 该路由路径的 Observable 对象。它的值是一个由路径中各个部件组成的字符串数组</li>
<li>data: 该路由提供的 data 对象的一个 Observable 对象。还包含从 resolve 中解析出来的值</li>
<li>params: 包含该路由的必选参数和可选参数的 Observable 对象</li>
<li>queryParams: 一个包含对所有路由都有效的查询参数的 Observable 对象</li>
<li>fragment: 一个包含对所有路由都有效的片段值的 Observable 对象</li>
<li>outlet: RouterOutlet 的名字，用于指示渲染该路由的位置</li>
<li>routeConfig: 与该路由的原始路径对应的配置信息</li>
<li>firstChild: 包含子路由列表中的第一个 ActivatedRoute 对象</li>
<li>children: 包含当前路由下激活的全部子路由</li>
</ul>
<p>通常我们可能这样使用：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> ActivatedRoute <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
<span class="token operator">...</span> <span class="token comment">// 其余代码</span>

	<span class="token comment">// 注入route</span>
  	<span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">private</span> <span class="token literal-property property">route</span><span class="token operator">:</span> ActivatedRoute</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>route<span class="token punctuation">.</span>params
        <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">params</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
		  <span class="token comment">// 获取名为id的param参数</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>params<span class="token punctuation">[</span><span class="token string">'id'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
         <span class="token operator">...</span> <span class="token comment">// 其余代码</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token operator">...</span> <span class="token comment">// 其余代码</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="lazyload" tabindex="-1"><a class="header-anchor" href="#lazyload" aria-hidden="true">#</a> lazyload</h3>
<p>对于一些路由子模块，我们可以通过懒加载来定义，这样就可以只在进入到该路由时进行加载，也算是首屏加载优化的一种方法吧。</p>
<p>一般我们在路由中这样定义：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token literal-property property">AppRoutes</span><span class="token operator">:</span> Routes <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">component</span><span class="token operator">:</span> AppComponent<span class="token punctuation">,</span>
    <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">"home"</span><span class="token punctuation">,</span> <span class="token literal-property property">loadChildren</span><span class="token operator">:</span> <span class="token string">"lazy/lazy.module#LazyModule"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就可以对该部分进行懒加载了，当然懒加载还需要其他依赖或者一些另外的配置支持，其实安装一个<code v-pre>angular-router-loader</code>就好了：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>npm install <span class="token operator">--</span>save<span class="token operator">-</span>dev angular<span class="token operator">-</span>router<span class="token operator">-</span>loader
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在 webpack 的 rules 中调整：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.ts$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
  <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-loader"</span><span class="token punctuation">,</span> <span class="token string">"ts-loader"</span><span class="token punctuation">,</span> <span class="token string">"angular2-template-loader"</span><span class="token punctuation">,</span> <span class="token string">"angular-router-loader"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打包的时候我们会发现，除了主文件<code v-pre>bundle.js</code>，每一个使用 lazyload 的文件都会单独打包成一个<code v-pre>n.bundle.js</code>文件（n 为数字），用于异步请求和加载。</p>
<h2 id="添加资源加载" tabindex="-1"><a class="header-anchor" href="#添加资源加载" aria-hidden="true">#</a> 添加资源加载</h2>
<p>一般来说，项目多业务杂，我们总不能一个个插件都自己实现，故很多时候我们需要使用到像 jQuery 或者 Bootstrap 这样很常用的库。</p>
<h3 id="全局注入-js" tabindex="-1"><a class="header-anchor" href="#全局注入-js" aria-hidden="true">#</a> 全局注入 js</h3>
<p>本骚年使用了一种最蠢的方式来实现[捂脸]：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// jquery</span>
window<span class="token punctuation">[</span><span class="token string">"$"</span><span class="token punctuation">]</span> <span class="token operator">=</span> window<span class="token punctuation">[</span><span class="token string">"jQuery"</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./assets/js/jquery.min.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// boootstrap</span>
<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"../node_modules/bootstrap/dist/js/bootstrap.min.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，身为懒癌晚期的我还使用了 typescript 的杀手锏[捂脸+1]：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// declation.d.ts</span>
declare <span class="token keyword">var</span> <span class="token literal-property property">$</span><span class="token operator">:</span> any<span class="token punctuation">;</span>
declare <span class="token keyword">var</span> <span class="token literal-property property">JQuery</span><span class="token operator">:</span> any<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实在 typescript 中使用 jQuery 也有很多现成的<code v-pre>@types</code>库，大家可以一键安装使用就好了：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>npm install @types<span class="token operator">/</span>jquery
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>完整的项目还是需要完善的，像本骚年这种业余玩玩的小项目就另当其说了，而且说不定后面我也会完善的吧[摊手]。</p>
<h3 id="全局注入-css" tabindex="-1"><a class="header-anchor" href="#全局注入-css" aria-hidden="true">#</a> 全局注入 css</h3>
<p>像<code v-pre>import 'someStyle.css'</code>这样的方法竟然没有成功，可能是本骚年的 webpack 配置或者是 loader 哪里出了问题吧。</p>
<p>然后就找了一个懒方法，利用的是<code v-pre>ViewEncapsulation</code>，在组件中将<code v-pre>styleUrls</code>定义为全局生效，如下：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> ViewEncapsulation <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'app-root'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token string">' &lt;router-outlet>&lt;/router-outlet>'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">styleUrls</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">'../../../node_modules/bootstrap/dist/css/bootstrap.min.css'</span><span class="token punctuation">,</span>
    <span class="token string">'../../assets/css/common.css'</span><span class="token punctuation">,</span>
    <span class="token string">'../../assets/css/custom.css'</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">encapsulation</span><span class="token operator">:</span> ViewEncapsulation<span class="token punctuation">.</span>None
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构" aria-hidden="true">#</a> 项目结构</h2>
<h3 id="目录" tabindex="-1"><a class="header-anchor" href="#目录" aria-hidden="true">#</a> 目录</h3>
<p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495034687(1).png" alt="image"></p>
<h3 id="其他配置文件调整" tabindex="-1"><a class="header-anchor" href="#其他配置文件调整" aria-hidden="true">#</a> 其他配置文件调整</h3>
<ul>
<li>package.json</li>
</ul>
<p>移除<code v-pre>@angular/compiler-cli</code>，该依赖为 AOT 使用，而目前本骚年还没做这方面的配置，光一个<code v-pre>compiler-cli</code>也是不够的，后面需要的时候再加吧</p>
<ul>
<li>tsconfig.json</li>
</ul>
<p>这个不得不说了，项目一直起不来提示如下：</p>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>compiler.es5.js:15291
Uncaught Error: Can't resolve all parameters for LoginComponent: (?).
    at syntaxError (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:1724:34)
    at CompileMetadataResolver._getDependenciesMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15061:35)
    at CompileMetadataResolver._getTypeMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:14929:26)
    at CompileMetadataResolver.getNonNormalizedDirectiveMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:14538:24)
    at CompileMetadataResolver._getEntryComponentMetadata (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15182:45)
    at eval (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15168:48)
    at Array.forEach (native)
    at CompileMetadataResolver._getEntryComponentsFromProvider (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15167:30)
    at eval (webpack:///./~/@angular/compiler/@angular/compiler.es5.js?:15131:83)
    at Array.forEach (native)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>哭死我了，后面是改了一个<code v-pre>tsconfig.json</code>配置解决的：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token property">"emitDecoratorMetadata"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> &lt;= 就是这家伙
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>大家也可以尽情嘲笑我，本骚年有时候就是转不过来。</p>
<ul>
<li>webpack.config.js</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 加了个插件，关闭之前的黄色warning</span>
<span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>ContextReplacementPlugin</span><span class="token punctuation">(</span>
  <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">angular(\\|\/)core(\\|\/)@angular</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
  path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"src"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>登录页面也还是我们熟悉的：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970476(1).png" alt="image"></p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了路由相关的介绍和使用，以及添加静态资源，和调整一些配置使得项目得以启动的过程。项目里代码讲得不多，大家可以自行查看。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/3-init-routes-and-assets" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/3-init-routes-and-assets/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


