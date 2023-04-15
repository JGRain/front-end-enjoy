<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文记录将当前的代码切换到 Typescript 中的过程。</p>
<!--more-->
<h1 id="迁移-typescript" tabindex="-1"><a class="header-anchor" href="#迁移-typescript" aria-hidden="true">#</a> 迁移 Typescript</h1>
<h2 id="typescript" tabindex="-1"><a class="header-anchor" href="#typescript" aria-hidden="true">#</a> <a href="https://www.tslang.cn/docs/home.html" target="_blank" rel="noopener noreferrer">Typescript<ExternalLinkIcon/></a></h2>
<p>TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法，因此现有的 JavaScript 代码可与 TypeScript 一起工作无需任何修改，TypeScript 通过类型注解提供编译时的静态类型检查。</p>
<p>之前使用 Typescript 也听多了，用习惯了，如今用回 js 偶尔会有些难受，尤其是在非 IDE 编辑器下，还没有配置 eslint 等的时候[捂脸]。
关于更多的 Typescript 的内容，大家可以去百度或谷歌找找，或许后面用多了，本骚年还能写点总结或者笔记什么的。</p>
<h2 id="js-迁移-ts" tabindex="-1"><a class="header-anchor" href="#js-迁移-ts" aria-hidden="true">#</a> js 迁移 ts</h2>
<p>这里面我们分几个步骤吧：</p>
<ol>
<li>把项目代码 js 文件后缀名更改为 ts。</li>
</ol>
<p>这里面我们在 bash 下面批量 linux 命令转换，能遍历文件以及文件夹下的文件：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">find</span> ./ <span class="token parameter variable">-name</span> <span class="token string">"*.js"</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token parameter variable">-F</span> <span class="token string">"."</span> <span class="token string">'{print $2}'</span> <span class="token operator">|</span> <span class="token function">xargs</span> <span class="token parameter variable">-i</span> <span class="token parameter variable">-t</span> <span class="token function">mv</span> ./<span class="token punctuation">{</span><span class="token punctuation">}</span>.js  ./<span class="token punctuation">{</span><span class="token punctuation">}</span>.ts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2">
<li>安装 typescript 相关模块。</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> typescript ts-loader tslint tslib @types/node
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>TypeScript 还需要全局安装的，如果没有的自觉安装：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">--global</span> typescript
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3">
<li>添加 Typescript 相关配置。</li>
</ol>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token comment">// tsconfig.json</span>
<span class="token comment">// 编译选项</span>
<span class="token punctuation">{</span>
  <span class="token property">"compilerOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"module"</span><span class="token operator">:</span> <span class="token string">"commonjs"</span><span class="token punctuation">,</span>
    <span class="token property">"noImplicitAny"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"removeComments"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"preserveConstEnums"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"sourceMap"</span><span class="token operator">:</span> <span class="token boolean">true</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"exclude"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"node_modules"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment">// tslint.json</span>
<span class="token comment">// 校验规则，这里省略</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li>修改 Webpack 配置。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// webpack.config.js</span>
<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">entry</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token punctuation">[</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"src/index.ts"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">// 入口文件，改成index.ts</span>
  <span class="token literal-property property">resolve</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">extensions</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">".ts"</span><span class="token punctuation">,</span> <span class="token string">".js"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token comment">// 添加ts-loader</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.ts$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">"ts-loader"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
      <span class="token punctuation">}</span>
      <span class="token comment">// ...</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里，本骚年本想着开开心心启动项目了，结果发现报错了。</p>
<h2 id="jsx-和-tsx" tabindex="-1"><a class="header-anchor" href="#jsx-和-tsx" aria-hidden="true">#</a> jsx 和 tsx</h2>
<p>是的，本骚年在项目里用了 jsx，只是以上的配置，当然报错啦。</p>
<ol>
<li>配置调整。这里还需要进行以下的调整：</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// tsconfig.json</span>
<span class="token punctuation">{</span>
    <span class="token string-property property">"compilerOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token comment">// 我们输出为es6，然后可以传递给babel继续处理啦</span>
        <span class="token string-property property">"target"</span><span class="token operator">:</span> <span class="token string">"es6"</span><span class="token punctuation">,</span>
        <span class="token comment">// 还要加上下面这个啊</span>
        <span class="token comment">// 这个代表ts-loader输出保留jsx，后面可以传给babel-loader处理</span>
        <span class="token string-property property">"jsx"</span><span class="token operator">:</span> <span class="token string">"preserve"</span>
        <span class="token comment">// ...</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

<span class="token comment">// webpack.config.js</span>
<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token comment">// ...</span>
            <span class="token comment">// 把tsx给加进去啦</span>
            <span class="token punctuation">{</span>
                <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\.jsx?|.tsx?$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
                <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'babel-loader'</span><span class="token punctuation">,</span> <span class="token string">'ts-loader'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
                <span class="token literal-property property">exclude</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">node_modules</span><span class="token regex-delimiter">/</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token comment">// 由于ts-loader处理时会有html is not a function的报错</span>
		<span class="token comment">// 这里本骚年决定全局注入</span>
        <span class="token keyword">new</span> <span class="token class-name">webpack<span class="token punctuation">.</span>ProvidePlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            <span class="token literal-property property">html</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">'snabbdom-jsx'</span><span class="token punctuation">,</span> <span class="token string">'html'</span><span class="token punctuation">]</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是本骚年研究了好久才找到的方法，从此我们不需要在文件里面加这个啦：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> html <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"snabbdom-jsx"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2">
<li>文件名调整：</li>
</ol>
<p>我们需要将<code v-pre>.ts</code>文件名再一次改为<code v-pre>.tsx</code>。</p>
<p>然后到这里，我们就能将我们的项目跑起来啦，哈哈哈哈。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了我们把 Typescript 迁到我们项目里，其中还有 jsx 相关的配置调整，顺利把项目跑起来啦。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/3-use-typescript" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://cyclejs-notes.godbasin.com/3-use-typescript/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


