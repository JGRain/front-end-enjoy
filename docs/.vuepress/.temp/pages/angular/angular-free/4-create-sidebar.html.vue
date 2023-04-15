<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文记录制作左侧菜单，并使用路由自动定位的过程。</p>
<!--more-->
<h2 id="调整配置" tabindex="-1"><a class="header-anchor" href="#调整配置" aria-hidden="true">#</a> 调整配置</h2>
<p>上一篇有些配置不是很合适，故这里我们先进行调整。</p>
<h3 id="全局注入-jquery" tabindex="-1"><a class="header-anchor" href="#全局注入-jquery" aria-hidden="true">#</a> 全局注入 jQuery</h3>
<p>上篇我们是这样注入 jQuery 的：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// jquery</span>
window<span class="token punctuation">[</span><span class="token string">"$"</span><span class="token punctuation">]</span> <span class="token operator">=</span> window<span class="token punctuation">[</span><span class="token string">"jQuery"</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./assets/js/jquery.min.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样的全局注入其实可能会导致一些问题（不知道是不是配置不正确，导致本骚年的其他 jQuery 插件失效），所以我们还是用 webpack 来注入。
首先安装 jQuery 的依赖：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>npm install jquery <span class="token operator">--</span>save
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在 webpack 的插件配置<code v-pre>plugins</code>中添加：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
  <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>ProvidePlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">$</span><span class="token operator">:</span> <span class="token string">"jquery"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">jQuery</span><span class="token operator">:</span> <span class="token string">"jquery"</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就可以挪掉上面不够优雅的注入方式了。</p>
<h3 id="开启-source-map" tabindex="-1"><a class="header-anchor" href="#开启-source-map" aria-hidden="true">#</a> 开启 source-map</h3>
<p>之前我们的 webpack 配置中也添加了<code v-pre>devtool: 'source-map'</code>，但是这个需要配合<code v-pre>source-map-loader</code>才能生效：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>npm install <span class="token operator">-</span><span class="token constant">D</span> source<span class="token operator">-</span>map<span class="token operator">-</span>loader
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在 webpack 中添加 loader：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.js$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
    <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"source-map-loader"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">enforce</span><span class="token operator">:</span> <span class="token string">"pre"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"node_modules"</span><span class="token punctuation">,</span> <span class="token string">"@angular/compiler"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"node_modules"</span><span class="token punctuation">,</span> <span class="token string">"rxjs"</span><span class="token punctuation">)</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们需要排除<code v-pre>@angular/compiler</code>以及<code v-pre>rxjs</code>，可能还有其他一些依赖，不然会有 webpack 的<code v-pre>warning</code>。详细也可以查看类似的<a href="https://github.com/angular-redux/store/issues/64" target="_blank" rel="noopener noreferrer">issue-Warnings displayed by webpack when using source-map-loader<ExternalLinkIcon/></a>。</p>
<h3 id="压缩代码" tabindex="-1"><a class="header-anchor" href="#压缩代码" aria-hidden="true">#</a> 压缩代码</h3>
<p>webpack 自带了一个压缩插件<code v-pre>UglifyJsPlugin</code>，我们添加以下配置就可以生效：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
  <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>optimize<span class="token punctuation">.</span>UglifyJsPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">compress</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">warnings</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>压缩后的代码体积大大减小，但会消耗一定的编译速度，故一般打包到生产环境才会使用。</p>
<h3 id="分离代码" tabindex="-1"><a class="header-anchor" href="#分离代码" aria-hidden="true">#</a> 分离代码</h3>
<p>如果说我们需要分离其他的代码，像一些依赖的代码，或者是 css 代码，也可以通过配置实现。</p>
<ol>
<li>抽离依赖<code v-pre>vender.js</code>文件</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">CommonsChunkPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"vendors"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">"vendors.js"</span><span class="token punctuation">,</span>
  <span class="token function-variable function">minChunks</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">isExternal</span><span class="token punctuation">(</span>module<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关于<code v-pre>isExternal()</code>函数，用了很简单的方式进行：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">isExternal</span><span class="token punctuation">(</span><span class="token parameter">module</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> userRequest <span class="token operator">=</span> module<span class="token punctuation">.</span>userRequest<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> userRequest <span class="token operator">!==</span> <span class="token string">"string"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> userRequest<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token string">"node_modules"</span><span class="token punctuation">)</span> <span class="token operator">>=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 是否位于node_modules里</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>将样式从 js 中抽出，生成单独的<code v-pre>.css</code>样式文件。即把所以的 css 打包合并：</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">ExtractTextPlugin</span><span class="token punctuation">(</span><span class="token string">"style.css"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">allChunks</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token comment">// 提取所有的chunk（默认只提取initial chunk，而上面CommonsChunkPlugin已经把部分抽离了）</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这些大家下来可以配置，本骚年就不在项目这使用了。</p>
<h2 id="创建左侧菜单" tabindex="-1"><a class="header-anchor" href="#创建左侧菜单" aria-hidden="true">#</a> 创建左侧菜单</h2>
<h3 id="添加配置文件" tabindex="-1"><a class="header-anchor" href="#添加配置文件" aria-hidden="true">#</a> 添加配置文件</h3>
<p>这里我们为了方便拓展，使用配置的方式来自定义菜单，这样每次我们需要修改的时候只需要调整配置文件就好了：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// sidebar.config.ts</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> menus <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">icon</span><span class="token operator">:</span> <span class="token string">"fa-home"</span><span class="token punctuation">,</span> <span class="token comment">// icon用于储存菜单对应的图标</span>
    <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"页面管理"</span><span class="token punctuation">,</span> <span class="token comment">// text用于储存该菜单显示名称</span>
    <span class="token literal-property property">childMenus</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">"/home/page-setting"</span><span class="token punctuation">,</span> <span class="token comment">// link用于设定该菜单跳转路由</span>
        <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"页面配置"</span> <span class="token comment">// text用于储存该菜单显示名称</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">"/home/page-rebuild"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"页面重现"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">icon</span><span class="token operator">:</span> <span class="token string">"fa-cubes"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"使用说明"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">link</span><span class="token operator">:</span> <span class="token string">"/home/page-handbook"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里暂时限定我们最多为二级菜单，跟之前搭建管理项目的方式一致。</p>
<h3 id="添加-html-文件" tabindex="-1"><a class="header-anchor" href="#添加-html-文件" aria-hidden="true">#</a> 添加 html 文件</h3>
<p>这里我们可以遍历配置文件生成菜单：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-3 left_col menu_fixed<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>left_col scroll-view<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token comment">&lt;!-- 其他省略，重点在下面 --></span>

    <span class="token comment">&lt;!-- sidebar menu --></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>main_menu_side hidden-print main_menu<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menu_section<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
        <span class="token comment">&lt;!-- 其他省略，重点在下面 --></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav side-menu metismenu<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>sidebar-menu<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span>
            <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>topper-menu<span class="token punctuation">"</span></span>
            <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>let menu of menus;<span class="token punctuation">"</span></span>
            <span class="token attr-name">[ngClass]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menu.link &amp;&amp; isActive(menu.link) ? 'active' : ''<span class="token punctuation">"</span></span>
          <span class="token punctuation">></span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menu.link<span class="token punctuation">"</span></span> <span class="token attr-name">[routerLink]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menu.link<span class="token punctuation">"</span></span>
              <span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>i</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fa<span class="token punctuation">"</span></span> <span class="token attr-name">[ngClass]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menu.icon<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>i</span><span class="token punctuation">></span></span> {{menu.text}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span>
            <span class="token punctuation">></span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!menu.link<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>has-arrow<span class="token punctuation">"</span></span>
              <span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>i</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fa<span class="token punctuation">"</span></span> <span class="token attr-name">[ngClass]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menu.icon<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>i</span><span class="token punctuation">></span></span> {{menu.text}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span>
            <span class="token punctuation">></span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>nav child_menu slide<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span>
                <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>let childMenu of menu.childMenus;<span class="token punctuation">"</span></span>
                <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>slide-item<span class="token punctuation">"</span></span>
                <span class="token attr-name">routerLinkActive</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>current-page<span class="token punctuation">"</span></span>
              <span class="token punctuation">></span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">[routerLink]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>childMenu.link<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{ childMenu.text }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token comment">&lt;!-- /sidebar menu --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里可以看到，我们使用<code v-pre>*ngFor</code>来进行遍历，然后我们大致可以得到我们的 component 需要以下功能：</p>
<ul>
<li><code v-pre>[routerLink]</code>： 链接跳转</li>
<li><code v-pre>routerLinkActive</code>： 路由激活时样式</li>
<li><code v-pre>isChildMenuActived</code>： 判断该菜单下是否有子菜单的路由处于激活状态</li>
</ul>
<p>这里我们需要注意的是：</p>
<ol>
<li>使用 angular 自带的常用指令，像<code v-pre>*ngFor</code>、<code v-pre>ngClass</code>等，需要在注册<code v-pre>@NgModule</code>时引入<code v-pre>CommonModule</code>。</li>
<li>使用 angular 里面路由常用指令，像<code v-pre>[routerLink]</code>、<code v-pre>routerLinkActive</code>等，需要在注册<code v-pre>@NgModule</code>时引入<code v-pre>RouterModule</code>。</li>
<li>使用 angular 里面表单常用指令，像<code v-pre>[(ngModel)]</code>等，需要在注册<code v-pre>@NgModule</code>时引入<code v-pre>FormModule</code>。</li>
</ol>
<p>像我们的<code v-pre>HomeModule</code>：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> NgModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/core"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> FormsModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/forms"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> RouterModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/router"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> CommonModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/common"</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> HomeRoutes <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./home.routes"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HomeComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./home.component"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SidebarComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./sidebar/sidebar.component"</span><span class="token punctuation">;</span>

@<span class="token function">NgModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">declarations</span><span class="token operator">:</span> <span class="token punctuation">[</span>HomeComponent<span class="token punctuation">,</span> SidebarComponent<span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">imports</span><span class="token operator">:</span> <span class="token punctuation">[</span>FormsModule<span class="token punctuation">,</span> CommonModule<span class="token punctuation">,</span> RouterModule<span class="token punctuation">.</span><span class="token function">forChild</span><span class="token punctuation">(</span>HomeRoutes<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">providers</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">HomeModule</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="添加-component" tabindex="-1"><a class="header-anchor" href="#添加-component" aria-hidden="true">#</a> 添加 component</h3>
<p>组件使用了简单的 jQuey 插件<a href="https://github.com/onokumus/metismenu" target="_blank" rel="noopener noreferrer">metisMenu<ExternalLinkIcon/></a>，详细说明请参考文档，这里我们只需要知道调用<code v-pre>$().metisMenu()</code>的时候，若有<code v-pre>&lt;li class=&quot;active&quot;&gt;</code>则自动将该<code v-pre>&lt;li&gt;</code>设置为激活形式，此时我们在路由跳转结束的时候就可以获取对应激活路由然后初始化菜单状态了。</p>
<p>我们直接在代码中说明吧：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>Component<span class="token punctuation">,</span> ElementRef<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>ActivatedRoute<span class="token punctuation">,</span> Router<span class="token punctuation">,</span> NavigationEnd<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>menus<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./sidebar.config'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">'rxjs/Rx'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'home-sidebar'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">templateUrl</span><span class="token operator">:</span> <span class="token string">'./sidebar.component.html'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SidebarComponent</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">menus</span><span class="token operator">:</span> any<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> menus<span class="token punctuation">;</span>

    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">private</span> <span class="token literal-property property">route</span><span class="token operator">:</span> ActivatedRoute<span class="token punctuation">,</span> <span class="token keyword">private</span> <span class="token literal-property property">router</span><span class="token operator">:</span> Router<span class="token punctuation">,</span> <span class="token literal-property property">el</span><span class="token operator">:</span> ElementRef</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>router<span class="token punctuation">.</span>events<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">event</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token comment">// 判断路由结束</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>event <span class="token keyword">instanceof</span> <span class="token class-name">NavigationEnd</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">const</span> $menu <span class="token operator">=</span> <span class="token function">$</span><span class="token punctuation">(</span>el<span class="token punctuation">.</span>nativeElement<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token string">'#sidebar-menu'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>menus<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">menu<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">isChildMenuActived</span><span class="token punctuation">(</span>menu<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token comment">// 将被激活的路由对应的li添加“active”的class</span>
                        $menu<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token string">'li.topper-menu'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">eq</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addClass</span><span class="token punctuation">(</span><span class="token string">'active'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// 初始化菜单状态</span>
                $menu<span class="token punctuation">.</span><span class="token function">metisMenu</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 判断路由是否激活状态</span>
    <span class="token function">isActive</span><span class="token punctuation">(</span>url<span class="token operator">:</span> string<span class="token punctuation">)</span><span class="token operator">:</span> boolean <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>router<span class="token punctuation">.</span><span class="token function">isActive</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 判断菜单是否有子路由处于激活状态</span>
    <span class="token function">isChildMenuActived</span><span class="token punctuation">(</span>menu<span class="token operator">:</span> any<span class="token punctuation">)</span><span class="token operator">:</span> boolean <span class="token punctuation">{</span>
        <span class="token keyword">let</span> hasOneActive <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>menu<span class="token punctuation">.</span>childMenus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 遍历子路由看是否被激活</span>
            menu<span class="token punctuation">.</span>childMenus<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">child</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                hasOneActive <span class="token operator">=</span> hasOneActive <span class="token operator">||</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">isActive</span><span class="token punctuation">(</span>child<span class="token punctuation">.</span>link<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> hasOneActive<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Angular2-release 版本里，一般路由的状态是通过事件监听获取的：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 使用`ActivatedRoute`的API获取路由信息。</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ActivatedRoute <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/router'</span><span class="token punctuation">;</span>
@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token operator">...</span> <span class="token comment">// 略</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SidebarComponent</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">private</span> <span class="token literal-property property">route</span><span class="token operator">:</span> ActivatedRoute</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
   	<span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>route<span class="token punctuation">.</span>params
        <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">params</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>params<span class="token punctuation">[</span><span class="token string">'id'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 获取params</span>
         <span class="token operator">...</span> <span class="token comment">// 其余代码</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token operator">...</span> <span class="token comment">// 其余代码</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们也可以使用<code v-pre>filter()</code>来过滤监听我们想要的事件：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 监听导航事件变更完毕</span>
router<span class="token punctuation">.</span>events
  <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">event</span> <span class="token operator">=></span> event <span class="token keyword">instanceof</span> <span class="token class-name">NavigationEnd</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">event</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多有关路由的我们上节也说过，可以点击回顾<RouterLink to="/angular/angular-free/3-init-routes-and-assets.html">《3. 启用路由和添加静态资源》</RouterLink>。</p>
<p>最终效果图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970603(1).png" alt="image"></p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了一些基础环境配置的调整，以及制作路由自动定位左侧菜单的过程，主要涉及的可能还是路由相关。<br>
看菜单列表的内容，大家猜猜本骚年接下来想要做什么？就不告诉你，哈哈。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/4-create-sidebar" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/4-create-sidebar/index.html#/home/page-setting" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


