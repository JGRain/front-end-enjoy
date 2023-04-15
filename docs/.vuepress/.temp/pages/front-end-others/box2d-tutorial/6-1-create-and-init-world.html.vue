<template><div><p>本节我们主要讲述创建一个物理世界，以及初始化的过程。</p>
<!--more-->
<h1 id="创建世界并初始化" tabindex="-1"><a class="header-anchor" href="#创建世界并初始化" aria-hidden="true">#</a> 创建世界并初始化</h1>
<h2 id="创建世界" tabindex="-1"><a class="header-anchor" href="#创建世界" aria-hidden="true">#</a> 创建世界</h2>
<p>前面我们在介绍世界的时候，也有简单说明如何创建一个物理世界：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> canvas <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"game"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> ctx <span class="token operator">=</span> canvas<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">"2d"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> canvasWidth <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>canvas<span class="token punctuation">.</span>width<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> canvasHeight <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>canvas<span class="token punctuation">.</span>height<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 我们将创建世界封装至createWorld函数内</span>
<span class="token keyword">function</span> <span class="token function">createWorld</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 世界的大小</span>
  <span class="token keyword">var</span> worldAABB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2AABB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  worldAABB<span class="token punctuation">.</span>minVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">4000</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">4000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  worldAABB<span class="token punctuation">.</span>maxVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token number">4000</span><span class="token punctuation">,</span> <span class="token number">4000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">//定义重力</span>
  <span class="token keyword">var</span> gravity <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2Vec2</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 是否休眠</span>
  <span class="token keyword">var</span> doSleep <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

  <span class="token comment">// 最终创建世界</span>
  <span class="token keyword">var</span> world <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2World</span><span class="token punctuation">(</span>worldAABB<span class="token punctuation">,</span> gravity<span class="token punctuation">,</span> doSleep<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> world<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="绘制世界" tabindex="-1"><a class="header-anchor" href="#绘制世界" aria-hidden="true">#</a> 绘制世界</h2>
<p>我们可以添加一个绘制世界的功能，讲里面的刚体、关节等都进行绘制：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">//绘画功能</span>
<span class="token keyword">function</span> <span class="token function">drawWorld</span><span class="token punctuation">(</span><span class="token parameter">world<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> world<span class="token punctuation">.</span>m_jointList<span class="token punctuation">;</span> j<span class="token punctuation">;</span> j <span class="token operator">=</span> j<span class="token punctuation">.</span>m_next<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制关节</span>
    <span class="token comment">// drawJoint(j, context);</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> b <span class="token operator">=</span> world<span class="token punctuation">.</span>m_bodyList<span class="token punctuation">;</span> b<span class="token punctuation">;</span> b <span class="token operator">=</span> b<span class="token punctuation">.</span>m_next<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> s <span class="token operator">=</span> b<span class="token punctuation">.</span><span class="token function">GetShapeList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> s <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> s <span class="token operator">=</span> s<span class="token punctuation">.</span><span class="token function">GetNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 绘制刚体形状</span>
      <span class="token comment">// drawShape(s, context);</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="刷新世界" tabindex="-1"><a class="header-anchor" href="#刷新世界" aria-hidden="true">#</a> 刷新世界</h2>
<p>现在我们可以开始模拟循环了，在游戏中模拟循环应该并入游戏循环。每次循环你都应该调用<code v-pre>world.Step(timeStep, iterations)</code>，通常调用一次就够了，这取决于帧频以及物理时间步。</p>
<ul>
<li>时间步 timeStep</li>
</ul>
<p>Box2D 中有一些数学代码构成的积分器(integrator)，积分器在离散的时间点上模拟物理方程，它将与游戏动画循环一同运行。
所以我们需要为 Box2D 选取一个时间步，通常来说游戏物理引擎需要至少 60Hz 的速度，也就是 1/60 的时间步。你可以使用更大的时间步，但是你必须更加小心地为你的世界调整定义。</p>
<ul>
<li>迭代次数 iterations</li>
</ul>
<p>除了积分器之外，Box2D 中还有约束求解器(constraint solver)。约束求解器用于解决模拟中的所有约束，一次一个。
单个的约束会被完美的求解，然而当我们求解一个约束的时候，我们就会稍微耽误另一个。要得到良好的解，我们需要迭代所有约束多次。</p>
<p>建议的 Box2D 迭代次数是 10 次。你可以按自己的喜好去调整这个数，但要记得它是速度与质量之间的平衡。更少的迭代会增加性能并降低精度，同样地，更多的迭代会减少性能但提高模拟质量。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 定义step函数，用于世界的迭代运行</span>
<span class="token keyword">function</span> <span class="token function">step</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">//</span>
  world<span class="token punctuation">.</span><span class="token function">Step</span><span class="token punctuation">(</span><span class="token number">1.0</span> <span class="token operator">/</span> <span class="token number">60</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 清除画布</span>
  ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> canvasWidth<span class="token punctuation">,</span> canvasHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 重新绘制</span>
  <span class="token function">drawWorld</span><span class="token punctuation">(</span>world<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 再次刷新</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span>step<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="完整代码" tabindex="-1"><a class="header-anchor" href="#完整代码" aria-hidden="true">#</a> 完整代码</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> canvas <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"canvas"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> ctx <span class="token operator">=</span> canvas<span class="token punctuation">.</span><span class="token function">getContext</span><span class="token punctuation">(</span><span class="token string">"2d"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> canvasWidth <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>canvas<span class="token punctuation">.</span>width<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> canvasHeight <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>canvas<span class="token punctuation">.</span>height<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> world<span class="token punctuation">;</span>

<span class="token comment">// 我们将创建世界封装至createWorld函数内</span>
<span class="token keyword">function</span> <span class="token function">createWorld</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 世界的大小</span>
  <span class="token keyword">var</span> worldAABB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2AABB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  worldAABB<span class="token punctuation">.</span>minVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">4000</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">4000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  worldAABB<span class="token punctuation">.</span>maxVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token number">4000</span><span class="token punctuation">,</span> <span class="token number">4000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">//定义重力</span>
  <span class="token keyword">var</span> gravity <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2Vec2</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 是否休眠</span>
  <span class="token keyword">var</span> doSleep <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

  <span class="token comment">// 最终创建世界</span>
  <span class="token keyword">var</span> world <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2World</span><span class="token punctuation">(</span>worldAABB<span class="token punctuation">,</span> gravity<span class="token punctuation">,</span> doSleep<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> world<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">//绘画功能</span>
<span class="token keyword">function</span> <span class="token function">drawWorld</span><span class="token punctuation">(</span><span class="token parameter">world<span class="token punctuation">,</span> context</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> world<span class="token punctuation">.</span>m_jointList<span class="token punctuation">;</span> j<span class="token punctuation">;</span> j <span class="token operator">=</span> j<span class="token punctuation">.</span>m_next<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 绘制关节</span>
    <span class="token comment">// drawJoint(j, context);</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> b <span class="token operator">=</span> world<span class="token punctuation">.</span>m_bodyList<span class="token punctuation">;</span> b<span class="token punctuation">;</span> b <span class="token operator">=</span> b<span class="token punctuation">.</span>m_next<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> s <span class="token operator">=</span> b<span class="token punctuation">.</span><span class="token function">GetShapeList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> s <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> s <span class="token operator">=</span> s<span class="token punctuation">.</span><span class="token function">GetNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 绘制刚体形状</span>
      <span class="token comment">// drawShape(s, context);</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 定义step函数，用于游戏的迭代运行</span>
<span class="token keyword">function</span> <span class="token function">step</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 模拟世界</span>
  world<span class="token punctuation">.</span><span class="token function">Step</span><span class="token punctuation">(</span><span class="token number">1.0</span> <span class="token operator">/</span> <span class="token number">60</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 清除画布</span>
  ctx<span class="token punctuation">.</span><span class="token function">clearRect</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> canvasWidth<span class="token punctuation">,</span> canvasHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 重新绘制</span>
  <span class="token function">drawWorld</span><span class="token punctuation">(</span>world<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 再次刷新</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span>step<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"step..."</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 启动游戏</span>
world <span class="token operator">=</span> <span class="token function">createWorld</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">step</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="https://github.com/godbasin/box2djs-tutorial/tree/master/6-practice/6-1-create-and-init-world/6-1-create-and-init-world" target="_blank" rel="noopener noreferrer">此处查看项目代码（仅包含 src 部分）<ExternalLinkIcon/></a><br>
<a href="http://box2d-tutorial.godbasin.com/6-1-create-and-init-world/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


