<template><div><p>前端框架日新月异，而其中的数据绑定已经作为一个框架最基础的功能。我们常常使用的单向绑定、双向绑定、事件绑定、样式绑定等，里面具体怎么实现，而当我们数据变动的时候又会触发怎样的底部流程呢？</p>
<!--more-->
<h1 id="模板数据绑定" tabindex="-1"><a class="header-anchor" href="#模板数据绑定" aria-hidden="true">#</a> 模板数据绑定</h1>
<p>数据绑定的过程其实不复杂：</p>
<ol>
<li>解析语法生成 AST。</li>
<li>根据 AST 结果生成 DOM。</li>
<li>将数据绑定更新至模板。</li>
</ol>
<h2 id="解析语法生成-ast" tabindex="-1"><a class="header-anchor" href="#解析语法生成-ast" aria-hidden="true">#</a> 解析语法生成 AST</h2>
<p>抽象语法树（Abstract Syntax Tree）也称为 AST 语法树，指的是源代码语法所对应的树状结构。也就是说，对于一种具体编程语言下的源代码，通过构建语法树的形式将源代码中的语句映射到树中的每一个节点上。</p>
<p>其实我们的 DOM 结构树，也是 AST 的一种，把 HTML DOM 语法解析并生成最终的页面。而模板引擎中常用的，则是将模板语法解析生成 HTML DOM。</p>
<h3 id="捕获特定语法" tabindex="-1"><a class="header-anchor" href="#捕获特定语法" aria-hidden="true">#</a> 捕获特定语法</h3>
<p>生成 AST 的过程涉及到编译器的原理，一般经过以下过程：</p>
<ol>
<li>语法分析。</li>
</ol>
<p>语法分析的任务是在词法分析的基础上将单词序列组合成各类语法短语，如“程序”，“语句”，“表达式”等等。
语法分析程序判断源程序在结构上是否正确，源程序的结构由上下文无关文法描述。语法分析程序可以用 YACC 等工具自动生成。</p>
<ol start="2">
<li>语义分析</li>
</ol>
<p>语义分析是编译过程的一个逻辑阶段，语义分析的任务是对结构上正确的源程序进行上下文有关性质的审查，进行类型审查。语义分析是审查源程序有无语义错误，为代码生成阶段收集类型信息。
一般类型检查也会在这个过程中进行。</p>
<ol start="3">
<li>生成 AST。</li>
</ol>
<p>AST 的结构则根据使用者需要定义，下面的一些对象都是本人根据需要假设定义的。</p>
<h3 id="dom-元素捕获" tabindex="-1"><a class="header-anchor" href="#dom-元素捕获" aria-hidden="true">#</a> DOM 元素捕获</h3>
<p>最简单的，我们来捕获一个<code v-pre>&lt;div&gt;</code>元素，然后生成一个<code v-pre>&lt;div&gt;</code>元素。</p>
<p>例如我们可以将以下这样的 DOM 进行捕获：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span><span class="token punctuation">></span></span>123<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>456<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">></span></span>789<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>捕获后我们或许可以得到这样的一个对象：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>thisDiv <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">dom</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"dom"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ele</span><span class="token operator">:</span> <span class="token string">"div"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">nodeIndex</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"dom"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">ele</span><span class="token operator">:</span> <span class="token string">"a"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">nodeIndex</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
        <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"text"</span><span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token string">"123"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"dom"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">ele</span><span class="token operator">:</span> <span class="token string">"p"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">nodeIndex</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"dom"</span><span class="token punctuation">,</span>
            <span class="token literal-property property">ele</span><span class="token operator">:</span> <span class="token string">"span"</span><span class="token punctuation">,</span>
            <span class="token literal-property property">nodeIndex</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
            <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"text"</span><span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token string">"456"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"text"</span><span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token string">"789"</span> <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原本就是一个<code v-pre>&lt;div&gt;</code>，经过 AST 生成一个对象，最终还是生成一个<code v-pre>&lt;div&gt;</code>，这是多余的步骤吗？不是的，在这个过程中我们可以实现一些功能：</p>
<ol>
<li>排除无效 DOM 元素，并在构建过程可进行报错。</li>
<li>使用自定义组件的时候，可匹配出来。</li>
<li>可方便地实现数据绑定、事件绑定等功能。</li>
<li>为虚拟<code v-pre>DOM Diff</code>过程打下铺垫。</li>
</ol>
<h3 id="数据绑定捕获" tabindex="-1"><a class="header-anchor" href="#数据绑定捕获" aria-hidden="true">#</a> 数据绑定捕获</h3>
<p>这里我们拿来做例子的是，在 Angular 和 Vue 里面都有，是双大括号的数据绑定<code v-pre>{{ data }}</code>的语法。</p>
<p>在前面 DOM 元素捕获的基础上，我们来添加数据绑定：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>{{ data }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这么一个简单的数据，我们可以获得这样一个对象：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>thisDiv <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">dom</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"dom"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ele</span><span class="token operator">:</span> <span class="token string">"div"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">nodeIndex</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"text"</span><span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token string">"123"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">binding</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"dom"</span><span class="token punctuation">,</span> <span class="token literal-property property">nodeIndex</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">valueName</span><span class="token operator">:</span> <span class="token string">"data"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们在生成一个 DOM 的时候，同时添加对<code v-pre>data</code>的监听，数据更新时我们会找到对应的<code v-pre>nodeIndex</code>，更新值：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 假设这是一个生成DOM的过程，包括数据绑定和</span>
<span class="token keyword">function</span> <span class="token function">generateDOM</span><span class="token punctuation">(</span><span class="token parameter">astObject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> dom<span class="token punctuation">,</span> binding <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span> <span class="token operator">=</span> astObject<span class="token punctuation">;</span>
  <span class="token comment">// 生成DOM，这里假装当前节点是baseDom</span>
  baseDom<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> <span class="token function">getDOMString</span><span class="token punctuation">(</span>dom<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 对于数据绑定的，来进行监听更新吧</span>
  baseDom<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"data:change"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 寻找匹配的数据绑定</span>
    <span class="token keyword">const</span> obj <span class="token operator">=</span> binding<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> x<span class="token punctuation">.</span>valueName <span class="token operator">==</span> name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 若找到值绑定的对应节点，则更新其值。</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      baseDom<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">[data-node-index="</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>obj<span class="token punctuation">.</span>nodeIndex<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"]</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 获取DOM字符串，这里简单拼成字符串</span>
<span class="token keyword">function</span> <span class="token function">getDOMString</span><span class="token punctuation">(</span><span class="token parameter">domObj</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 无效对象返回''</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>domObj<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token string">""</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> children <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> nodeIndex<span class="token punctuation">,</span> ele<span class="token punctuation">,</span> value <span class="token punctuation">}</span> <span class="token operator">=</span> domObj<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>type <span class="token operator">==</span> <span class="token string">"dom"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 若有子对象，递归返回生成的字符串拼接</span>
    <span class="token keyword">const</span> childString <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
    children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      childString <span class="token operator">+=</span> <span class="token function">getDOMString</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// dom对象，拼接生成对象字符串</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ele<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> data-node-index="</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>nodeIndex<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>childString<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ele<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>type <span class="token operator">==</span> <span class="token string">"text"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 若为textNode，返回text的值</span>
    <span class="token keyword">return</span> value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来对上面的代码进行说明。</p>
<p><strong>1. 根据节点信息生成对应的<code v-pre>HTML string</code>，也即<code v-pre>getDOMString()</code>方法。</strong></p>
<p>这里我们只是简单完成了一种实现方式，根据节点生成 DOM 也有其他方式，例如使用<code v-pre>.createElement()</code>、<code v-pre>.appendChild()</code>、<code v-pre>textContent</code>等等。</p>
<p>我们称通过生成<code v-pre>HTML string</code>的方式为<strong>字符串模版</strong>，同时我们将通过<code v-pre>createElement()/appendChild()</code>的方式生成 DOM 称为<strong>节点模版</strong>。</p>
<p><strong>2. 通过监听数据变更，同时根据绑定的数值获取对应节点，并进行局部更新。</strong></p>
<p>在使用字符串模版的时候，我们将<code v-pre>nodeIndex</code>绑定在元素属性上，主要是用于数据更新时追寻节点进行内容更新。
在使用节点模版的时候，我们可在创建节点的时候，将该节点保存下来，直接用于数据更新。</p>
<p>当然，即使在字符串模版，我们也可以遍历一遍<code v-pre>binding</code>来获取所有绑定数据的节点并保存，这样就不用每次数据更新事件触发的时候重新进行获取，毕竟 DOM 节点的匹配也是会有一定的消耗的。</p>
<p><strong>3. 无论是数据还是事件、属性、样式等的绑定，都可以通过相似的方法进行。</strong></p>
<p>虽然这里我们只介绍了数据的绑定，但其实事件的绑定、属性和样式的绑定都可以用相似的方式进行，当然事件监听和事件的触发都是我们自己定义的，对于传递的内容都可以用自己想要的方式来传。</p>
<h2 id="ast-生成模版" tabindex="-1"><a class="header-anchor" href="#ast-生成模版" aria-hidden="true">#</a> AST 生成模版</h2>
<h3 id="生成模版的方法" tabindex="-1"><a class="header-anchor" href="#生成模版的方法" aria-hidden="true">#</a> 生成模版的方法</h3>
<p>我们在捕获得到一个 AST 树结构后，会将其生成对应的 DOM。一般来说我们有这些方式：</p>
<ol>
<li><strong>字符串模版：使用拼接的方式生成 DOM 字符串，直接通过<code v-pre>innderHTML()</code>插入页面。</strong></li>
<li><strong>节点模版：使用<code v-pre>createElement()/appendChild()/textContent</code>等方法，动态地插入 DOM 节点，根节点使用<code v-pre>appendChild()</code>插入页面。</strong></li>
<li><strong>混合模版：使用<code v-pre>createElement()/appendChild()/textContent</code>等方法动态地插入 DOM 节点，但是根节点使用<code v-pre>innderHTML()</code>插入页面。</strong></li>
</ol>
<p>这几个有什么区别呢？</p>
<p>刚开始的时候，我们每次更新页面数据和状态，通常通过<code v-pre>innerHTML</code>方法来用新的<code v-pre>HTML String</code>替换旧的，这种方法写起来很简单，无非是将各种节点使用字符串的方式拼接起来而已。但是如果我们更新的节点范围比较大，这时候我们需要替换掉很大一片的<code v-pre>HTML String</code>。</p>
<p>对于浏览器，这样的一次<code v-pre>HTML String</code>替换并不只是更新一些字符串那么简单。</p>
<h3 id="浏览器的渲染机制" tabindex="-1"><a class="header-anchor" href="#浏览器的渲染机制" aria-hidden="true">#</a> 浏览器的渲染机制</h3>
<p>浏览器的一次页面渲染其实开销并不小，首先浏览器会解析三种文件：</p>
<ul>
<li>解析<code v-pre>HTML/SVG/XHTML</code>，会生成一个<code v-pre>DOM结构树</code></li>
<li>解析<code v-pre>CSS</code>，会生成一个<code v-pre>CSS规则树</code></li>
<li>解析<code v-pre>JS</code>，可通过<code v-pre>DOM API</code>和<code v-pre>CSS API</code>来操作<code v-pre>DOM结构树</code>和<code v-pre>CSS规则树</code></li>
</ul>
<p><code v-pre>CSS规则树</code>与<code v-pre>DOM结构树</code>结合，最终生成一个<code v-pre>Render树</code>（即最终呈现的页面，例如其中会移除<code v-pre>DOM结构树</code>中匹配到<code v-pre>CSS</code>里面<code v-pre>display:none;</code>的 DOM 节点）。其中，<code v-pre>CSS</code>匹配 DOM 结构的过程是很复杂的，曾经在机器配置不高的日子也会出现过性能问题。</p>
<p>**一般来说浏览器绘制页面的过程是：1.计算<code v-pre>CSS规则树</code> =&gt; 2.生成<code v-pre>Render树</code> =&gt; 3.计算各个节点的<code v-pre>大小</code>/<code v-pre>position</code>/<code v-pre>z-index</code> =&gt; 4.绘制。**其中计算的环节也是消耗较大的地方。</p>
<p>我们使用<code v-pre>DOM API</code>和<code v-pre>CSS API</code>的时候，通常会触发浏览器的两种操作：<code v-pre>Repaint</code>和<code v-pre>Reflow</code>。</p>
<p>**Repaint：页面部分重画，通常不涉及尺寸的改变，常见于颜色的变化。**这时候一般只触发绘制过程的第 4 个步骤。</p>
<p>**Reflow：意味着节点需要重新计算和绘制，常见于尺寸的改变。**这时候会触发 3 和 4 两个步骤。</p>
<p>所以我们在写页面的时候会注意一些问题，例如不要一条一条地修改 DOM 的样式（会触发多次的计算或绘制），在写动画的时候多使用<code v-pre>fixed</code>/<code v-pre>absolute</code>等（<code v-pre>Reflow</code>的范围小），等等。</p>
<p>回到话题，如果我们直接每次更新页面数据和状态，都使用<code v-pre>innerHTML</code>的方式，无疑会增加浏览器的负担，所以需要跟踪节点进行局部跟新。当然，<code v-pre>innerHTML</code>也有它的优势，那就是我们可以使用一个<code v-pre>innerHTML</code>替代很多很多的<code v-pre>createElement()/appendChild()/textContent</code>方法，这在我们较少使用数据绑定和更新的情况下高效得多。</p>
<h1 id="模版数据更新" tabindex="-1"><a class="header-anchor" href="#模版数据更新" aria-hidden="true">#</a> 模版数据更新</h1>
<p>我们讲了模版生成 AST，以及通过 AST 生成 DOM、并进行数据绑定的过程，接下来说明下模版数据更新的过程。</p>
<h3 id="数据更新监听" tabindex="-1"><a class="header-anchor" href="#数据更新监听" aria-hidden="true">#</a> 数据更新监听</h3>
<p>前面将数据绑定的时候，也讲了使用<strong>事件监听</strong>的方式监听数据更新。这里接着介绍一些其他的方式。</p>
<p><strong>脏检测：在 Angular 中，并不直接监听数据的变动，而是监听常见的事件如用户交互（点击、输入等）、定时器、生命周期等。在每次事件触发完毕后，计算数据的新值和旧值是否有差异，若有差异则更新页面，并触发下一次的脏检测，直到没有差异或是次数达到设定阈值。</strong></p>
<p>脏检测是 Angular 的一大特色。由于事件触发的时候，并不能知道哪些数据会有变化，所以会进行大面积数据的新旧值 Diff，这也毫无疑问会导致一些性能问题。在 Angular2 版本之后，由于使用了<code v-pre>zone.js</code>对异步任务进行跟踪，把这个计算放进 worker，完了更新回主线程，是个类似多线程的设计，也提升了性能。</p>
<p>同时，在 Angular2 中应用的组织类似 DOM，也是树结构的，脏检查会从根组件开始，自上而下对树上的所有子组件进行检查。相比 Angular1 中的带有环的结构，这样的单向数据流效率更高，而且容易预测。</p>
<p><strong>Getter/Setter：在 Vue 中，主要是使用<code v-pre>Proxy</code>的方式，在相关的数据写入时进行模版更新。</strong></p>
<p><strong>手动 Function：在 React 中，通过手动调用<code v-pre>set()</code>的方式写入数据来更新模版。</strong></p>
<p>使用<code v-pre>Proxy</code>或者是<code v-pre>set()</code>的时候，我们可以通过<code v-pre>event emit</code>或是<code v-pre>callback</code>回调的方法，来触发数据的计算以及模版的更新。</p>
<h3 id="数据更新-diff" tabindex="-1"><a class="header-anchor" href="#数据更新-diff" aria-hidden="true">#</a> 数据更新 Diff</h3>
<p>说到数据更新的 Diff，更多的则是<code v-pre>Diff + 更新模板</code>这样一个过程。</p>
<p>在这个过程中，最突出的也就是虚拟 DOM，它解决了常见的局部数据更新的问题，例如数组中值位置的调换、部分更新。一般来说计算过程如下：</p>
<p><strong>1. 用 JS 对象模拟 DOM 树。</strong></p>
<p>不知道大家仔细研究过 DOM 节点对象没，一个真正的 DOM 元素非常庞大，拥有很多的属性值。而其中很多的属性对于计算过程来说是不需要的，所以我们的第一步就是简化 DOM 对象。
我们用一个<code v-pre>JavaScript</code>对象结构表示 DOM 树的结构，然后用这个树构建一个真正的 DOM 树。</p>
<p><strong>2. 比较两棵虚拟 DOM 树的差异。</strong></p>
<p>当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异。通常来说这样的差异需要记录：</p>
<ul>
<li>需要替换掉原来的节点</li>
<li>移动、删除、新增子节点</li>
<li>修改了节点的属性</li>
<li>对于文本节点的文本内容改变</li>
</ul>
<p>经过差异对比之后，我们能获得一组差异记录，接下里我们需要使用它。</p>
<p><strong>3. 把差异应用到真正的 DOM 树上。</strong></p>
<p>对差异记录要应用到真正的 DOM 树上，例如节点的替换、移动、删除，文本内容的改变等。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>总的来说，一个前端模板引擎大致分为<code v-pre>模板生成AST =&gt; AST生成模板 =&gt; 数据/事件/属性绑定的监听 =&gt; 数据变更Diff =&gt; 局部更新模板</code>这些过程。当然上面的介绍以个人理解为主，部分源码验证为辅。<br>
还是那句话，多思考多总结，不管结论是否正确，结果是否所期望，过程中的收获也会让人成长。</p>
</div></template>


