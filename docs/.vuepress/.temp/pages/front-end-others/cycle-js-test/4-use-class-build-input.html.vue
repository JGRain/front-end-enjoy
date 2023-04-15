<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文记录使用 Class 创建 input 控件的过程，以及其中使用装饰器和调整配置的笔记。</p>
<!--more-->
<h2 id="使用装饰器" tabindex="-1"><a class="header-anchor" href="#使用装饰器" aria-hidden="true">#</a> 使用装饰器</h2>
<p>这里我们先进行装饰器的配置调整。</p>
<h3 id="使用最新-babel-特性" tabindex="-1"><a class="header-anchor" href="#使用最新-babel-特性" aria-hidden="true">#</a> 使用最新 babel 特性</h3>
<p>为了使用装饰器，之前安装的<code v-pre>babel-preset-es2015</code>不知道够不够用啦，不管三七二十一我们直接上最新的特性啦：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> babel-preset-latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里我们还需要调整 babel 配置：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token comment">// .babelrc</span>
<span class="token punctuation">{</span>
  <span class="token property">"presets"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"latest"</span> <span class="token comment">// 改成latest</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"plugins"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"syntax-jsx"</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">"transform-react-jsx"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token property">"pragma"</span><span class="token operator">:</span> <span class="token string">"html"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实这里并不需要安装最新特性的<code v-pre>babel</code>的，因为我们入口文件都是先经过<code v-pre>ts-loader</code>的，而我们前面配置它的输出是<code v-pre>es6</code>。
所以这里是多此一举[捂脸]，不过介绍一下也没多大关系啦。</p>
<h3 id="调整-ts-配置" tabindex="-1"><a class="header-anchor" href="#调整-ts-配置" aria-hidden="true">#</a> 调整 ts 配置</h3>
<p>这里我们需要在<code v-pre>tsconfig.json</code>里面添加上关于装饰器的配置：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"compilerOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 启动装饰器和元数据</span>
    <span class="token property">"emitDecoratorMetadata"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"experimentalDecorators"</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用-class-创建-input" tabindex="-1"><a class="header-anchor" href="#使用-class-创建-input" aria-hidden="true">#</a> 使用 Class 创建 Input</h2>
<h3 id="添加-bindmethods-装饰器" tabindex="-1"><a class="header-anchor" href="#添加-bindmethods-装饰器" aria-hidden="true">#</a> 添加 bindMethods 装饰器</h3>
<p>前面在玩 angular1 和 typescript 的时候也发现和讲过，es6 里的 Class 类，我们在使用的时候总是会有<code v-pre>this</code>的指向的问题，所以这里做个<code v-pre>bindMethods</code>装饰器，来进行<code v-pre>this</code>的绑定。</p>
<p>我们创建<code v-pre>utils</code>文件夹，用来管理这类工具，然后创建<code v-pre>bindMethods.ts</code>：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 将实例的原型上面所有函数都绑定this</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">bindMethods</span><span class="token punctuation">(</span><span class="token parameter">oldConstructor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token literal-property property">newConstructor</span><span class="token operator">:</span> <span class="token function-variable function">any</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">oldConstructor</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> prototype <span class="token operator">=</span> oldConstructor<span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

    Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>prototype<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">key</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> prototype<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        instance<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> prototype<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>instance<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// 复制构造函数的$inject属性</span>
  Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span>newConstructor<span class="token punctuation">,</span> oldConstructor<span class="token punctuation">)</span><span class="token punctuation">;</span>

  newConstructor<span class="token punctuation">.</span>prototype <span class="token operator">=</span> oldConstructor<span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>
  <span class="token keyword">return</span> newConstructor<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="添加文件夹别名" tabindex="-1"><a class="header-anchor" href="#添加文件夹别名" aria-hidden="true">#</a> 添加文件夹别名</h3>
<p>有个良好的习惯还是不错的，例如本骚年喜欢在架(luan)构(xie)项目的时候，就把共用文件夹的别名给添加上。
创建<code v-pre>import</code>或<code v-pre>require</code>的别名，来确保模块引入变得更简单。</p>
<p>首先我们要配置 Webpack 中的<code v-pre>esolve.alias</code>：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// webpack.config.js</span>
<span class="token keyword">var</span> config <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
  <span class="token literal-property property">resolve</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">alias</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">utils</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"src"</span><span class="token punctuation">,</span> <span class="token string">"utils"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token literal-property property">components</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">"src"</span><span class="token punctuation">,</span> <span class="token string">"components"</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为我们使用 Typescript，所以我们还需要调整 ts 的配置：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token comment">// tsconfig.json</span>
<span class="token punctuation">{</span>
  <span class="token property">"compilerOptions"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token property">"baseUrl"</span><span class="token operator">:</span> <span class="token string">"src"</span><span class="token punctuation">,</span>
    <span class="token property">"paths"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"utils"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"utils"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"components"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"components"</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建一个-input" tabindex="-1"><a class="header-anchor" href="#创建一个-input" aria-hidden="true">#</a> 创建一个 Input</h3>
<p>这里我们在<code v-pre>components</code>文件夹中添加<code v-pre>input.tsx</code>文件：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> xs <span class="token keyword">from</span> <span class="token string">"xstream"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> run <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/run"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> makeDOMDriver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/dom"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> bindMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"utils/bindMethods"</span><span class="token punctuation">;</span>

<span class="token comment">// 为了匹配不一样的input，只能先凑合加个随机id来匹配啦</span>
<span class="token keyword">let</span> <span class="token literal-property property">id</span><span class="token operator">:</span> number <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

@bindMethods
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InputComponent</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token operator">:</span> any<span class="token punctuation">;</span>
  <span class="token literal-property property">value</span><span class="token operator">:</span> any<span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">domSources<span class="token punctuation">,</span> type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取值的流呀</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> domSources
      <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#input"</span> <span class="token operator">+</span> id<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"change"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">ev</span> <span class="token operator">=></span> ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// DOM值</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token constant">DOM</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">val</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>input
          type<span class="token operator">=</span><span class="token punctuation">{</span>type<span class="token punctuation">}</span>
          id<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">"input"</span> <span class="token operator">+</span> id<span class="token operator">++</span><span class="token punctuation">}</span>
          className<span class="token operator">=</span><span class="token string">"form-control"</span>
          value<span class="token operator">=</span><span class="token punctuation">{</span>val<span class="token punctuation">}</span>
        <span class="token operator">/</span><span class="token operator">></span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[捂脸]感觉今天智商有点不够用，尝试了下没有想象中的结果出来。
或许后面对于流还需要再仔细研究，就能出来啦。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要讲了为了使用装饰器进行配置调整，使用 Class 创建 input 控件的过程，不过智商不够用，还没能顺利跑起来。<br>
项目代码也是个参考的过程，所以也作为一节来记录。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/4-use-class-build-input" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a></p>
</div></template>


