<template><div><p>曾经我在面试的时候，面试官问我，觉得做过的有意思的东西是什么，答组件相关的。结果被面试官鄙视了，sign~不过呢，再小的设计，当你把满腔热情和各种想法放进里面，它似乎有了灵魂。或许是我当时面试的表达，没有传达到真正的想法，那么在这里，我希望能很好地表达。</p>
<!--more-->
<h1 id="组件的划分" tabindex="-1"><a class="header-anchor" href="#组件的划分" aria-hidden="true">#</a> 组件的划分</h1>
<p>前面我们简单说明了下组件的封装和划分，参考<RouterLink to="/front-end-basic/understanding/app-component-isolation.html">《页面区块化与应用组件化》</RouterLink>。</p>
<h2 id="通过视觉和交互划分" tabindex="-1"><a class="header-anchor" href="#通过视觉和交互划分" aria-hidden="true">#</a> 通过视觉和交互划分</h2>
<p>通常来说，组件的划分，与视觉、交互等密切相关，我们可通过功能、独立性来判断是否适合作为一个组件。</p>
<p>这次我们拿知乎的内容卡片来说吧，上图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1524128850.jpg" alt="image"></p>
<p>可以看到，这里我们每个卡片，内容都稍微有些不一样。但毫无疑问，它们拥有相同的功能，可通过一个组件来控制内容的展示。</p>
<p>那么我们大概可以这样来表示这个组件（为了方便，该文章大部分代码基于 Vue 来表示吧）：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-card</span>
  <span class="token attr-name">:innerData</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>eachCardData<span class="token punctuation">"</span></span>
  <span class="token attr-name">:cardType</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">'</span>videoCard' | 'photoCard' | 'textCard'<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-card</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中，innerData 传入卡片内容，包括标题、文字、图片、附加信息（点赞数、评论数、日期等）。
同时，我们可以通过 cardType 来告诉组件，这是个视频类型、图片类型、还是纯文字类型的内容，来让组件控制内容和样式展示。</p>
<h2 id="通过代码复用划分" tabindex="-1"><a class="header-anchor" href="#通过代码复用划分" aria-hidden="true">#</a> 通过代码复用划分</h2>
<p>我们在写代码的时候，观察到一些代码，他们在结构和功能上其实是可复用的，这个时候我们也可以通过封装的办法，把它们封装一起，以减少重复的代码。</p>
<p>同样的，我们拿右侧的一个快捷导航模块来看：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1524131302(1).jpg" alt="image"></p>
<p>一般来说，从功能划分的话，我们会把外面那层封装成一整个组件：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>quick-link-panel</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item in quickLinkItem<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>...<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>quick-link-panel</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候有人跑出来说，每一行我们都可以视为独立的一个组件，看：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>quick-link-line</span>
  <span class="token attr-name">link</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>where/to/go<span class="token punctuation">"</span></span>
  <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>lineText<span class="token punctuation">"</span></span>
  <span class="token attr-name">:tagNum</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>numberWithTag<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>quick-link-line</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Emmmmmmm。。好像这样也看不出来区别把？似乎也没有简化到什么代码？</p>
<p>不！对方说，在这样的模块里面就可以快速使用了：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>quick-link-panel-with-text</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>我可是有标题的噢<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>quick-link-line</span>
    <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item in quickLinkItem<span class="token punctuation">"</span></span>
    <span class="token attr-name">:link</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item.link<span class="token punctuation">"</span></span>
    <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item.lineText<span class="token punctuation">"</span></span>
    <span class="token attr-name">:tagNum</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item.numberWithTag<span class="token punctuation">"</span></span>
  <span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>quick-link-line</span><span class="token punctuation">></span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>quick-link-panel-with-text</span>
<span class="token punctuation">></span></span>>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>=.=好吧，可能这里举得例子不够特别鲜明。不过大抵意思是这样啦。</p>
<p>但其实这不是很好运用的一种方式，因为控制不好的话，可能你的代码会过度封装，导致别人在维护的时候，表示：卧槽！！！这得跳多少层才能找到想看的代码！！！</p>
<h1 id="组件的封装" tabindex="-1"><a class="header-anchor" href="#组件的封装" aria-hidden="true">#</a> 组件的封装</h1>
<p>怎样才能算是一个合格的组件呢？我们在设计的时候，经常要考虑解耦，但很多时候，过度的解耦反而会导致项目复杂度变高，维护性降低。</p>
<h2 id="独立的组件" tabindex="-1"><a class="header-anchor" href="#独立的组件" aria-hidden="true">#</a> 独立的组件</h2>
<p>组件的独立性，可以包括以下几个方面：</p>
<ul>
<li>维护自身的数据和状态、作用域</li>
<li>维护自身的事件</li>
</ul>
<p>同样拿之前的内容卡片来看：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1524133892(1).jpg" alt="image"></p>
<p>这是个独立的卡片：</p>
<ol>
<li>它拥有自己的数据，包括标题、文字、图片、点赞数、评论数、日期等。</li>
<li>它拥有自身的状态，是否已点赞、是否已收藏、是否详细展示内容、是否展示评论等。</li>
<li>它维护着自己的事件，包括点击分享、收藏、点赞、回复等等。</li>
</ol>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">></span></span>{{model.question}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">:class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>isContextShown ? 'content-detail' : 'content-brief'<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model.withImage<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">:url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model.imageUrl<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>{{model.content}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>likeIt()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>点赞<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>keepIt()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>收藏<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"my-card"</span><span class="token punctuation">,</span>
    <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token literal-property property">isContextShown</span><span class="token operator">:</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">likeIt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function">keepIt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>嗯，去掉很多功能之后，大概是这么简单的一个组件吧[捂脸]。</p>
<h2 id="组件与外界" tabindex="-1"><a class="header-anchor" href="#组件与外界" aria-hidden="true">#</a> 组件与外界</h2>
<p>我们在保持组件独立性的时候，当然还需要考虑它与外界的交互，主要包括：</p>
<p><strong>对外提供配置项，来控制展示以及具体功能。</strong></p>
<p>这里最简单的，我们每个卡片都需要传入内容，我们一次性拉取列表数据，并传入每个卡片，在 Vue 中可以使用 props。</p>
<p><strong>对外提供查询接口，可从外界获取组件状态。</strong></p>
<p>这个的话，更多时候我们是通过事件等方式来告诉外界一些事情。在这里举个例子，我们这里假设一个页面只允许一个卡片内容处于详细展开状态，故我们需要获取其展开的操作，方便控制。</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">></span></span>{{model.question}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>toggleContext()<span class="token punctuation">"</span></span>
      <span class="token attr-name">:class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>isContextShown ? 'content-detail' : 'content-brief'<span class="token punctuation">"</span></span>
    <span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model.withImage<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token attr-name">:url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model.imageUrl<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>{{model.content}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>likeIt()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>点赞<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>keepIt()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>收藏<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"my-card"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// 传入数据</span>
      <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> Object<span class="token punctuation">,</span>
        <span class="token function-variable function">default</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">isContextShown</span><span class="token operator">:</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">likeIt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function">keepIt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function">toggleContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 点击展开/收起的时候通知</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>isContextShown <span class="token operator">=</span> <span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>isContextShown<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token string">"toggle"</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>isContextShown<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简单调整之后，我们会这样使用：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-card</span> <span class="token attr-name">:model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>cardModel<span class="token punctuation">"</span></span> <span class="token attr-name">@toggle</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>doSomething()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-card</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这是最简单的对内和对外的联系，对一个组件来说，它也有 in 和 out 两个方向的流动。</p>
<p>在 Vue 里，如果父组件需要获取子组件的实例，也可以通过通过<code v-pre>vm.$refs</code>来获取。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这里主要从单个组件的角度来进行说明，搭配一点点的代码，防止文字太多难以理解。<br>
其实组件的封装，与我们很相似。我们需要拥有独立的空间，但不能完全封闭，我们需要从其他地方获取能量，同时也需要反馈给其他人，来完成更多的协助与配合。</p>
</div></template>


