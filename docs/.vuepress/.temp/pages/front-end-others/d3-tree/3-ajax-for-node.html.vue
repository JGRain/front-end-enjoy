<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本文介绍动态获取节点数据，并添加子节点的过程。</p>
<!--more-->
<h1 id="动态获取子节点数据" tabindex="-1"><a class="header-anchor" href="#动态获取子节点数据" aria-hidden="true">#</a> 动态获取子节点数据</h1>
<h2 id="拆分模块" tabindex="-1"><a class="header-anchor" href="#拆分模块" aria-hidden="true">#</a> 拆分模块</h2>
<p>在后面越来越多的功能增加之前，我们要把代码进行下整理，模块拆分首先就是一个整理逻辑的过程。</p>
<p>首先，我们的 Demo 大概可以拆分成这些模块：</p>
<ol>
<li>初始化 D3 基本能力（设置宽高等）。</li>
<li>数据初始化绑定。</li>
<li>数据更新绑定。</li>
<li>node 交互和绘制。</li>
<li>link 交互和绘制。</li>
<li>单击节点事件处理。</li>
<li>双击获取子节点事件处理（本节新增）。</li>
</ol>
<p>由于代码篇幅稍微多一些，这里调整后一致在文末体现哈。</p>
<h2 id="tree-node" tabindex="-1"><a class="header-anchor" href="#tree-node" aria-hidden="true">#</a> Tree node</h2>
<p><strong>d3.tree(root)</strong>
使用默认的设置构建一个树图布局生成器。</p>
<p>根据指定的根节点代表的 hierarchy 数据生成一个树状布局数据，每个节点包含以下属性:</p>
<ul>
<li>node.x：节点的 x 坐标</li>
<li>node.y：节点的 y 坐标</li>
</ul>
<p>为了动态获取时，能有效生成子节点，我们来看看一个 tree node 里面包含了哪些属性：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513514218(1).png" alt="image"></p>
<p>由于<code v-pre>d3.tree()</code>能自动计算生成 x 和 y 位置，而 id、x0、y0 等则是批量处理生成，故我们主要需要添加的属性有：</p>
<ul>
<li>depth：该节点的层级数，主要用于 y 的计算，避免重叠</li>
<li>parent：保存父节点的信息，用于绘制 link 关系</li>
<li>children：保存子节点的信息</li>
</ul>
<p>这里分析 tree node 的信息，用于后面动态获取节点信息，手动添加子节点和更新图表。</p>
<h2 id="绑定双击事件" tabindex="-1"><a class="header-anchor" href="#绑定双击事件" aria-hidden="true">#</a> 绑定双击事件</h2>
<p>因为我们上面使用了单击来展开和收起子节点，因此这里我们将使用双击来获取子节点。我们在节点 enter 时增加的 click 事件，这里我们再添加个 dbclick 的事件绑定：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加enter操作，添加类名为node的group元素</span>
<span class="token keyword">var</span> nodeEnter <span class="token operator">=</span> node
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// ...其他操作</span>
  <span class="token comment">// 给每个新加的节点绑定click事件</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> click<span class="token punctuation">)</span>
  <span class="token comment">// 给每个新加的节点绑定dbclick事件</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"dblclick"</span><span class="token punctuation">,</span> dblclick<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们需要添加 dblclick 函数，主要处理逻辑包括：</p>
<ol>
<li>检查该节点是否已经请求过，已请求过则忽略。</li>
<li>随机请求<code v-pre>1.json</code> - <code v-pre>5.json</code>随机获取数据。</li>
<li>获取到数据后，手动给节点添加子节点，同时子节点设置 parent 为该节点。</li>
<li>更新图表。</li>
</ol>
<p>我们将请求到的数据存在节点的<code v-pre>data</code>属性中，同时根据上面 tree node 节点的分析，我们需要手动给子节点添加对应的属性，包括<code v-pre>name</code>、<code v-pre>depth</code>、<code v-pre>parent</code>等。</p>
<p>我们能得到这样的 dblclick 函数：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 将获取到的节点，添加进data对象中，同时若已获取过不再获取</span>
<span class="token keyword">function</span> <span class="token function">dblclick</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 若无d.data.children，则视为未获取</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>data <span class="token operator">&amp;&amp;</span> d<span class="token punctuation">.</span>data<span class="token punctuation">.</span>children<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这里模拟请求，1.json - 5.json 随机获取数据</span>
    <span class="token keyword">var</span> randomNum <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">5</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    d3<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span>randomNum <span class="token operator">+</span> <span class="token string">".json"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token keyword">throw</span> error<span class="token punctuation">;</span>
      <span class="token comment">// 给子节点绑定父节点</span>
      <span class="token keyword">var</span> children <span class="token operator">=</span> data<span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">name</span><span class="token operator">:</span> x<span class="token punctuation">.</span>name<span class="token punctuation">,</span>
          <span class="token literal-property property">parent</span><span class="token operator">:</span> d<span class="token punctuation">,</span>
          <span class="token literal-property property">depth</span><span class="token operator">:</span> d<span class="token punctuation">.</span>depth <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span>
          <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token operator">...</span>x
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 将子节点数据绑定在d节点上</span>
      <span class="token comment">// 若子节点为空，则不执行</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>children<span class="token punctuation">.</span>length<span class="token punctuation">)</span> d<span class="token punctuation">.</span>children <span class="token operator">=</span> children<span class="token punctuation">;</span>
      <span class="token comment">// 同时也绑到data上</span>
      d<span class="token punctuation">.</span>data<span class="token punctuation">.</span>children <span class="token operator">=</span> children<span class="token punctuation">;</span>
      <span class="token function">updateChart</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面为什么我们要使用<code v-pre>data.children</code>来判断是否已经加载过呢？这是因为 d3 中 node 的 children 不接受空数组，只能为非空数组或是<code v-pre>null</code>。而<code v-pre>null</code>可能有两种情况：收起、无子节点。同时为了方便后续数据处理，我们使用<code v-pre>data</code>属性来保存一切获取来的信息数据。</p>
<p>准备就绪，我们将初始的数据设置为首层节点数据：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> treeData <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Top Level"</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="节点状态定义" tabindex="-1"><a class="header-anchor" href="#节点状态定义" aria-hidden="true">#</a> 节点状态定义</h2>
<p>因为加入 Ajax 获取信息后，节点的状态将会增加，我们给节点添加一些规则：</p>
<ol>
<li>当未获取子节点信息时，将节点填充灰色，来表示待获取。</li>
<li>当节点拥有子节点、并处于收起状态时，将节点填充浅蓝色，表示拥有子节点。</li>
<li>当节点查无子节点，或是已展开，均无填充状态。</li>
</ol>
<p>其实只增加了一种状态：是否已获取数据。我们会需要在节点 enter 以及 update 的时候需要增加这个状态。同上，我们使用<code v-pre>data.children</code>来判断是否已经加载过：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>node
  <span class="token comment">// ...其他操作</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> d<span class="token punctuation">.</span>_children <span class="token operator">?</span> <span class="token string">"lightsteelblue"</span> <span class="token operator">:</span> d<span class="token punctuation">.</span>data<span class="token punctuation">.</span>children <span class="token operator">?</span> <span class="token string">"#fff"</span> <span class="token operator">:</span> <span class="token string">"#ccc"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="双击单击的冲突解决" tabindex="-1"><a class="header-anchor" href="#双击单击的冲突解决" aria-hidden="true">#</a> 双击单击的冲突解决</h2>
<p>我们在使用中会发现，双击事件同时会触发两次的单击时间，这其实是不合理的，我们通过添加定时器来解决：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 当点击时，切换children，同时用_children来保存原子节点信息</span>
<span class="token keyword">function</span> <span class="token function">click</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>d<span class="token punctuation">.</span>_clickid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 若在200ms里面点击第二次，则不做任何操作，清空定时器</span>
    <span class="token function">clearTimeout</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>_clickid<span class="token punctuation">)</span><span class="token punctuation">;</span>
    d<span class="token punctuation">.</span>_clickid <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 首次点击，添加定时器，200ms后进行toggle</span>
    d<span class="token punctuation">.</span>_clickid <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>d<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        d<span class="token punctuation">.</span>_children <span class="token operator">=</span> d<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
        d<span class="token punctuation">.</span>children <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        d<span class="token punctuation">.</span>children <span class="token operator">=</span> d<span class="token punctuation">.</span>_children<span class="token punctuation">;</span>
        d<span class="token punctuation">.</span>_children <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token function">updateChart</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
      d<span class="token punctuation">.</span>_clickid <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终我们效果将会如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513505937(1).png" alt="image"></p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们添加了节点动态获取子节点的功能，同时给节点加上已读状态，同时处理好单击双击的事件冲突。<br>
我们在完成基本需求的同时，也需要主动改善用户体验，或是不合理的地方要主动提出来，因为说好的要把最棒的一面呈现世间的呢。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/3-ajax-for-node" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://d3.godbasin.com/3-ajax-for-node/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


