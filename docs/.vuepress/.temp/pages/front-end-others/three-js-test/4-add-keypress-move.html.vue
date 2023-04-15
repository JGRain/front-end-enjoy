<template><div><p>Three.js 是一个 3D 库，该系列是在使用 three.js 中的一些过程和笔记。本文记录添加按键事件，来控制照相机前后左右移动的基本过程。</p>
<!--more-->
<h1 id="添加移动控制" tabindex="-1"><a class="header-anchor" href="#添加移动控制" aria-hidden="true">#</a> 添加移动控制</h1>
<h2 id="基本思路" tabindex="-1"><a class="header-anchor" href="#基本思路" aria-hidden="true">#</a> 基本思路</h2>
<p>这里我们将添加按键的处理，来控制第一人称（照相机）的移动，基本思路为：</p>
<ul>
<li>添加监听事件</li>
<li>进行按键处理</li>
<li>进行照相机移动</li>
</ul>
<h2 id="添加监听事件" tabindex="-1"><a class="header-anchor" href="#添加监听事件" aria-hidden="true">#</a> 添加监听事件</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加按键时走动</span>
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"keydown"</span><span class="token punctuation">,</span> handleKeyDown<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们监听的是<code v-pre>keydown</code>事件，键盘事件有三个，事件执行的顺序是： keydown-&gt;keypress-&gt;keyup。</p>
<p>但是连续按一个按键的话，会一直触发：keydown keypress。直到你提起按键，会触发 keyup。</p>
<p>而这里我们不使用 keypress，是因为 keypress 对: shift、ctrl、上下键等非字符的输入不会触发。</p>
<h2 id="进行按键处理" tabindex="-1"><a class="header-anchor" href="#进行按键处理" aria-hidden="true">#</a> 进行按键处理</h2>
<p>这里我们需要进行兼容性处理：</p>
<ol>
<li>event</li>
<li>keyCode</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> event <span class="token operator">=</span> event <span class="token operator">||</span> window<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>IE 中有<code v-pre>window.event</code>对象，firefox 没有<code v-pre>window.event</code>对象。
可以通过给函数的参数传递 event 对象。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> keyCode <span class="token operator">=</span> event<span class="token punctuation">.</span>keyCode
  <span class="token operator">?</span> event<span class="token punctuation">.</span>keyCode
  <span class="token operator">:</span> event<span class="token punctuation">.</span>which
  <span class="token operator">?</span> event<span class="token punctuation">.</span>which
  <span class="token operator">:</span> event<span class="token punctuation">.</span>charCode<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>IE 使用<code v-pre>e.keyCode</code>获取按键，FireFox 和 Opera 等使用<code v-pre>e.which</code>获取按键。</p>
<p>然后我们添加按键判断和处理：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 处理按键</span>
<span class="token keyword">function</span> <span class="token function">handleKeyDown</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
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
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"x"</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">38</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">87</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"y"</span><span class="token punctuation">,</span> <span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">39</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">68</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"x"</span><span class="token punctuation">,</span> <span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">83</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">40</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"y"</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里的 CameraMove 是用来处理 camera 的移动的。</p>
<h2 id="进行照相机移动" tabindex="-1"><a class="header-anchor" href="#进行照相机移动" aria-hidden="true">#</a> 进行照相机移动</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token parameter">direction<span class="token punctuation">,</span> distance</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  camera<span class="token punctuation">.</span>position<span class="token punctuation">[</span>direction<span class="token punctuation">]</span> <span class="token operator">+=</span> distance<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候，我们就能通过上下左右或者是 WASD 按键控制照相机的移动。</p>
<p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894019(1).png" alt="image"></p>
<p>移动后：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486906651(1).png" alt="image"></p>
<h2 id="完整代码" tabindex="-1"><a class="header-anchor" href="#完整代码" aria-hidden="true">#</a> 完整代码</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 设置场景</span>
<span class="token keyword">var</span> scene <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Scene</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 创建正交投影照相机</span>
<span class="token keyword">var</span> camera <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PerspectiveCamera</span><span class="token punctuation">(</span>
  <span class="token number">75</span><span class="token punctuation">,</span>
  window<span class="token punctuation">.</span>innerWidth <span class="token operator">/</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">,</span>
  <span class="token number">0.1</span><span class="token punctuation">,</span>
  <span class="token number">1000</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
camera<span class="token punctuation">.</span><span class="token function">lookAt</span><span class="token punctuation">(</span>scene<span class="token punctuation">.</span>position<span class="token punctuation">)</span><span class="token punctuation">;</span>

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
document<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"keydown"</span><span class="token punctuation">,</span> handleKeyDown<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 处理按键</span>
<span class="token keyword">function</span> <span class="token function">handleKeyDown</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
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
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"x"</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">38</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">87</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"y"</span><span class="token punctuation">,</span> <span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">39</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">68</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"x"</span><span class="token punctuation">,</span> <span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token number">83</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token number">40</span><span class="token operator">:</span>
        <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token string">"y"</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">0.1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">CameraMove</span><span class="token punctuation">(</span><span class="token parameter">direction<span class="token punctuation">,</span> distance</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  camera<span class="token punctuation">.</span>position<span class="token punctuation">[</span>direction<span class="token punctuation">]</span> <span class="token operator">+=</span> distance<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这节主要讲了给第一人称（照相机）添加按键事件处理的基本过程。这里我们只考虑了前后左右的移动，包括视觉角度等的都没有进行计算和控制，后面章节我们会把这些方面也一并添加进去处理。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/4-add-keypress-move" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://three-notes.godbasin.com/three-notes-4-add-keypress-move/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


