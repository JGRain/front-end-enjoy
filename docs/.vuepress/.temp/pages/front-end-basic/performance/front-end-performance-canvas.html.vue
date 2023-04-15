<template><div><p>Canvas 渲染在前端应用中的使用场景不算多，但在大多数用到的场景下，也常常需要考虑性能瓶颈。</p>
<!--more-->
<p>Canvas 的使用场景可能少一些（比如游戏、复杂图形、复杂排版等），本来想将 Canvas 渲染放在<RouterLink to="/front-end-basic/performance/front-end-performance-render.html">《前端性能优化——渲染篇》</RouterLink>一起介绍。后来想了下，Canvas 本身有许多优化点，可以结合自己在项目中的一些经验再详细地做介绍。</p>
<h1 id="canvas-性能优化" tabindex="-1"><a class="header-anchor" href="#canvas-性能优化" aria-hidden="true">#</a> Canvas 性能优化</h1>
<p>其实对于 Canvas 的优化，<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas" target="_blank" rel="noopener noreferrer">WDN<ExternalLinkIcon/></a> 上也有一些介绍。如果你在网上搜索相关内容，或许有许多的优化方向都和本文有些相像。</p>
<p>这是当然的，因为我们在做 Canvas 优化的时候，也同样会去找业界的方案做调研，结合自身项目的情况再做方案设计。</p>
<p>那么，这里整理下我了解到以及实践中的一些 Canvas 优化方案吧。</p>
<h2 id="canvas-上下文切换" tabindex="-1"><a class="header-anchor" href="#canvas-上下文切换" aria-hidden="true">#</a> Canvas 上下文切换</h2>
<p>Canvas 绘制 API 都是在上下文<code v-pre>context</code>上进行调用，<code v-pre>context</code>不是一个普通的对象，当我们对其赋值的时候，性能开销远大于普通对象。我们可以尝试将每个赋值操作执行一百万次，来看看其耗时：</p>
<table>
<thead>
<tr>
<th>赋值属性</th>
<th>耗时(ms)</th>
<th>耗时（非法赋值）(ms)</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>font</code></td>
<td>200+</td>
<td>1500+</td>
</tr>
<tr>
<td><code v-pre>fillStyle</code></td>
<td>80+</td>
<td>800+</td>
</tr>
<tr>
<td><code v-pre>strokeStyle</code></td>
<td>50+</td>
<td>800+</td>
</tr>
<tr>
<td><code v-pre>lineWidth</code></td>
<td>30+</td>
<td>500+</td>
</tr>
</tbody>
</table>
<p>可见，频繁对 Canvas 上下文属性修改赋值是有一定的性能开销的。这是因为当我们调用<code v-pre>context.lineWidth = 2</code>时，浏览器会需要立刻地做一些事情，这样在下一次绘制的时候才能以最新的状态绘制。这意味着，在绘制两段不同字体大小的文本的时候，需要设置两次不同的字体，也就是需要进行两次<code v-pre>context</code>上下文状态的切换。</p>
<p>在大多数情况下，我们的 Canvas 绘制内容的样式不会太多。但是在绘制内容数量大、样式多的场景下，我们应该考虑如何减少上下文<code v-pre>context</code>的切换。</p>
<p>可以考虑使用先将相同样式的绘制内容收集起来，结合享元的方式将其维护起来。在绘制的时候，则可以针对每种样式做切换，切换后批量绘制相同样式的所有内容。</p>
<p>举个例子，我们绘制俄罗斯方块，可以考虑所有方块的信息收集起来，相同样式的放在一个数据中，切换上下文后遍历绘制。比如，边框信息放在一个数组中，背景色相同的放在一个数组中。</p>
<h2 id="canvas-拆分" tabindex="-1"><a class="header-anchor" href="#canvas-拆分" aria-hidden="true">#</a> Canvas 拆分</h2>
<p>一般来说，我们在 Canvas 里绘制的内容，都可以根据变更频率来拆分，简称动静分离。</p>
<p>Canvas 拆分的关键点在于：尽量避免进行不必要的渲染，减少频繁变更的渲染范围。</p>
<p>比如在游戏中，状态栏（血条、当前关卡说明等）相对动作/动画内容来说，这部分内容的变更不会太频繁，可以将其拆出到一个单独的 Canvas 来做绘制。再假设该游戏有个静态的复杂背景，如果我们每次更新内容都需要重新将这个背景再绘制一遍，显然开销也是不小的，那么这个背景我们也可以用单独的 Canvas 来绘制。</p>
<p>Canvas 拆分的前提是更新频率的内容分离，而在拆分的时候也有两个小技巧：</p>
<ol>
<li>根据绘制范围拆分。</li>
<li>根据堆叠层次关系拆分。</li>
</ol>
<h3 id="绘制范围的拆分" tabindex="-1"><a class="header-anchor" href="#绘制范围的拆分" aria-hidden="true">#</a> 绘制范围的拆分</h3>
<p>绘制范围的拆分要怎么理解呢？简单说就是将画布划分不同的区域，然后根据不同的区域更新频率，来进行 Canvas 拆分。</p>
<p>举个例子，假设我们现在需要实现 Web 端 VsCode，而整个界面都是由 Canvas 绘制（当然这样不大合理，这里假设只是为了更好地举例）。</p>
<p>我们可以简单地将 VsCode 拆分成几个区域：顶部栏、左侧栏、底部栏、编辑区。显然这个几个区域的变更频率、触发变更的前提都不一致，我们可以将其做拆分。</p>
<h3 id="堆叠层次的拆分" tabindex="-1"><a class="header-anchor" href="#堆叠层次的拆分" aria-hidden="true">#</a> 堆叠层次的拆分</h3>
<p>如果说绘制范围的拆分是二维角度，那么堆叠层次更像是三维的 y 轴方向的拆分。</p>
<p>前面提到的游戏画布拆分，其实背景图片便是堆叠在其余内容的下面。我们可以考虑更复杂的场景，比如我们要实现 Web 版的 Excel/Word，那么我们也可考虑按照堆叠顺序来做拆分：背景色、文字、边框线等等。</p>
<p>对于有堆叠顺序的绘制来说，Canvas 拆分的优化效果更好。因为如果是二维角度的内容，我们可以只擦除和重绘某个 x/y 轴范围的内容就可以。</p>
<p>但是涉及到绘制内容的堆叠，如果不做 Canvas 的拆分，意味着我们其中任何一个层级的内容变更，都需要将所有层级的内容擦除并且重绘。比如在 Excel 场景下，某个区域的格子背景颜色变更，我们需要将该区域的格子全部擦除，再重新分别绘制背景色、文字、边框线、其他内容等等。</p>
<p>实际上，结合前面提到的<code v-pre>context</code>上下文的性能开销可知，我们在绘制的时候，很可能并不是以单个格子为单位来进行顺序堆叠的绘制，而是整个画布所有格子一起做顺序绘制（意思是，先绘制所有格子的背景色，再绘制所有格子的文字和边框线等等）。</p>
<p>在这样的情况下，如果没有做 Canvas 堆叠顺序的拆分，意味着每一个小的变更，我们都需要将整个表格的内容进行重绘。</p>
<h3 id="canvas-拆分的开销" tabindex="-1"><a class="header-anchor" href="#canvas-拆分的开销" aria-hidden="true">#</a> Canvas 拆分的开销</h3>
<p>需要注意的是，Canvas 本身的维护也会存在一定的开销，并不是说我们拆的越多越好。</p>
<p>可以根据项目的实际情况，结合 Canvas 拆离后的效果，确定 Canvas 拆分的最终方案。</p>
<h2 id="离屏渲染" tabindex="-1"><a class="header-anchor" href="#离屏渲染" aria-hidden="true">#</a> 离屏渲染</h2>
<p>对于离屏渲染的概念，大多数情况是指：使用一个不可见（或是屏幕外）的 Canvas 对即将渲染的内容的某部分进行提前绘制，然后频繁地将屏幕外图像渲染到主画布上，避免重复生成该部分内容的步骤。</p>
<p>比如，提前绘制好某个图像，在画布更新的时候直接使用该图像：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// 在离屏 canvas 上绘制</span>
<span class="token keyword">var</span> canvasOffscreen <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">"canvas"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
canvasOffscreen<span class="token punctuation">.</span>width <span class="token operator">=</span> dw<span class="token punctuation">;</span>
canvasOffscreen<span class="token punctuation">.</span>height <span class="token operator">=</span> dh<span class="token punctuation">;</span>
canvasOffscreen
  <span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">"2d"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">drawImage</span><span class="token punctuation">(</span>image<span class="token punctuation">,</span> sx<span class="token punctuation">,</span> sy<span class="token punctuation">,</span> sw<span class="token punctuation">,</span> sh<span class="token punctuation">,</span> dx<span class="token punctuation">,</span> dy<span class="token punctuation">,</span> dw<span class="token punctuation">,</span> dh<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 在绘制每一帧的时候，绘制这个图形</span>
context<span class="token punctuation">.</span><span class="token function">drawImage</span><span class="token punctuation">(</span>canvasOffscreen<span class="token punctuation">,</span> x<span class="token punctuation">,</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="各种离屏渲染场景" tabindex="-1"><a class="header-anchor" href="#各种离屏渲染场景" aria-hidden="true">#</a> 各种离屏渲染场景</h3>
<p>关于离屏渲染，其实结合不同的使用场景，还可以达到不同的效果。比如：</p>
<p>(1) 使用离屏 Canvas 提前绘制特定内容。</p>
<p>这就是前面说到的提前绘制好需要的内容，避免每次重复生成的开销。</p>
<p>(2) 使用双 Canvas 交替绘制。</p>
<p>考虑 Canvas 滚动的场景，比如分页绘制，离屏 Canvas 可以提前绘制下一页/下一屏的内容，在切换的时候可以直接使用提前绘制好的内容。</p>
<p>通过这样的方式，可以加快 Canvas 的绘制，可以理解为预渲染的效果。</p>
<p>(3) 使用 OffscreenCanvas 达到真正的离屏。</p>
<p>通过 OffscreenCanvas API，真正地将离屏 Canvas 完整地运行在 worker 线程，有效减少主线程的性能开销。</p>
<h3 id="offscreencanvas-api-能力" tabindex="-1"><a class="header-anchor" href="#offscreencanvas-api-能力" aria-hidden="true">#</a> OffscreenCanvas API 能力</h3>
<p>要达到将 Canvas 运行在 web worker 线程中，需要依赖 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas" target="_blank" rel="noopener noreferrer">OffscreenCanvas API<ExternalLinkIcon/></a> 提供的能力。</p>
<blockquote>
<p>需要注意的是，该 API 同样可以运行在主线程中。即使是在主线程中运行，其开销也比普通 Canvas 要小。</p>
</blockquote>
<p><code v-pre>OffscreenCanvas</code>提供了一个可以脱离屏幕渲染的 Canvas 对象，可运行在在窗口环境和 web worker 环境。但是该 API 已知具有兼容性问题（比如 Safari 和 IE，以及部分安卓 Webview），需要考虑不兼容情况下的降级方案。关于此能力现有的技术方案和文档较少，可参考：</p>
<ul>
<li><a href="https://zhuanlan.zhihu.com/p/34698375" target="_blank" rel="noopener noreferrer">OffscreenCanvas - 概念说明及使用解析<ExternalLinkIcon/></a></li>
<li><a href="https://developers.google.com/web/updates/2018/08/offscreen-canvas" target="_blank" rel="noopener noreferrer">OffscreenCanvas — Speed up Your Canvas Operations with a Web Worker<ExternalLinkIcon/></a></li>
</ul>
<p>对于该 API，核心的优势在于：当主线程繁忙时，依然可以通过 OffscreenCanvas 在 worker 中更新画布内容，避免给用户造成页面卡顿的体验。</p>
<p>除此之外，还可以进一步考虑在兼容性支持的情况下，通过将局部计算运行在 worker 中，减少渲染层的计算耗时，提升渲染层的渲染性能。</p>
<h2 id="其他-canvas-优化方式" tabindex="-1"><a class="header-anchor" href="#其他-canvas-优化方式" aria-hidden="true">#</a> 其他 Canvas 优化方式</h2>
<p>上面介绍了几种较大的 Canvas 优化方案，实际上我们在项目中还需要考虑：</p>
<ul>
<li>做内容的增量更新渲染，避免频繁地绘制大范围的内容</li>
<li>避免浮点数的坐标点，浏览器为了达到抗锯齿的效果会做额外的运算，建议用整数取而代之</li>
<li>使用 CSS transform 代替 Canvas 计算缩放（CSS transforms 使用 GPU，因此速度更快）</li>
<li>过于复杂的计算逻辑，可以考虑做任务的拆分，避免长时间计算造成页面卡顿</li>
</ul>
<p>这里简单提一下增量渲染。</p>
<h3 id="增量渲染" tabindex="-1"><a class="header-anchor" href="#增量渲染" aria-hidden="true">#</a> 增量渲染</h3>
<p>增量渲染需要对内容的变更做计算，将变更的内容局限在某个特定范围，从而避免频繁地绘制大范围的内容。</p>
<p>举个例子，假设我们的画布内容支持向下滚动，那么我们在滚动的时候可以考虑：</p>
<ul>
<li>根据滚动的距离，将上一帧可复用的内容做裁剪保存</li>
<li>在下一帧绘制中，先将上一帧中重复的内容在新的位置绘制</li>
<li>原有内容绘制完成后，新增的部分内容再进行重新绘制</li>
</ul>
<p>通过这样的方式，可以节省掉一部分的内容绘制和生成过程，提升每次渲染的速度。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>使用 Canvas 绘制，我们则脱离了浏览器自身的绘制过程，因此更加要注意性能问题，避免卡顿和耗时较大的计算。</p>
<p>至于耗时长的计算和卡顿的优化，我会在另外一篇文章中做详细的介绍（参见<RouterLink to="/front-end-basic/performance/front-end-performance-no-responding.html">前端性能优化——卡顿篇</RouterLink>）。</p>
<blockquote>
<p>我有一个游戏梦，Canvas 做游戏应该也很好玩吧。</p>
</blockquote>
</div></template>


