<template><div><p>第二章介绍物理世界，包括世界初始化类，以及创建一个世界。</p>
<!--more-->
<h2 id="物理世界" tabindex="-1"><a class="header-anchor" href="#物理世界" aria-hidden="true">#</a> 物理世界</h2>
<h3 id="世界初始化" tabindex="-1"><a class="header-anchor" href="#世界初始化" aria-hidden="true">#</a> 世界初始化</h3>
<p>每个 Box2D 程序都是从一个世界对象(world object)的创建开始的，它是一个管理内存，对象和模拟的中心，在这个世界中，刚体将遵循物理规律运动。</p>
<p>所以，我们首先需要创建一个世界，世界初始化类即用于创建一个世界对象，并设定有关世界的初始参数。</p>
<ul>
<li>创建物理世界</li>
</ul>
<p>利用 Box2D 开发程序时，首先要创建一个世界对象。它负责管理内部一切对象的内存和模拟过程。</p>
<ul>
<li>添加物理边界</li>
</ul>
<p>要创建一个世界中的对象，首先要为世界定义边界区域，Box2D 针对区域内的所有对象进行模拟碰撞，区域的大小并不重要，但更适合的区域将提高程序性能，一般来讲这个区域设置的要比演示区域更大一些，因为一旦对象在运动时到达了边界，它就会被“冻结”并停止一切模拟活动。</p>
<ul>
<li>添加基本力--重力</li>
</ul>
<p>然后要为这个世界设置重力，用向量<code v-pre>b2Vec2(x,y)</code>来表示的，x 代表水平运动，正数向右，负数向左，y 代表垂直运动，正数向下，负数向上；</p>
<p>同时需要定义一个布尔型参数用来表示是否允许睡眠，在这个世界中生成的一切对象的模拟效果都是实时计算出来的，当 doSleep=false 的时候，即使物体停止了运动，计算机还是在不停的进行着运算，其实这是完全不必要的，所以一般都设为 true，这样当物体停止之后就不会进行无谓的 cpu 消耗了。</p>
<ul>
<li>添加物理对象</li>
</ul>
<p>参数都准备好之后，传入 b2World 对象中并将其实例化，这样一个物理引擎的模拟区域就做好了，可以开始加入模拟的对象了。
基本步骤为：</p>
<ol>
<li>创建并定义刚体位置；</li>
<li>给刚体定义皮肤；</li>
<li>用世界对象添加刚体实例;</li>
<li>根据皮肤形状创建模拟图形类：摩擦力、密度、弹力等等；</li>
<li>在刚体上添加模拟图形实例；</li>
<li>根据刚体的密度和面积计算出质量，密度*面积=质量。</li>
</ol>
<ul>
<li>更新状态</li>
</ul>
<p>然后，就可以通过监听帧频率而不断刷新实现让所有对象模拟运动，把上面那两个参数传入世界对象的 Step 方法中即可，同时我们需要遍历世界中的一切对象，并对每个对象的坐标和角度进行更新。</p>
<h2 id="b2world" tabindex="-1"><a class="header-anchor" href="#b2world" aria-hidden="true">#</a> b2World</h2>
<h3 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h3>
<p>b2World 类包含着物体和关节。它管理着模拟的方方面面，并允许异步查询(就像 AABB 查询)。你与 Box2D 的大部分交互都将通过 b2World 对象来完成。</p>
<p>创建一个世界十分的简单。你只需提供一个包围盒和一个重力向量。</p>
<p>轴对齐包围盒(AABB)应该包围着世界。稍微比世界大一些的包围盒可以提升性能，比方 2 倍大小才安全。如果你的许多物体都掉进了深渊，你应该侦测并移除它们。这能提升性能并预防浮点溢出。</p>
<h3 id="创建一个世界" tabindex="-1"><a class="header-anchor" href="#创建一个世界" aria-hidden="true">#</a> 创建一个世界</h3>
<p>创建一个世界，并设置其有效区域的大小，重力大小及方向，以及是否允许休眠等。</p>
<ol>
<li>定义有效区域大小：创建一个<code v-pre>b2AABB</code>类，然后设定其左上角及右下角坐标。有效区域即 box2d 可以发挥作用，反映各种物理规律的区域。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>worldAABB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2AABB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
worldAABB<span class="token punctuation">.</span>minVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1000</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
worldAABB<span class="token punctuation">.</span>maxVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token number">1200</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意 ： worldAABB 应该永远比物体所在的区域要大，让 worldAABB 更大总比太小要好。如果一个物体到达了 worldAABB 的边界，它就会被冻结并停止模拟。</p>
<ol start="2">
<li>设置重力大小及方向：通过定义一个二维矢量来实现，创建一个<code v-pre>b2Vec2</code>类，并在括号中给出其 x，y 方向的大小。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>gravity <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2Vec2</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>备注：gravity 是重力加速度。</p>
<ol start="3">
<li>设置世界是否会休眠：true 即允许休眠，false 不允许休眠。当世界被设置为允许休眠时，物体静止一段时间后会被判定为休眠，直到有碰撞发生或者人为激活。一个休眠中的物体不需要任何模拟。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> doSleep <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="4">
<li>创建世界：利用<code v-pre>b2World</code>创建拥有上述性质的世界。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>world <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2World</span><span class="token punctuation">(</span>worldAABB<span class="token punctuation">,</span> gravity<span class="token punctuation">,</span> doSleep<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="创建一个世界的完整代码" tabindex="-1"><a class="header-anchor" href="#创建一个世界的完整代码" aria-hidden="true">#</a> 创建一个世界的完整代码</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> worldAABB <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2AABB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
worldAABB<span class="token punctuation">.</span>minVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1000</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
worldAABB<span class="token punctuation">.</span>maxVertex<span class="token punctuation">.</span><span class="token function">Set</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> gravity <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2Vec2</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> doSleep <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> world <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">b2World</span><span class="token punctuation">(</span>worldAABB<span class="token punctuation">,</span> gravity<span class="token punctuation">,</span> doSleep<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


