<template><div><p>该系列用于记录一些使用方法、demo 以及原理分析。本文讲述 Vue 中列表的过渡，以及介绍下 FLIP。</p>
<!--more-->
<h1 id="flip" tabindex="-1"><a class="header-anchor" href="#flip" aria-hidden="true">#</a> FLIP</h1>
<p>关于 FLIP，在了解之后会有“卧槽还有这种骚操作”的感觉。</p>
<h2 id="什么是-flip" tabindex="-1"><a class="header-anchor" href="#什么是-flip" aria-hidden="true">#</a> 什么是 FLIP</h2>
<p>这里有个简单的文章来说明 FLIP，包括<a href="https://aerotwist.com/blog/flip-your-animations/" target="_blank" rel="noopener noreferrer">原文<ExternalLinkIcon/></a>和<a href="http://web.jobbole.com/83598/" target="_blank" rel="noopener noreferrer">译文<ExternalLinkIcon/></a>。</p>
<p>这里借助翻译人员的力量，贴出 FLIP 四个字母的解释啦。</p>
<p>FLIP 代表 First、Last、Invert、Play：</p>
<ul>
<li><strong>First</strong>：元素参与 transtion 的初始状态。</li>
<li><strong>Last</strong>：元素的最终状态。</li>
<li><strong>Invert</strong>：这里有点意思。你弄清楚了元素从开始到结束是如何改变的，如它的 width、height、opacity。下一步，你应用 transform 和 opacity 的变化来扭转或反转它们。如果元素已经向下移动到初始和结束状态之间的 90px，然后在 Y 轴上应用 transform -90px。这让元素看起来仍然在初始的位置，所以元素并没有达到最终的位置。</li>
<li><strong>Play</strong>：为你之前改变的属性开启过渡，然后移除反转的改变。因为当移除 transform 和 opacity 时，元素都在它们的最终位置。这会缓解从伪造的初始位置到最终位置的计算量。</li>
</ul>
<h2 id="如何理解-flip" tabindex="-1"><a class="header-anchor" href="#如何理解-flip" aria-hidden="true">#</a> 如何理解 FLIP</h2>
<p>最初看到这些解释的时候，也是不是很明白在说啥。后面仔细看了下，好骚的操作~</p>
<p>那本骚年就以自身的理解来讲一下这个操作是怎么骚的~</p>
<h3 id="动画的性能" tabindex="-1"><a class="header-anchor" href="#动画的性能" aria-hidden="true">#</a> 动画的性能</h3>
<p>故事要从很多年前说起，当年 CSS3 还没普遍兼容，我们使用着最原始的 jQuery 来做动画。那时候怎么做的呢？通常是通过定时器和直接改变元素的 style 来实现动画的，jQuery 的话，一般就是用<code v-pre>.animate()</code>来做的。</p>
<p>但是这样做会有什么问题呢？这要从浏览器渲染说起啦。大家可以看看<a href="https://coolshell.cn/articles/9666.html" target="_blank" rel="noopener noreferrer">《浏览器的渲染原理简介》<ExternalLinkIcon/></a>这篇文章，里面讲得比较详细。</p>
<p>这里描述下两个概念：</p>
<ul>
<li><strong>Repaint</strong>：屏幕的一部分要重画，比如某个 CSS 的背景色变了。但是元素的几何尺寸没有变。</li>
<li><strong>Reflow</strong>：意味着元件的几何尺寸变了，我们需要重新验证并计算 Render Tree。是 Render Tree 的一部分或全部发生了变化。</li>
</ul>
<p>简单说就是，Reflow 的成本比 Repaint 的成本高得多的多。而我们手动设置这些动画的时候，则可能会中了死穴。</p>
<p>但是不是所有属性动画消耗的性能都一样，其中消耗最低的是 transform 和 opacity 两个属性（当然还有会触发 Composite 的其他 CSS 属性），其次是 Paint 相关属性。相关的分析大家可以参考下<a href="https://www.w3cplus.com/animation/animation-performance.html" target="_blank" rel="noopener noreferrer">《CSS Animation 性能优化》<ExternalLinkIcon/></a>。</p>
<p>所以从某种角度来说，我们使用 CSS3 的 transform 这些，是可以优化动画性能的。</p>
<h3 id="元素的样式规整" tabindex="-1"><a class="header-anchor" href="#元素的样式规整" aria-hidden="true">#</a> 元素的样式规整</h3>
<p>更多的情况是，我们在计算动画时，通常很难计算最终状态，例如一些元素的重新排列，而我们又希望能有个过渡动画的时候。</p>
<p>通常来说，我们如果真的需要完整地计算整个样式过渡的动画，很多时候只能将元素设置<code v-pre>position: absolute/fixed</code>这样实现，但是这样存在很多性能、兼容和响应式问题，不好维护同时也不够灵活。</p>
<p>看看本骚年曾经写过的一个<a href="https://godbasin.github.io/2016/06/20/responsive-waterfall/" target="_blank" rel="noopener noreferrer">《jQuery 响应式瀑布流》<ExternalLinkIcon/></a>就知道有多蛋疼了。</p>
<h3 id="flip-过渡" tabindex="-1"><a class="header-anchor" href="#flip-过渡" aria-hidden="true">#</a> FLIP 过渡</h3>
<p>FLIP，本质上它是一个准则，而不是一个框架或库。这是对动画的一种思考，试图在浏览器中能更轻易地让动画达到 60 fps（关于后者，这里先不做过多讨论哈）。</p>
<p><strong>FLIP 将动画翻转</strong>，可以这样理解：</p>
<ol>
<li>正常动画过渡，会计算最终 B 状态，再减去初始 A 状态，然后根据想要的过渡时间，定时器设置每段时间的变化，应用到元素上。</li>
<li>FLIP 的做法是，A 状态到 B 状态，不用手动计算每一帧的改变，而是计算从 B 到 A 的反向动画，然后下一帧直接切换 B 状态，在把反向动画应用在 B 上。</li>
</ol>
<p>其实真实元素是直接从 A-&gt;B，但是由于在 B 状态上加了反向动画，所以用户看起来像是过渡。</p>
<p>还是看不懂？亮出代码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 获取初始位置A</span>
<span class="token keyword">var</span> first <span class="token operator">=</span> el<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 将其移动到最终位置B</span>
el<span class="token punctuation">.</span>classList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token string">"totes-at-the-end"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 获取最终位置B</span>
<span class="token keyword">var</span> last <span class="token operator">=</span> el<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 翻转，计算B->A需要的移动</span>
<span class="token keyword">var</span> invert <span class="token operator">=</span> first<span class="token punctuation">.</span>top <span class="token operator">-</span> last<span class="token punctuation">.</span>top<span class="token punctuation">;</span>

<span class="token comment">// 从翻转的位置到最终位置</span>
<span class="token keyword">var</span> player <span class="token operator">=</span> el<span class="token punctuation">.</span><span class="token function">animate</span><span class="token punctuation">(</span>
  <span class="token punctuation">[</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">transform</span><span class="token operator">:</span> <span class="token string">"translateY("</span> <span class="token operator">+</span> invert <span class="token operator">+</span> <span class="token string">"px)"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">transform</span><span class="token operator">:</span> <span class="token string">"translateY(0)"</span> <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">300</span><span class="token punctuation">,</span>
    <span class="token literal-property property">easing</span><span class="token operator">:</span> <span class="token string">"cubic-bezier(0,0,0.32,1)"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 动画结束后做一些处理，如移除样式什么的。</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>嗯，大概差不多就酱啦。</p>
<h1 id="列表过渡" tabindex="-1"><a class="header-anchor" href="#列表过渡" aria-hidden="true">#</a> 列表过渡</h1>
<h2 id="transition-group-组件" tabindex="-1"><a class="header-anchor" href="#transition-group-组件" aria-hidden="true">#</a> transition-group 组件</h2>
<p>前面我们讲到 transition 组件，多半用于单个节点，或者是同一时间中只渲染单个节点的情况。</p>
<p>这里我们要渲染多个节点的过渡效果，需要用到 transition-group 组件：</p>
<ul>
<li>不同于 transition（transition 不会转换为真实元素），它会以一个真实元素呈现：默认为一个 <code v-pre>&lt;span&gt;</code>。你也可以通过 tag 特性更换为其他元素</li>
<li>内部元素 总是需要 提供唯一的 key 属性值（transition 是当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记）</li>
</ul>
<h3 id="demo" tabindex="-1"><a class="header-anchor" href="#demo" aria-hidden="true">#</a> demo</h3>
<p>这里看看<a href="https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E7%9A%84%E4%BA%A4%E9%94%99%E8%BF%87%E6%B8%A1" target="_blank" rel="noopener noreferrer">官网<ExternalLinkIcon/></a>的例子：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>list-demo<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>demo<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">v-on:</span>click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>add<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Add<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">v-on:</span>click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>remove<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>Remove<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition-group</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>list<span class="token punctuation">"</span></span> <span class="token attr-name">tag</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>p<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item in items<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">v-bind:</span>key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>list-item<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      {{ item }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition-group</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们稍微改一下，每次随机添加两个、删除两个：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">"#list-demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">items</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">nextNum</span><span class="token operator">:</span> <span class="token number">10</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">randomIndex</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">add</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">randomIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nextNum<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">randomIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nextNum<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">remove</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">randomIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">randomIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-CSS line-numbers-mode" data-ext="CSS"><pre v-pre class="language-CSS"><code>.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者看<a href="https://jsfiddle.net/godbasin/xubvz597/3/" target="_blank" rel="noopener noreferrer">JSFiddle 这里<ExternalLinkIcon/></a>。</p>
<p>这里我们能看到，只有新加和删除的元素才会有过渡效果，其他的元素会瞬间移动，没有过渡效果。
然后为了解决这个问题，我们需要用到 FLIP。</p>
<h2 id="排序过渡" tabindex="-1"><a class="header-anchor" href="#排序过渡" aria-hidden="true">#</a> 排序过渡</h2>
<p>什么是排序过渡？大概是：</p>
<ol>
<li>新增的元素有进入动画。</li>
<li>移除的元素有离开动画。</li>
<li>位置移动的元素有移动动画。</li>
</ol>
<p>前面两点我们已经可以通过之前的方式实现了，关于第三点，我们使用 FLIP。</p>
<p>比较关键的，我们看看 Vue 中的实现代码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// we divide the work into three loops to avoid mixing DOM reads and writes</span>
<span class="token comment">// in each iteration - which helps prevent layout thrashing.</span>
children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>callPendingCbs<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1. 之前如果有没结束的过渡，先结束掉</span>
children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>recordPosition<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 2. 记录新的位置</span>
children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>applyTranslation<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 3. 计算反向动画，生成个CSS动画</span>

<span class="token comment">// force reflow to put everything in position</span>
<span class="token keyword">const</span> <span class="token literal-property property">body</span><span class="token operator">:</span> any <span class="token operator">=</span> document<span class="token punctuation">.</span>body<span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token literal-property property">f</span><span class="token operator">:</span> number <span class="token operator">=</span> body<span class="token punctuation">.</span>offsetHeight<span class="token punctuation">;</span> <span class="token comment">// eslint-disable-line</span>

children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">c</span><span class="token operator">:</span> VNode</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>c<span class="token punctuation">.</span>data<span class="token punctuation">.</span>moved<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> <span class="token literal-property property">el</span><span class="token operator">:</span> any <span class="token operator">=</span> c<span class="token punctuation">.</span>elm<span class="token punctuation">;</span>
    <span class="token keyword">var</span> <span class="token literal-property property">s</span><span class="token operator">:</span> any <span class="token operator">=</span> el<span class="token punctuation">.</span>style<span class="token punctuation">;</span>
    <span class="token comment">// 添加反向CSS动画</span>
    <span class="token function">addTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> moveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    s<span class="token punctuation">.</span>transform <span class="token operator">=</span> s<span class="token punctuation">.</span>WebkitTransform <span class="token operator">=</span> s<span class="token punctuation">.</span>transitionDuration <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
    <span class="token comment">// 监听动画结束，结束之后要移除CSS动画类名啦</span>
    el<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>
      transitionEndEvent<span class="token punctuation">,</span>
      <span class="token punctuation">(</span>el<span class="token punctuation">.</span><span class="token function-variable function">_moveCb</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>e <span class="token operator">||</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">transform$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>propertyName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          el<span class="token punctuation">.</span><span class="token function">removeEventListener</span><span class="token punctuation">(</span>transitionEndEvent<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>
          el<span class="token punctuation">.</span>_moveCb <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
          <span class="token function">removeTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> moveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里还有个反向动画的计算可能大家会稍微感兴趣：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">applyTranslation</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">c</span><span class="token operator">:</span> VNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> oldPos <span class="token operator">=</span> c<span class="token punctuation">.</span>data<span class="token punctuation">.</span>pos<span class="token punctuation">;</span>
  <span class="token keyword">const</span> newPos <span class="token operator">=</span> c<span class="token punctuation">.</span>data<span class="token punctuation">.</span>newPos<span class="token punctuation">;</span>
  <span class="token keyword">const</span> dx <span class="token operator">=</span> oldPos<span class="token punctuation">.</span>left <span class="token operator">-</span> newPos<span class="token punctuation">.</span>left<span class="token punctuation">;</span>
  <span class="token keyword">const</span> dy <span class="token operator">=</span> oldPos<span class="token punctuation">.</span>top <span class="token operator">-</span> newPos<span class="token punctuation">.</span>top<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>dx <span class="token operator">||</span> dy<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    c<span class="token punctuation">.</span>data<span class="token punctuation">.</span>moved <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> s <span class="token operator">=</span> c<span class="token punctuation">.</span>elm<span class="token punctuation">.</span>style<span class="token punctuation">;</span>
    s<span class="token punctuation">.</span>transform <span class="token operator">=</span> s<span class="token punctuation">.</span>WebkitTransform <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">translate(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>dx<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px,</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>dy<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px)</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>
    s<span class="token punctuation">.</span>transitionDuration <span class="token operator">=</span> <span class="token string">"0s"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实也不难，跟上面的 FLIP demo 逻辑相似。</p>
<p>排序过渡中，官方文档提到一个 v-move 特性，它会在元素的改变定位的过程中应用。像前面的类名一样，可以通过 name 属性来自定义前缀，也可以通过 move-class 属性手动设置。</p>
<div class="language-CSS line-numbers-mode" data-ext="CSS"><pre v-pre class="language-CSS"><code>.flip-list-move {
  transition: transform 1s;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但其实这只是一个设置 transition 的过渡时间和过渡曲线而已，真正的亮点是藏在 FLIP 里面。</p>
<p>具体能实现怎样的效果呢？像<a href="https://jsfiddle.net/chrisvfritz/sLrhk1bc/" target="_blank" rel="noopener noreferrer">这个小伙的实现<ExternalLinkIcon/></a>就比较有趣啦~</p>
<h2 id="列表交错过渡" tabindex="-1"><a class="header-anchor" href="#列表交错过渡" aria-hidden="true">#</a> 列表交错过渡</h2>
<p>交错过渡听起来好厉害的样子，其实说白了就是：设置延时，给元素设置顺序延时的动画效果，通过 data 属性与 JavaScript 通信就可以实现啦。</p>
<p>大概就是获取元素的序号，计算延时，然后设置定时器动画啦。看看<a href="https://cn.vuejs.org/v2/guide/transitions.html#%E5%88%97%E8%A1%A8%E7%9A%84%E4%BA%A4%E9%94%99%E8%BF%87%E6%B8%A1" target="_blank" rel="noopener noreferrer">官方<ExternalLinkIcon/></a>的 demo：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">"#staggered-list-demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">query</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">list</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token string">"Bruce Lee"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token string">"Jackie Chan"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token string">"Chuck Norris"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token string">"Jet Li"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token string">"Kung Fury"</span> <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">computedList</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>list<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">item</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> item<span class="token punctuation">.</span>msg<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>vm<span class="token punctuation">.</span>query<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">beforeEnter</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      el<span class="token punctuation">.</span>style<span class="token punctuation">.</span>opacity <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      el<span class="token punctuation">.</span>style<span class="token punctuation">.</span>height <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">enter</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 看看这里的定时器延时</span>
      <span class="token keyword">var</span> delay <span class="token operator">=</span> el<span class="token punctuation">.</span>dataset<span class="token punctuation">.</span>index <span class="token operator">*</span> <span class="token number">150</span><span class="token punctuation">;</span>
      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">Velocity</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token string">"1.6em"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">complete</span><span class="token operator">:</span> done <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> delay<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">leave</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 还有这里的定时器延时</span>
      <span class="token keyword">var</span> delay <span class="token operator">=</span> el<span class="token punctuation">.</span>dataset<span class="token punctuation">.</span>index <span class="token operator">*</span> <span class="token number">150</span><span class="token punctuation">;</span>
      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">Velocity</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">complete</span><span class="token operator">:</span> done <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> delay<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们介绍了 Vue 中列表过渡，同时介绍了 Vue 实现位移过渡的很重要的方式-- FLIP。当然使用 FLIP 能实现更多酷炫和好玩的效果，取决于你的想象力啦。<br>
Vue 后面还讲到动态过渡、可服用过渡和状态过渡，但其实很多都是基于 Javascript 来实现哒。重要的是思想和想法，关于动画，本骚年就不再仔细讲述啦。</p>
</div></template>


