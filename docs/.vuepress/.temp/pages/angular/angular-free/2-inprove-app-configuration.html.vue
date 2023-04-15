<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文记录改善应用中一些 html 和 css 加载的问题。</p>
<!--more-->
<h2 id="component-中加载-html-css" tabindex="-1"><a class="header-anchor" href="#component-中加载-html-css" aria-hidden="true">#</a> Component 中加载 html/css</h2>
<h3 id="使用-file-loader" tabindex="-1"><a class="header-anchor" href="#使用-file-loader" aria-hidden="true">#</a> 使用 file-loader</h3>
<p>上一节我们使用简单粗暴的<code v-pre>file-loader</code>生成文件路径方式进行模板加载，我们的组件定义的代码长这样：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">"app-root"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">templateUrl</span><span class="token operator">:</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"file-loader?name=[path][name].[ext]!./app.component.html"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppComponent</span> <span class="token punctuation">{</span>
  title <span class="token operator">=</span> <span class="token string">"app works!"</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样做会有一些问题：</p>
<ol>
<li>使用的时候很不方便，要写一长串。</li>
</ol>
<p>该方法可以通过在 webpack 里对 file-loader 进行配置解决，但可能会产生一些其他问题。本骚年折腾了下没折腾好，估计是姿势不正确吧，大家可以下来试试。</p>
<ol start="2">
<li>生成的代码不打包进<code v-pre>bundle.js</code>文件。</li>
</ol>
<p>这样有个很明显的问题，就是生成的代码体积和大小都比较浪费资源。除非是像本骚年之前的项目一样需要远程 debug 和直接线上修 bug，一般来说都不会需要这样处理的。</p>
<h3 id="其他方式" tabindex="-1"><a class="header-anchor" href="#其他方式" aria-hidden="true">#</a> 其他方式</h3>
<p>当然，像 angular-cli 以及 Angular2 Webpack Starter 这些脚手架和项目，已经对 loader 进行了调整，最终我们是感受不到对 html/css 等的文件加载，同时也能很方便地通过 sourcemap 定位 bug。</p>
<p>这里要不使用以上脚手架的话，就得自己想办法实现这个过程了，当然有能力的话自己写个 loader 也完全没问题，可惜目前本骚年对 npm 和 node 的掌握也很是局限(T_T)。实话说，个人觉得使用一个<code v-pre>file-loader</code>其实说不定也能解决这样的问题了。</p>
<p>下面是从<a href="https://github.com/AngularClass/angular2-webpack-starter" target="_blank" rel="noopener noreferrer">Angular2 Webpack Starter<ExternalLinkIcon/></a>里面翻到的，其中使用的<code v-pre>angular2-template-loader</code>的使用过程。</p>
<h2 id="使用-angular2-template-loader" tabindex="-1"><a class="header-anchor" href="#使用-angular2-template-loader" aria-hidden="true">#</a> 使用 angular2-template-loader</h2>
<h3 id="angular2-template-loader" tabindex="-1"><a class="header-anchor" href="#angular2-template-loader" aria-hidden="true">#</a> angular2-template-loader</h3>
<p>关于安装和使用等说明，都可以参考<a href="https://github.com/TheLarkInn/angular2-template-loader" target="_blank" rel="noopener noreferrer">angular2-template-loader 文档<ExternalLinkIcon/></a>。</p>
<p>这里我们不再需要<code v-pre>file-loader</code>了，同时我们需要添加<code v-pre>angular2-template-loader</code>以及<code v-pre>raw-loader</code>。</p>
<p>其中<code v-pre>raw-loader</code>常用于把文件内容作为字符串返回。</p>
<h3 id="package-json" tabindex="-1"><a class="header-anchor" href="#package-json" aria-hidden="true">#</a> package.json</h3>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"angular-free"</span><span class="token punctuation">,</span>
  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.0"</span><span class="token punctuation">,</span>
  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"webpack --config webpack.config.js"</span><span class="token punctuation">,</span>
    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"webpack-dev-server --config webpackServer.config.js --host 0.0.0.0 --port 3333 --devtool eval --progress --colors --hot --content-base dist"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"@angular/common"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/compiler"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/compiler-cli"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/core"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/forms"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/http"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/platform-browser"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/platform-browser-dynamic"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/router"</span><span class="token operator">:</span> <span class="token string">"~4.1.2"</span><span class="token punctuation">,</span>
    <span class="token property">"rxjs"</span><span class="token operator">:</span> <span class="token string">"^5.1.0"</span><span class="token punctuation">,</span>
    <span class="token property">"zone.js"</span><span class="token operator">:</span> <span class="token string">"^0.8.10"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"@types/node"</span><span class="token operator">:</span> <span class="token string">"^7.0.18"</span><span class="token punctuation">,</span>
    <span class="token property">"angular2-template-loader"</span><span class="token operator">:</span> <span class="token string">"~0.6.2"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-core"</span><span class="token operator">:</span> <span class="token string">"~6.24.1"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-loader"</span><span class="token operator">:</span> <span class="token string">"~7.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-polyfill"</span><span class="token operator">:</span> <span class="token string">"~6.23.0"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-preset-latest"</span><span class="token operator">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>
    <span class="token property">"html-webpack-plugin"</span><span class="token operator">:</span> <span class="token string">"^2.28.0"</span><span class="token punctuation">,</span>
    <span class="token property">"raw-loader"</span><span class="token operator">:</span> <span class="token string">"^0.5.1"</span><span class="token punctuation">,</span>
    <span class="token property">"ts-loader"</span><span class="token operator">:</span> <span class="token string">"^2.0.3"</span><span class="token punctuation">,</span>
    <span class="token property">"tslint"</span><span class="token operator">:</span> <span class="token string">"^5.2.0"</span><span class="token punctuation">,</span>
    <span class="token property">"typescript"</span><span class="token operator">:</span> <span class="token string">"~2.2.0"</span><span class="token punctuation">,</span>
    <span class="token property">"webpack"</span><span class="token operator">:</span> <span class="token string">"~2.5.1"</span><span class="token punctuation">,</span>
    <span class="token property">"webpack-dev-server"</span><span class="token operator">:</span> <span class="token string">"~2.4.5"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里本骚年也调整了一下依赖对应的版本，毕竟像 angular 这样的不兼容升级方式，还是做点记号的好。</p>
<h3 id="webpack-config-js" tabindex="-1"><a class="header-anchor" href="#webpack-config-js" aria-hidden="true">#</a> webpack.config.js</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 这里调整了loader</span>
<span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.ts$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-loader"</span><span class="token punctuation">,</span> <span class="token string">"ts-loader"</span><span class="token punctuation">,</span> <span class="token string">'angular2-template-loader'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.(html|css)$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'raw-loader'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token punctuation">[</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">'src/index.html'</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.async\.(html|css)$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">loaders</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'file?name=[name].[ext]'</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token operator">...</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="app-component-ts" tabindex="-1"><a class="header-anchor" href="#app-component-ts" aria-hidden="true">#</a> app.component.ts</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">"app-root"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">templateUrl</span><span class="token operator">:</span> <span class="token string">"./app.component.html"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">styleUrls</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"app.style.css"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppComponent</span> <span class="token punctuation">{</span>
  title <span class="token operator">=</span> <span class="token string">"app works!"</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终使用的方式如上，与<code v-pre>angular2-template-loader</code>官方推荐的<code v-pre>require</code>方法不一致，但是这样更加方便了。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了使用<code v-pre>angular2-template-loader</code>替换之前的<code v-pre>file-loader</code>，来改善 angular2 中 html 文件的引入方式。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/2-inprove-app-configuration" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/2-inprove-app-configuration/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


