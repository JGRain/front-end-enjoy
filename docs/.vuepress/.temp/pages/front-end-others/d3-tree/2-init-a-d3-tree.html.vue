<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本文介绍基本场景，以及选择 demo 的过程。</p>
<!--more-->
<h1 id="基本场景" tabindex="-1"><a class="header-anchor" href="#基本场景" aria-hidden="true">#</a> 基本场景</h1>
<h2 id="tree-图与服务" tabindex="-1"><a class="header-anchor" href="#tree-图与服务" aria-hidden="true">#</a> Tree 图与服务</h2>
<p>首先我们来看个简单的图：
<img src="https://about-position-1255459943.file.myqcloud.com/1513409805(1).png" alt="image"></p>
<p>没错，这就是个简单的树状图。 本骚年此次要解决的问题包括：</p>
<ol>
<li>每一层的子节点为动态请求加载。</li>
<li>子节点可以收起和展开。</li>
<li>服务的层级最多为 15 层，每层数量最多或许在 20 左右，需要考虑文字是否重叠。</li>
<li>支持鼠标滚动缩放 + 鼠标拖动。</li>
<li>节点根据服务类型展示为不同的样式。</li>
<li>鼠标放置在节点上，需要展示更多的内容。</li>
<li>连接线需要展示该链路的一些状态和信息（容量大小等）。</li>
<li>连接线根据链路当前状态，需要展示为不同颜色。</li>
</ol>
<p>以上等等。其实大致数据内容大家也大概能猜到了，主要展示服务的调用关系，以及状态信息、容灾能力等，方便整体的管理和维护。</p>
<h2 id="选择插件库" tabindex="-1"><a class="header-anchor" href="#选择插件库" aria-hidden="true">#</a> 选择插件库</h2>
<p>本骚年首先翻了翻 Echarts（毕竟配置化的用起来简单），很可惜 Echarts 翻来翻去都木有树状图（别翻了，本骚年完成了这个开发工作的时候，它突然又提供支持了）。</p>
<p>D3 之前也有稍微看过，对比 Echarts 的使用简单，它似乎更适合个性化或者说不是那么通用的场景（对，就是本骚年的这次需求了）。</p>
<p>关于 D3 和 Echarts 的对比，网上有人说（感觉挺有道理的）：</p>
<ul>
<li>D3 属于是基础的绘图库(基于 canvas 的, 所以可以说完全不做兼容考虑)，封装的功能都是一些基础图形图像和动画这类的，但是功能异常强大。</li>
<li>Echarts 属于应用型(或者业务型)的图表库， 期望的是： 几乎不需要写绘图过程代码就能生成漂亮的图表。</li>
</ul>
<p>决定好要使用 D3 之后，看了下，D3 最新版本为 v4，而网上很多的 demo 都是基于 v3 的，但是作为一个对自己有要求的程序员，怎么可以容忍使用旧版本呢！</p>
<p>其实真相是这样的：
<img src="https://about-position-1255459943.file.myqcloud.com/1513412297(1).png" alt="image"></p>
<p>Sign~</p>
<p>而 v4 版本相对 v3 版本的变更，其实很关键的是模块化，更多的可以参考<a href="https://github.com/xswei/d3js_doc/tree/master/ReleaseNotes" target="_blank" rel="noopener noreferrer">D3 4.0 做了哪些改进<ExternalLinkIcon/></a>。</p>
<h2 id="寻找-demo" tabindex="-1"><a class="header-anchor" href="#寻找-demo" aria-hidden="true">#</a> 寻找 Demo</h2>
<p>来，我们再从网上找个现有的 Demo 下手吧，就它了：<a href="https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd" target="_blank" rel="noopener noreferrer">Collapsible tree diagram in v4<ExternalLinkIcon/></a>。这里还有个 v3 版本的，大家可以对比着看一下：<a href="http://bl.ocks.org/d3noob/8375092" target="_blank" rel="noopener noreferrer">Interactive d3.js tree diagram<ExternalLinkIcon/></a>。</p>
<p>其实 v4 和 v3 版本，不一致的地方比较关键的是<code v-pre>link</code>连接线的绘制，<code v-pre>diagonal</code>函数：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// v3</span>
<span class="token keyword">var</span> diagonal <span class="token operator">=</span> d3<span class="token punctuation">.</span>svg<span class="token punctuation">.</span><span class="token function">diagonal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">projection</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>d<span class="token punctuation">.</span>y<span class="token punctuation">,</span> d<span class="token punctuation">.</span>x<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// v4</span>
<span class="token keyword">function</span> <span class="token function">diagonal</span><span class="token punctuation">(</span><span class="token parameter">s<span class="token punctuation">,</span> d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  path <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">M </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
          C </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>y <span class="token operator">+</span> d<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,
            </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>y <span class="token operator">+</span> d<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,
            </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> path<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们看看<a href="https://github.com/d3/d3/wiki/SVG-%E5%BD%A2%E7%8A%B6#diagonal" target="_blank" rel="noopener noreferrer">官方文档 v3<ExternalLinkIcon/></a>的描述。</p>
<p><code v-pre>d3.svg.diagonal()</code>：使用默认的配置构造一个对角线生成器；返回值可以用来当做函数使用来生成三次贝塞尔曲线数据，该曲线的若干条切线可以保证节点连接处会有平滑的介入效果。</p>
<p>其实这里我们主要给连接线绘制路径，D3 里面主要使用了<a href="https://www.zhihu.com/question/29565629" target="_blank" rel="noopener noreferrer">贝塞尔曲线<ExternalLinkIcon/></a>。在 v3 版本中，D3 提供了生成该曲线的方法，而在 v4 版本中，我们需要自己构造这样的曲线。</p>
<p>这里涉及到的并不是 D3 独有的，而是<code v-pre>SVG-&lt;path&gt;</code>的特性，<code v-pre>&lt;path&gt;</code>在上一节也简单说过，大家可以补充看看<a href="https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths" target="_blank" rel="noopener noreferrer">SVG 路径 | MDN<ExternalLinkIcon/></a>，里面讲到了直线命令和曲线命令。</p>
<h1 id="解读-demo" tabindex="-1"><a class="header-anchor" href="#解读-demo" aria-hidden="true">#</a> 解读 Demo</h1>
<p>我们先结合上一节大致讲到的 D3 基础，来解读下我们的 Demo。</p>
<h2 id="整体逻辑" tabindex="-1"><a class="header-anchor" href="#整体逻辑" aria-hidden="true">#</a> 整体逻辑</h2>
<p>我们的 Demo 实现了这样的功能：</p>
<ol>
<li>定义 svg 根元素，设置基本的属性（宽高等）。</li>
<li>定义基本的 treemap。</li>
<li>将数据转换成需要的格式。</li>
<li>将数据绑定 treemap。</li>
<li>定义子节点的选择集，以及过渡动画。</li>
<li>添加 toggle 处理，并绑定到节点。</li>
</ol>
<h2 id="代码说明" tabindex="-1"><a class="header-anchor" href="#代码说明" aria-hidden="true">#</a> 代码说明</h2>
<p>我们结合代码来看看，其实 Demo 里面原有英文的说明，这里本骚年可能更多的是翻译的作用吧：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 嗯，这是最初的数据。</span>
<span class="token keyword">var</span> treeData <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Top Level"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Level 2: A"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Son of A"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Daughter of A"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Level 2: B"</span> <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// 设置图表的宽高和Margin</span>
<span class="token keyword">var</span> margin <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">top</span><span class="token operator">:</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token literal-property property">right</span><span class="token operator">:</span> <span class="token number">90</span><span class="token punctuation">,</span> <span class="token literal-property property">bottom</span><span class="token operator">:</span> <span class="token number">30</span><span class="token punctuation">,</span> <span class="token literal-property property">left</span><span class="token operator">:</span> <span class="token number">90</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  width <span class="token operator">=</span> <span class="token number">960</span> <span class="token operator">-</span> margin<span class="token punctuation">.</span>left <span class="token operator">-</span> margin<span class="token punctuation">.</span>right<span class="token punctuation">,</span>
  height <span class="token operator">=</span> <span class="token number">500</span> <span class="token operator">-</span> margin<span class="token punctuation">.</span>top <span class="token operator">-</span> margin<span class="token punctuation">.</span>bottom<span class="token punctuation">;</span>

<span class="token keyword">var</span> svg <span class="token operator">=</span> d3
  <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"body"</span><span class="token punctuation">)</span>
  <span class="token comment">// 在页面的body里添加svg对象</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"svg"</span><span class="token punctuation">)</span>
  <span class="token comment">// 设置svg宽高</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"width"</span><span class="token punctuation">,</span> width <span class="token operator">+</span> margin<span class="token punctuation">.</span>right <span class="token operator">+</span> margin<span class="token punctuation">.</span>left<span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"height"</span><span class="token punctuation">,</span> height <span class="token operator">+</span> margin<span class="token punctuation">.</span>top <span class="token operator">+</span> margin<span class="token punctuation">.</span>bottom<span class="token punctuation">)</span>
  <span class="token comment">// 在svg里添加group元素</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"g"</span><span class="token punctuation">)</span>
  <span class="token comment">// 将group放置在左上方</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"transform"</span><span class="token punctuation">,</span> <span class="token string">"translate("</span> <span class="token operator">+</span> margin<span class="token punctuation">.</span>left <span class="token operator">+</span> <span class="token string">","</span> <span class="token operator">+</span> margin<span class="token punctuation">.</span>top <span class="token operator">+</span> <span class="token string">")"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span>
  duration <span class="token operator">=</span> <span class="token number">750</span><span class="token punctuation">,</span>
  root<span class="token punctuation">;</span>

<span class="token comment">// 定义Tree层级，并设置宽高</span>
<span class="token keyword">var</span> treemap <span class="token operator">=</span> d3<span class="token punctuation">.</span><span class="token function">tree</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">[</span>height<span class="token punctuation">,</span> width<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 计算父节点、字节点、高度和深度（parent, children, height, depth）</span>
root <span class="token operator">=</span> d3<span class="token punctuation">.</span><span class="token function">hierarchy</span><span class="token punctuation">(</span>treeData<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> d<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 设置第一个元素的初始位置</span>
root<span class="token punctuation">.</span>x0 <span class="token operator">=</span> height <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">;</span>
root<span class="token punctuation">.</span>y0 <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token comment">// 第二层以上元素收起</span>
root<span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>collapse<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 更新节点状态</span>
<span class="token function">update</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// collapse方法，用于切换子节点的展开和收起状态</span>
<span class="token keyword">function</span> <span class="token function">collapse</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>d<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    d<span class="token punctuation">.</span>_children <span class="token operator">=</span> d<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
    d<span class="token punctuation">.</span>_children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>collapse<span class="token punctuation">)</span><span class="token punctuation">;</span>
    d<span class="token punctuation">.</span>children <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token parameter">source</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 设置节点的x、y位置信息</span>
  <span class="token keyword">var</span> treeData <span class="token operator">=</span> <span class="token function">treemap</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 计算新的Tree层级</span>
  <span class="token keyword">var</span> nodes <span class="token operator">=</span> treeData<span class="token punctuation">.</span><span class="token function">descendants</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    links <span class="token operator">=</span> treeData<span class="token punctuation">.</span><span class="token function">descendants</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 设置每个同级节点间的y间距为180</span>
  nodes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    d<span class="token punctuation">.</span>y <span class="token operator">=</span> d<span class="token punctuation">.</span>depth <span class="token operator">*</span> <span class="token number">180</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// ****************** 节点部分操作 ***************************</span>

  <span class="token comment">// 给节点添加id，用于选择集索引</span>
  <span class="token keyword">var</span> node <span class="token operator">=</span> svg<span class="token punctuation">.</span><span class="token function">selectAll</span><span class="token punctuation">(</span><span class="token string">"g.node"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span>nodes<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> d<span class="token punctuation">.</span>id <span class="token operator">||</span> <span class="token punctuation">(</span>d<span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token operator">++</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 添加enter操作，添加类名为node的group元素</span>
  <span class="token keyword">var</span> nodeEnter <span class="token operator">=</span> node
    <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"g"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"class"</span><span class="token punctuation">,</span> <span class="token string">"node"</span><span class="token punctuation">)</span>
    <span class="token comment">// 默认位置为当前父节点的位置</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"transform"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token string">"translate("</span> <span class="token operator">+</span> source<span class="token punctuation">.</span>y0 <span class="token operator">+</span> <span class="token string">","</span> <span class="token operator">+</span> source<span class="token punctuation">.</span>x0 <span class="token operator">+</span> <span class="token string">")"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token comment">// 给每个新加的节点绑定click事件</span>
    <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> click<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 给每个新加的group元素添加cycle元素</span>
  nodeEnter
    <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"circle"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"class"</span><span class="token punctuation">,</span> <span class="token string">"node"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"r"</span><span class="token punctuation">,</span> <span class="token number">1e-6</span><span class="token punctuation">)</span>
    <span class="token comment">// 如果元素有子节点，且为收起状态，则填充浅蓝色</span>
    <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> d<span class="token punctuation">.</span>_children <span class="token operator">?</span> <span class="token string">"lightsteelblue"</span> <span class="token operator">:</span> <span class="token string">"#fff"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 给每个新加的group元素添加文字说明</span>
  nodeEnter
    <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"text"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"dy"</span><span class="token punctuation">,</span> <span class="token string">".35em"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"x"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> d<span class="token punctuation">.</span>children <span class="token operator">||</span> d<span class="token punctuation">.</span>_children <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">13</span> <span class="token operator">:</span> <span class="token number">13</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"text-anchor"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> d<span class="token punctuation">.</span>children <span class="token operator">||</span> d<span class="token punctuation">.</span>_children <span class="token operator">?</span> <span class="token string">"end"</span> <span class="token operator">:</span> <span class="token string">"start"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> d<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 获取update集</span>
  <span class="token keyword">var</span> nodeUpdate <span class="token operator">=</span> nodeEnter<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 设置节点的位置变化，添加过渡动画效果</span>
  nodeUpdate
    <span class="token punctuation">.</span><span class="token function">transition</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">duration</span><span class="token punctuation">(</span>duration<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"transform"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token string">"translate("</span> <span class="token operator">+</span> d<span class="token punctuation">.</span>y <span class="token operator">+</span> <span class="token string">","</span> <span class="token operator">+</span> d<span class="token punctuation">.</span>x <span class="token operator">+</span> <span class="token string">")"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 更新节点的属性和样式</span>
  nodeUpdate
    <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"circle.node"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"r"</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> d<span class="token punctuation">.</span>_children <span class="token operator">?</span> <span class="token string">"lightsteelblue"</span> <span class="token operator">:</span> <span class="token string">"#fff"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"cursor"</span><span class="token punctuation">,</span> <span class="token string">"pointer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 获取exit操作</span>
  <span class="token keyword">var</span> nodeExit <span class="token operator">=</span> node
    <span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// 添加过渡动画</span>
    <span class="token punctuation">.</span><span class="token function">transition</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">duration</span><span class="token punctuation">(</span>duration<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"transform"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token string">"translate("</span> <span class="token operator">+</span> source<span class="token punctuation">.</span>y <span class="token operator">+</span> <span class="token string">","</span> <span class="token operator">+</span> source<span class="token punctuation">.</span>x <span class="token operator">+</span> <span class="token string">")"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token comment">// 移除元素</span>
    <span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// exit集中节点的cycle元素尺寸变为0</span>
  nodeExit<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"circle"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"r"</span><span class="token punctuation">,</span> <span class="token number">1e-6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// exit集中节点的text元素可见度降为0</span>
  nodeExit<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"text"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill-opacity"</span><span class="token punctuation">,</span> <span class="token number">1e-6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// ****************** 连接线部分操作 ***************************</span>

  <span class="token comment">// 更新数据</span>
  <span class="token keyword">var</span> link <span class="token operator">=</span> svg<span class="token punctuation">.</span><span class="token function">selectAll</span><span class="token punctuation">(</span><span class="token string">"path.link"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span>links<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> d<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 添加enter操作，添加类名为link的path元素</span>
  <span class="token keyword">var</span> linkEnter <span class="token operator">=</span> link
    <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">,</span> <span class="token string">"g"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"class"</span><span class="token punctuation">,</span> <span class="token string">"link"</span><span class="token punctuation">)</span>
    <span class="token comment">// 默认位置为当前父节点的位置</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"d"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> o <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">x</span><span class="token operator">:</span> source<span class="token punctuation">.</span>x0<span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> source<span class="token punctuation">.</span>y0 <span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token function">diagonal</span><span class="token punctuation">(</span>o<span class="token punctuation">,</span> o<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 获取update集</span>
  <span class="token keyword">var</span> linkUpdate <span class="token operator">=</span> linkEnter<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>link<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 更新添加过渡动画</span>
  linkUpdate
    <span class="token punctuation">.</span><span class="token function">transition</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">duration</span><span class="token punctuation">(</span>duration<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"d"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">diagonal</span><span class="token punctuation">(</span>d<span class="token punctuation">,</span> d<span class="token punctuation">.</span>parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 获取exit集</span>
  <span class="token keyword">var</span> linkExit <span class="token operator">=</span> link
    <span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token comment">// 设置过渡动画</span>
    <span class="token punctuation">.</span><span class="token function">transition</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">duration</span><span class="token punctuation">(</span>duration<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"d"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> o <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">x</span><span class="token operator">:</span> source<span class="token punctuation">.</span>x<span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> source<span class="token punctuation">.</span>y <span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token function">diagonal</span><span class="token punctuation">(</span>o<span class="token punctuation">,</span> o<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token comment">// 移除link</span>
    <span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 为动画过渡保存旧的位置</span>
  nodes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    d<span class="token punctuation">.</span>x0 <span class="token operator">=</span> d<span class="token punctuation">.</span>x<span class="token punctuation">;</span>
    d<span class="token punctuation">.</span>y0 <span class="token operator">=</span> d<span class="token punctuation">.</span>y<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 添加贝塞尔曲线的path，衔接与父节点和子节点间</span>
  <span class="token keyword">function</span> <span class="token function">diagonal</span><span class="token punctuation">(</span><span class="token parameter">s<span class="token punctuation">,</span> d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    path <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">M </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
            C </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>y <span class="token operator">+</span> d<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,
              </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>y <span class="token operator">+</span> d<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,
              </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> path<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 当点击时，切换children，同时用_children来保存原子节点信息</span>
  <span class="token keyword">function</span> <span class="token function">click</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>d<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      d<span class="token punctuation">.</span>_children <span class="token operator">=</span> d<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
      d<span class="token punctuation">.</span>children <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      d<span class="token punctuation">.</span>children <span class="token operator">=</span> d<span class="token punctuation">.</span>_children<span class="token punctuation">;</span>
      d<span class="token punctuation">.</span>_children <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">update</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上的逻辑处理，无非是<code v-pre>初始化图表 -&gt; 获取数据 -&gt; 数据转换 -&gt; 元素操作/交互/动画 -&gt; 事件绑定 -&gt; 数据更新 -&gt; 元素更新</code>这样的流程吧。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要分析了需求场景，接着找了个基本的 Tree Demo，然后结合上节讲过的 D3 知识，理解每个步骤的逻辑。<br>
后面将结合实际需要的功能，一点点地说明实现的过程，以及将涉及到的 D3 更多的 API，甚至核心原理吧。</p>
</div></template>


