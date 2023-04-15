<template><div><p>Three.js 是一个 3D 库，该系列是在使用 three.js 中的一些过程和笔记。本文记录添加鼠标事件，以及调整照相机按照视角进行前后左右移动的基本过程。</p>
<!--more-->
<h1 id="添加鼠标移动控制" tabindex="-1"><a class="header-anchor" href="#添加鼠标移动控制" aria-hidden="true">#</a> 添加鼠标移动控制</h1>
<h2 id="基本思路" tabindex="-1"><a class="header-anchor" href="#基本思路" aria-hidden="true">#</a> 基本思路</h2>
<p>这里我们将添加鼠标移动的处理，来控制第一人称（照相机）的视角的移动，基本思路为：</p>
<ul>
<li>添加监听事件</li>
<li>绑定视角更新（照相机焦点处理）</li>
<li>调整照相机移动方向</li>
</ul>
<p>这里我们添加几个全局变量：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 定义角度</span>
<span class="token keyword">var</span> theta <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token comment">// 初始化鼠标X方向移动值</span>
<span class="token keyword">var</span> mouseX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> r <span class="token operator">=</span> <span class="token number">1000</span> <span class="token operator">/</span> <span class="token punctuation">(</span><span class="token number">2</span> <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token constant">PI</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 用于角度计算： 鼠标移动1000px时，角度改变2PI</span>
<span class="token keyword">var</span> far <span class="token operator">=</span> <span class="token number">20000</span><span class="token punctuation">;</span> <span class="token comment">// 用于照相机焦点设置（焦点距离，越大越精确）</span>
<span class="token keyword">var</span> move <span class="token operator">=</span> <span class="token number">0.1</span><span class="token punctuation">;</span> <span class="token comment">// 用于步长（照相机移动距离）</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中 theta(θ)角度如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486987535(1).png" alt="image"></p>
<h2 id="添加监听事件" tabindex="-1"><a class="header-anchor" href="#添加监听事件" aria-hidden="true">#</a> 添加监听事件</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加鼠标移动时事件</span>
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"mousemove"</span><span class="token punctuation">,</span> handleMousemove<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 添加鼠标进入页面时初始化鼠标位置</span>
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"mouseenter"</span><span class="token punctuation">,</span> initMousePosition<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了正确获取鼠标左右移动距离，我们在鼠标进入页面时会更新鼠标位置：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 初始化鼠标移动值</span>
<span class="token keyword">function</span> <span class="token function">initMousePosition</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  mouseX <span class="token operator">=</span> <span class="token function">getMousePos</span><span class="token punctuation">(</span>e <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们获取鼠标移动距离，这里我们需要处理鼠标位置的兼容性：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 获取鼠标坐标，传入事件event</span>
<span class="token keyword">function</span> <span class="token function">getMousePos</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> e <span class="token operator">=</span> event <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
  <span class="token keyword">var</span> scrollX <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>scrollLeft <span class="token operator">||</span> document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>scrollLeft<span class="token punctuation">;</span>
  <span class="token keyword">var</span> scrollY <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>scrollTop <span class="token operator">||</span> document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>scrollTop<span class="token punctuation">;</span>
  <span class="token keyword">var</span> x <span class="token operator">=</span> e<span class="token punctuation">.</span>pageX <span class="token operator">||</span> e<span class="token punctuation">.</span>clientX <span class="token operator">+</span> scrollX<span class="token punctuation">;</span>
  <span class="token keyword">var</span> y <span class="token operator">=</span> e<span class="token punctuation">.</span>pageY <span class="token operator">||</span> e<span class="token punctuation">.</span>clientY <span class="token operator">+</span> scrollY<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">x</span><span class="token operator">:</span> x<span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> y <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 处理鼠标移动</span>
<span class="token keyword">function</span> <span class="token function">handleMousemove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
  <span class="token comment">// 获取鼠标x坐标</span>
  <span class="token keyword">var</span> newMouseX <span class="token operator">=</span> <span class="token function">getMousePos</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token comment">// 若值无效，更新坐标然后返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>Number<span class="token punctuation">.</span><span class="token function">isNaN</span><span class="token punctuation">(</span><span class="token punctuation">(</span>newMouseX <span class="token operator">-</span> mouseX<span class="token punctuation">)</span> <span class="token operator">/</span> r<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    mouseX <span class="token operator">=</span> newMouseX<span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 更新视角以及坐标位置</span>
  theta <span class="token operator">+=</span> <span class="token punctuation">(</span>newMouseX <span class="token operator">-</span> mouseX<span class="token punctuation">)</span> <span class="token operator">/</span> r<span class="token punctuation">;</span>
  mouseX <span class="token operator">=</span> newMouseX<span class="token punctuation">;</span>

  <span class="token comment">// 更新照相机焦点</span>
  <span class="token function">renderCameraLookat</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="绑定视角更新-照相机焦点处理" tabindex="-1"><a class="header-anchor" href="#绑定视角更新-照相机焦点处理" aria-hidden="true">#</a> 绑定视角更新（照相机焦点处理）</h2>
<p>至于照相机焦点的更新，我们设置焦距为 far，这里初始化为 20000，根据 theta 角度我们可以计算得到：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486987997(1).png" alt="image"></p>
<p>即照相机焦点的坐标等于：
<code v-pre>焦点的x轴坐标 = 照相机x轴坐标 + 焦距far × sin(theta)</code>
<code v-pre>焦点的y轴坐标 = 照相机y轴坐标 + 焦距far × cos(theta)</code></p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 更新照相机焦点</span>
<span class="token keyword">function</span> <span class="token function">renderCameraLookat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  camera<span class="token punctuation">.</span><span class="token function">lookAt</span><span class="token punctuation">(</span>
    <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Vector3</span><span class="token punctuation">(</span>
      camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">+</span> far <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">,</span>
      camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">+</span> far <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token number">1</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="调整照相机移动方向" tabindex="-1"><a class="header-anchor" href="#调整照相机移动方向" aria-hidden="true">#</a> 调整照相机移动方向</h2>
<p>当我们照相机拥有了视觉角度之后，我们的移动方向也不再是 x、y 这样的简单方向了。</p>
<p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486988752(1).png" alt="image"></p>
<p>我们步长为 move，则我们移动的计算公式为：</p>
<ul>
<li>往前 forward：</li>
</ul>
<p><code v-pre>移动后x轴坐标 = 照相机x轴坐标 + 步长move × sin(θ)</code>
<code v-pre>移动后y轴坐标 = 照相机y轴坐标 + 步长move × cos(θ)</code></p>
<ul>
<li>往左 left：</li>
</ul>
<p><code v-pre>移动后x轴坐标 = 照相机x轴坐标 - 步长move × cos(θ)</code>
<code v-pre>移动后y轴坐标 = 照相机y轴坐标 + 步长move × sin(θ)</code></p>
<ul>
<li>往后 backward 则与往前相反：</li>
</ul>
<p><code v-pre>移动后x轴坐标 = 照相机x轴坐标 - 步长move × sin(θ)</code>
<code v-pre>移动后y轴坐标 = 照相机y轴坐标 - 步长move × cos(θ)</code></p>
<ul>
<li>往右 right 则与往左相反：</li>
</ul>
<p><code v-pre>移动后x轴坐标 = 照相机x轴坐标 + 步长move × cos(θ)</code>
<code v-pre>移动后y轴坐标 = 照相机y轴坐标 - 步长move × sin(θ)</code></p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 照相机移动计算，值可能为left/forward/right/backward</span>
<span class="token keyword">function</span> <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token parameter">direction</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> x<span class="token punctuation">,</span> y<span class="token punctuation">;</span>
  <span class="token keyword">var</span> oX <span class="token operator">=</span> camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x<span class="token punctuation">,</span>
    oY <span class="token operator">=</span> camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>direction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token string">"left"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"forward"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"right"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"backward"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">=</span> x<span class="token punctuation">;</span>
  camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">=</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里，我们鼠标移动部分的逻辑代码则完成了。</p>
<h2 id="完整代码" tabindex="-1"><a class="header-anchor" href="#完整代码" aria-hidden="true">#</a> 完整代码</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 定义角度</span>
<span class="token keyword">var</span> theta <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token comment">// 初始化鼠标X方向移动值</span>
<span class="token keyword">var</span> mouseX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> r <span class="token operator">=</span> <span class="token number">1000</span> <span class="token operator">/</span> <span class="token punctuation">(</span><span class="token number">2</span> <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token constant">PI</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 用于角度计算： 鼠标移动1000px时，角度改变2PI</span>
<span class="token keyword">var</span> far <span class="token operator">=</span> <span class="token number">20000</span><span class="token punctuation">;</span> <span class="token comment">// 用于照相机焦点设置（焦点距离，越大越精确）</span>
<span class="token keyword">var</span> move <span class="token operator">=</span> <span class="token number">0.1</span><span class="token punctuation">;</span> <span class="token comment">// 用于步长（照相机移动距离）</span>

<span class="token comment">// 设置场景</span>
<span class="token keyword">var</span> scene <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Scene</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 创建正交投影照相机</span>
<span class="token keyword">var</span> camera <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PerspectiveCamera</span><span class="token punctuation">(</span>
  <span class="token number">75</span><span class="token punctuation">,</span>
  window<span class="token punctuation">.</span>innerWidth <span class="token operator">/</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">,</span>
  <span class="token number">0.1</span><span class="token punctuation">,</span>
  <span class="token number">1000</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
camera<span class="token punctuation">.</span>up <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Vector3</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
camera<span class="token punctuation">.</span><span class="token function">lookAt</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Vector3</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 定义着色器</span>
<span class="token keyword">var</span> renderer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>WebGLRenderer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
renderer<span class="token punctuation">.</span><span class="token function">setSize</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>innerWidth<span class="token punctuation">,</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>
document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>renderer<span class="token punctuation">.</span>domElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 告诉渲染器渲染阴影</span>
renderer<span class="token punctuation">.</span>shadowMap<span class="token punctuation">.</span>enabled <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
renderer<span class="token punctuation">.</span>shadowMap<span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token constant">THREE</span><span class="token punctuation">.</span>PCFSoftShadowMap<span class="token punctuation">;</span>

<span class="token comment">// 添加地板</span>
<span class="token keyword">function</span> <span class="token function">initFloor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> floorGeo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PlaneBufferGeometry</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> floorMaterial <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>MeshStandardMaterial</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">"#aaaaaa"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> floor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Mesh</span><span class="token punctuation">(</span>floorGeo<span class="token punctuation">,</span> floorMaterial<span class="token punctuation">)</span><span class="token punctuation">;</span>
  floor<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  floor<span class="token punctuation">.</span>receiveShadow <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// 接受阴影</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>floor<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> floor<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">var</span> floor <span class="token operator">=</span> <span class="token function">initFloor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 添加物体</span>
<span class="token keyword">function</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token parameter">imageUrl</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> geometry <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>BoxGeometry</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> material<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>imageUrl<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    material <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>MeshLambertMaterial</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">map</span><span class="token operator">:</span> <span class="token constant">THREE</span><span class="token punctuation">.</span>ImageUtils<span class="token punctuation">.</span><span class="token function">loadTexture</span><span class="token punctuation">(</span>imageUrl<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    material <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>MeshLambertMaterial</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">var</span> cube <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Mesh</span><span class="token punctuation">(</span>geometry<span class="token punctuation">,</span> material<span class="token punctuation">)</span><span class="token punctuation">;</span>
  cube<span class="token punctuation">.</span>castShadow <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// 要产生阴影</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cube<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> cube<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 添加物体</span>
<span class="token keyword">var</span> cube1 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token string">"./img/1.jpg"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> cube2 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token string">"./img/2.png"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> cube3 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> cube4 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube1<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube2<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube3<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube4<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 添加聚光灯光源</span>
<span class="token keyword">function</span> <span class="token function">initLight</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> light <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>SpotLight</span><span class="token punctuation">(</span><span class="token number">0xffffff</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  light<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  light<span class="token punctuation">.</span>target <span class="token operator">=</span> floor<span class="token punctuation">;</span> <span class="token comment">// 投射方向指向地板</span>
  light<span class="token punctuation">.</span>castShadow <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// 用于产生阴影</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>light<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 光源的阴影设置</span>
  light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>mapSize<span class="token punctuation">.</span>width <span class="token operator">=</span> <span class="token number">512</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
  light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>mapSize<span class="token punctuation">.</span>height <span class="token operator">=</span> <span class="token number">512</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
  light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>camera<span class="token punctuation">.</span>near <span class="token operator">=</span> <span class="token number">0.5</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
  light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>camera<span class="token punctuation">.</span>far <span class="token operator">=</span> <span class="token number">500</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
  <span class="token keyword">var</span> helper <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>CameraHelper</span><span class="token punctuation">(</span>light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>camera<span class="token punctuation">)</span><span class="token punctuation">;</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>helper<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">initLight</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 让世界动起来</span>
<span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>render<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 此处可添加动画处理</span>
  cube1<span class="token punctuation">.</span>rotation<span class="token punctuation">.</span>x <span class="token operator">+=</span> <span class="token number">0.03</span><span class="token punctuation">;</span>
  cube1<span class="token punctuation">.</span>rotation<span class="token punctuation">.</span>y <span class="token operator">+=</span> <span class="token number">0.03</span><span class="token punctuation">;</span>

  cube2<span class="token punctuation">.</span>rotation<span class="token punctuation">.</span>x <span class="token operator">+=</span> <span class="token number">0.02</span><span class="token punctuation">;</span>
  cube3<span class="token punctuation">.</span>rotation<span class="token punctuation">.</span>y <span class="token operator">+=</span> <span class="token number">0.01</span><span class="token punctuation">;</span>
  cube4<span class="token punctuation">.</span>rotation<span class="token punctuation">.</span>x <span class="token operator">-=</span> <span class="token number">0.04</span><span class="token punctuation">;</span>

  renderer<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>scene<span class="token punctuation">,</span> camera<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 添加文字</span>
<span class="token keyword">var</span> loader <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>FontLoader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
loader<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span><span class="token string">"./js/font.json"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">font</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> mesh <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Mesh</span><span class="token punctuation">(</span>
    <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>TextGeometry</span><span class="token punctuation">(</span><span class="token string">"Please press Up/Down/Ledt/Right or W/A/S/D"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">font</span><span class="token operator">:</span> font<span class="token punctuation">,</span>
      <span class="token literal-property property">size</span><span class="token operator">:</span> <span class="token number">0.4</span><span class="token punctuation">,</span>
      <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">0.1</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>MeshLambertMaterial</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  mesh<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  mesh<span class="token punctuation">.</span>rotation<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">1.2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>mesh<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 添加按键时走动</span>
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"keydown"</span><span class="token punctuation">,</span> handleKeydown<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 添加鼠标移动时事件</span>
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"mousemove"</span><span class="token punctuation">,</span> handleMousemove<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 添加鼠标进入页面时初始化鼠标位置</span>
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"mouseenter"</span><span class="token punctuation">,</span> initMousePosition<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 处理按键</span>
<span class="token keyword">function</span> <span class="token function">handleKeydown</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
  <span class="token keyword">var</span> keyCode <span class="token operator">=</span> event<span class="token punctuation">.</span>keyCode
    <span class="token operator">?</span> event<span class="token punctuation">.</span>keyCode
    <span class="token operator">:</span> event<span class="token punctuation">.</span>which
    <span class="token operator">?</span> event<span class="token punctuation">.</span>which
    <span class="token operator">:</span> event<span class="token punctuation">.</span>charCode<span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token string">"37, 38, 39, 40, 65, 87, 68, 83"</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>keyCode<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>keyCode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token number">37</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">65</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"left"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">38</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">87</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"forward"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">39</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">68</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"right"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">83</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">40</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"backward"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 照相机移动计算</span>
<span class="token keyword">function</span> <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token parameter">direction</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> x<span class="token punctuation">,</span> y<span class="token punctuation">;</span>
  <span class="token keyword">var</span> oX <span class="token operator">=</span> camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x<span class="token punctuation">,</span>
    oY <span class="token operator">=</span> camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>direction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token string">"left"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"forward"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"right"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">+</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"backward"</span><span class="token operator">:</span>
      x <span class="token operator">=</span> oX <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      y <span class="token operator">=</span> oY <span class="token operator">-</span> move <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">=</span> x<span class="token punctuation">;</span>
  camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">=</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 初始化鼠标移动值</span>
<span class="token keyword">function</span> <span class="token function">initMousePosition</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  mouseX <span class="token operator">=</span> <span class="token function">getMousePos</span><span class="token punctuation">(</span>e <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 获取鼠标坐标</span>
<span class="token keyword">function</span> <span class="token function">getMousePos</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> e <span class="token operator">=</span> event <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
  <span class="token keyword">var</span> scrollX <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>scrollLeft <span class="token operator">||</span> document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>scrollLeft<span class="token punctuation">;</span>
  <span class="token keyword">var</span> scrollY <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>scrollTop <span class="token operator">||</span> document<span class="token punctuation">.</span>body<span class="token punctuation">.</span>scrollTop<span class="token punctuation">;</span>
  <span class="token keyword">var</span> x <span class="token operator">=</span> e<span class="token punctuation">.</span>pageX <span class="token operator">||</span> e<span class="token punctuation">.</span>clientX <span class="token operator">+</span> scrollX<span class="token punctuation">;</span>
  <span class="token keyword">var</span> y <span class="token operator">=</span> e<span class="token punctuation">.</span>pageY <span class="token operator">||</span> e<span class="token punctuation">.</span>clientY <span class="token operator">+</span> scrollY<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">x</span><span class="token operator">:</span> x<span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> y <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 处理鼠标移动</span>
<span class="token keyword">function</span> <span class="token function">handleMousemove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> e <span class="token operator">=</span> e <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
  <span class="token comment">// 获取鼠标x坐标</span>
  <span class="token keyword">var</span> newMouseX <span class="token operator">=</span> <span class="token function">getMousePos</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">.</span>x<span class="token punctuation">;</span>
  <span class="token comment">// 若值无效，更新坐标然后返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>Number<span class="token punctuation">.</span><span class="token function">isNaN</span><span class="token punctuation">(</span><span class="token punctuation">(</span>newMouseX <span class="token operator">-</span> mouseX<span class="token punctuation">)</span> <span class="token operator">/</span> r<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    mouseX <span class="token operator">=</span> newMouseX<span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 更新视角以及坐标位置</span>
  theta <span class="token operator">+=</span> <span class="token punctuation">(</span>newMouseX <span class="token operator">-</span> mouseX<span class="token punctuation">)</span> <span class="token operator">/</span> r<span class="token punctuation">;</span>
  mouseX <span class="token operator">=</span> newMouseX<span class="token punctuation">;</span>

  <span class="token comment">// 更新照相机焦点</span>
  <span class="token function">renderCameraLookat</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 更新照相机焦点</span>
<span class="token keyword">function</span> <span class="token function">renderCameraLookat</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  camera<span class="token punctuation">.</span><span class="token function">lookAt</span><span class="token punctuation">(</span>
    <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Vector3</span><span class="token punctuation">(</span>
      camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>x <span class="token operator">+</span> far <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">sin</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">,</span>
      camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span>y <span class="token operator">+</span> far <span class="token operator">*</span> Math<span class="token punctuation">.</span><span class="token function">cos</span><span class="token punctuation">(</span>theta<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token number">1</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这节主要讲了给第一人称（照相机）添加鼠标移动控制视觉方向，并调整移动计算的基本过程。有兴趣的小伙伴，也可以自行完成上下移动视觉的部分。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/5-add-mouse-move" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://three-notes.godbasin.com/three-notes-5-add-mouse-move/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


