<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文记录用 webpack 配置环境，启动 app 的过程。</p>
<!--more-->
<h2 id="基本依赖" tabindex="-1"><a class="header-anchor" href="#基本依赖" aria-hidden="true">#</a> 基本依赖</h2>
<p>其实 angular2 快速启动的脚手架也不少，官方的<a href="https://github.com/angular/angular-cli" target="_blank" rel="noopener noreferrer">angular-cli<ExternalLinkIcon/></a>，<a href="https://github.com/AngularClass/angular2-webpack-starter" target="_blank" rel="noopener noreferrer">Angular2 Webpack Starter<ExternalLinkIcon/></a>等等。</p>
<p>这里选择自己搭建的原因，大概是脚手架什么的生成最后的项目总有一些不需要的，还有像单元测试和 e2e 等等基本不会用到的。</p>
<p>本骚年更偏向的是，一点一点地搭建起来，缺了就慢慢补，这样里面的每个东西都是自己很清楚的。</p>
<h3 id="package-json" tabindex="-1"><a class="header-anchor" href="#package-json" aria-hidden="true">#</a> package.json</h3>
<p>首先，当然要介绍下我们的一些基本依赖，一般都会选择从 package.json 开始。</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"angular-free"</span><span class="token punctuation">,</span>
  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.0"</span><span class="token punctuation">,</span>
  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"webpack --config webpack.config.js"</span><span class="token punctuation">,</span>
    <span class="token property">"dev"</span><span class="token operator">:</span> <span class="token string">"webpack-dev-server --config webpackServer.config.js --host 0.0.0.0 --port 3333 --devtool eval --progress --colors --hot --content-base dist"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"@angular/common"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/compiler"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/compiler-cli"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/core"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/forms"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/http"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/platform-browser"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/platform-browser-dynamic"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"@angular/router"</span><span class="token operator">:</span> <span class="token string">"^4.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"rxjs"</span><span class="token operator">:</span> <span class="token string">"^5.1.0"</span><span class="token punctuation">,</span>
    <span class="token property">"zone.js"</span><span class="token operator">:</span> <span class="token string">"^0.8.10"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"@types/node"</span><span class="token operator">:</span> <span class="token string">"^7.0.18"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-core"</span><span class="token operator">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-loader"</span><span class="token operator">:</span> <span class="token string">"^7.0.0"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-polyfill"</span><span class="token operator">:</span> <span class="token string">"^6.23.0"</span><span class="token punctuation">,</span>
    <span class="token property">"babel-preset-latest"</span><span class="token operator">:</span> <span class="token string">"^6.24.1"</span><span class="token punctuation">,</span>
    <span class="token property">"file-loader"</span><span class="token operator">:</span> <span class="token string">"^0.11.1"</span><span class="token punctuation">,</span>
    <span class="token property">"html-webpack-plugin"</span><span class="token operator">:</span> <span class="token string">"^2.28.0"</span><span class="token punctuation">,</span>
    <span class="token property">"ts-loader"</span><span class="token operator">:</span> <span class="token string">"^2.0.3"</span><span class="token punctuation">,</span>
    <span class="token property">"tslint"</span><span class="token operator">:</span> <span class="token string">"^5.2.0"</span><span class="token punctuation">,</span>
    <span class="token property">"typescript"</span><span class="token operator">:</span> <span class="token string">"~2.2.0"</span><span class="token punctuation">,</span>
    <span class="token property">"webpack"</span><span class="token operator">:</span> <span class="token string">"^2.5.1"</span><span class="token punctuation">,</span>
    <span class="token property">"webpack-dev-server"</span><span class="token operator">:</span> <span class="token string">"^2.4.5"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里可以大概看到，除了基本的 angularv4.0+（这里本骚年安装的是 v4.1.2 版本），我们还用到了其他的一些工具或者库，像：</p>
<ul>
<li>webpack</li>
<li>babel</li>
<li>typescript</li>
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
<li>babel-loader：将 ES6 甚至 ES7 编译成 ES5</li>
<li>css/style-loader：基本的样式文件编译打包</li>
<li>ts-loader：将 ts 编译成 js。</li>
<li>file-loader：这里主要是方便 angular 组件声明<code v-pre>templateUrl</code>等一些文件路径的时候比较方便。</li>
</ul>
<p>关于插件 plugins，这里主要用了一个<code v-pre>html-webpack-plugin</code>，用于插入<code v-pre>index.html</code>页面。</p>
<p>上码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> HtmlwebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"html-webpack-plugin"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// 入口</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-polyfill"</span><span class="token punctuation">,</span> <span class="token string">"./src/bootstrap.ts"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// 生成的文件</span>
  <span class="token literal-property property">output</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">path</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">"bundle.js"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 文件后缀</span>
  <span class="token literal-property property">resolve</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">extensions</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">".ts"</span><span class="token punctuation">,</span> <span class="token string">".js"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// babel</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.ts$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"babel-loader"</span><span class="token punctuation">,</span> <span class="token string">"ts-loader"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.css$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span> <span class="token comment">// Only .css files</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"style-loader"</span><span class="token punctuation">,</span> <span class="token string">"css-loader"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// plugins</span>
    <span class="token keyword">new</span> <span class="token class-name">HtmlwebpackPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">template</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"src/index.html"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token literal-property property">inject</span><span class="token operator">:</span> <span class="token string">"body"</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">devtool</span><span class="token operator">:</span> <span class="token string">"source-map"</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> config<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中主要涉及的文件生成：</p>
<ul>
<li>bundle.js: 为主要代码的编译打包</li>
</ul>
<p>之前在<a href="https://godbasin.github.io/2017/02/05/angular-free-1-webpack-and-babel-config/" target="_blank" rel="noopener noreferrer">《玩转 angular1》系列<ExternalLinkIcon/></a>中讲过一种将依赖单独打包成 vendors.js，而将项目代码打包成 bundle.js，这样的方式使用场景不一样，大家需要也可以去看看。</p>
<h3 id="webpackserver-config-js" tabindex="-1"><a class="header-anchor" href="#webpackserver-config-js" aria-hidden="true">#</a> webpackServer.config.js</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./webpack.config.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
config<span class="token punctuation">.</span>entry<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token punctuation">[</span>
  <span class="token string">"webpack/hot/dev-server"</span><span class="token punctuation">,</span>
  <span class="token string">"webpack-dev-server/client?http://localhost:3333"</span>
<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> config<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="其他配置" tabindex="-1"><a class="header-anchor" href="#其他配置" aria-hidden="true">#</a> 其他配置</h2>
<h3 id="babelrc" tabindex="-1"><a class="header-anchor" href="#babelrc" aria-hidden="true">#</a> .babelrc</h3>
<p>babel-loader 的配置通常使用.babelrc 文件进行配置：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"latest"</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"ignore"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"./node_modules"</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至于<code v-pre>presets</code>参数，我们直接上最新的特性就好啦。当然小伙伴们也可以根据自己的喜好配置像&quot;es-2015&quot;、&quot;stage-0&quot;等阶段，当然需要安装相应的 babel 依赖啦。</p>
<p>更多的 babel 解读可参考阮一峰的<a href="http://www.ruanyifeng.com/blog/2016/01/babel.html" target="_blank" rel="noopener noreferrer">《Babel 入门教程》<ExternalLinkIcon/></a>。</p>
<h3 id="tsconfig-json" tabindex="-1"><a class="header-anchor" href="#tsconfig-json" aria-hidden="true">#</a> tsconfig.json</h3>
<p>直接上 json：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"compilerOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"baseUrl"</span><span class="token operator">:</span> <span class="token string">"src"</span><span class="token punctuation">,</span>
    <span class="token property">"target"</span><span class="token operator">:</span> <span class="token string">"es5"</span><span class="token punctuation">,</span>
    <span class="token property">"module"</span><span class="token operator">:</span> <span class="token string">"commonjs"</span><span class="token punctuation">,</span>
    <span class="token property">"sourceMap"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"noImplicitAny"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token property">"noFallthroughCasesInSwitch"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"noImplicitReturns"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"importHelpers"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"noEmitHelpers"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"pretty"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"strictNullChecks"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token property">"experimentalDecorators"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"lib"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"dom"</span><span class="token punctuation">,</span> <span class="token string">"es7"</span><span class="token punctuation">,</span> <span class="token string">"es6"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"exclude"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"node_modules"</span><span class="token punctuation">,</span> <span class="token string">"src/assets"</span><span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启动应用" tabindex="-1"><a class="header-anchor" href="#启动应用" aria-hidden="true">#</a> 启动应用</h2>
<h3 id="项目代码" tabindex="-1"><a class="header-anchor" href="#项目代码" aria-hidden="true">#</a> 项目代码</h3>
<p>关于代码其实很简单，从 angular-cli 里偷过来一个<code v-pre>app-root</code>的模块组件，然后拼到项目里，最终长这么一个样：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/@IA9G2NI16PS9O$ERF%(E)Q.png" alt="image"></p>
<p>打包之后生成的 dist 目录长这样：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/3B8D%PM}FA$%B2G58~%(H[4.png" alt="image"></p>
<p>其实这里大家可以看到这样使用 file-loader 的话，对应的文件并不会一起打包进去 bundle.js 文件里，这样有好处也有不好的地方。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了 webpack/babel/Typescript 一些相关配置，项目其实已经搭建起来了，但是目前看来并不是特别完善，后面我们可以做些改善和调整。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/1-init-angular-app-with-webpack" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/1-init-angular-app-with-webpack/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


