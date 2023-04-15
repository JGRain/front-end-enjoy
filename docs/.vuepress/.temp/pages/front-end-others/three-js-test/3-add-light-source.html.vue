<template><div><p>Three.js 是一个 3D 库，该系列是在使用 three.js 中的一些过程和笔记。本文介绍光源的分类，并记录往场景中添加光源的基本过程。</p>
<!--more-->
<h1 id="光源-light" tabindex="-1"><a class="header-anchor" href="#光源-light" aria-hidden="true">#</a> 光源(Light)</h1>
<h2 id="概要" tabindex="-1"><a class="header-anchor" href="#概要" aria-hidden="true">#</a> 概要</h2>
<p>Three.js 提供了包括多种光源：</p>
<ul>
<li>环境光(AmbientLight)</li>
<li>点光源(PointLight)</li>
<li>聚光灯(SpotLight)</li>
<li>平行光(DirectionalLight)</li>
<li>半球光(HemisphereLight)</li>
</ul>
<p>在 Three.js 中，能形成阴影的光源只有<code v-pre>THREE.DirectionalLight</code>与<code v-pre>THREE.SpotLight</code>。而相对地，能表现阴影效果的材质只有<code v-pre>THREE.LambertMaterial</code>与<code v-pre>THREE.PhongMaterial</code>。</p>
<h2 id="环境光-ambientlight" tabindex="-1"><a class="header-anchor" href="#环境光-ambientlight" aria-hidden="true">#</a> 环境光(AmbientLight)</h2>
<p>环境光是指场景整体的光照效果，是由于场景内若干光源的多次反射形成的亮度一致的效果，通常用来为整个场景指定一个基础亮度，弱化阴影或添加一些颜色。
通过更改环境光的颜色可以感受环境光颜色的变化对于在场景中的物体渲染结果的变化。</p>
<p>因此，环境光没有明确的光源位置，在各处形成的亮度也是一致的。</p>
<p>在设置环境光时，只需要指定光的颜色。</p>
<p>创建环境光并将其添加到场景中的完整做法是：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> light <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>AmbientLight</span><span class="token punctuation">(</span><span class="token number">0xffffff</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>light<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="点光源-pointlight" tabindex="-1"><a class="header-anchor" href="#点光源-pointlight" aria-hidden="true">#</a> 点光源(PointLight)</h2>
<p>点光源是不计光源大小，可以看作一个点发出的光源。点光源照到不同物体表面的亮度是线性递减的，因此，离点光源距离越远的物体会显得越暗。</p>
<p>单点发光，就类似于丢在空中的照明弹，该点往四面八方各个方向发光。</p>
<p>创建点光源并将其添加到场景中的完整做法是：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> light <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PointLight</span><span class="token punctuation">(</span><span class="token number">0xffffff</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
light<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1.5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>light<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点光源不能产生阴影，这样的光源会朝着所有的方向发射光线，在这种情况下计算阴影对 GPU 来讲是一个非常沉重的负担。</p>
<h2 id="聚光灯-spotlight" tabindex="-1"><a class="header-anchor" href="#聚光灯-spotlight" aria-hidden="true">#</a> 聚光灯(SpotLight)</h2>
<p>聚光灯是一种特殊的点光源，它能够朝着一个方向投射光线。
聚光灯投射出的是类似圆锥形的光线，这与我们现实中看到的聚光灯是一致的。</p>
<p>其构造函数为：<code v-pre>THREE.SpotLight(hex, intensity, distance, angle, exponent)</code>。</p>
<p>相比点光源，多了<code v-pre>angle</code>和<code v-pre>exponent</code>两个参数。<code v-pre>angle</code>是聚光灯的张角，缺省值是<code v-pre>Math.PI / 3</code>，最大值是<code v-pre>Math.PI / 2</code>；<code v-pre>exponent</code>是光强在偏离<code v-pre>target</code>的衰减指数（<code v-pre>target</code>需要在之后定义，缺省值为(0, 0, 0)），缺省值是 10。</p>
<p>在调用构造函数之后，除了设置光源本身的位置，一般还需要设置 target：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>light<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>x1<span class="token punctuation">,</span> y1<span class="token punctuation">,</span> z1<span class="token punctuation">)</span><span class="token punctuation">;</span>
light<span class="token punctuation">.</span>target<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>x2<span class="token punctuation">,</span> y2<span class="token punctuation">,</span> z2<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>除了设置 light.target.position 的方法外，如果想让聚光灯跟着某一物体移动（就像真的聚光灯！），可以 target 指定为该物体。</p>
<h2 id="平行光-directionallight" tabindex="-1"><a class="header-anchor" href="#平行光-directionallight" aria-hidden="true">#</a> 平行光(DirectionalLight)</h2>
<p>对于任意平行的平面，平行光照射的亮度都是相同的，而与平面所在位置无关。</p>
<p>平行光所有对象接收的光强都是一样的，会产生阴影。
与聚点光源的主要差别是：聚点光源光距离目标越远光越暗淡，而平行光光强都是一样的。</p>
<p>对于平行光而言，设置光源位置尤为重要。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> light <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>DirectionalLight</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
light<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>light<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="向场景中添加光源" tabindex="-1"><a class="header-anchor" href="#向场景中添加光源" aria-hidden="true">#</a> 向场景中添加光源</h1>
<h2 id="添加聚光灯光源" tabindex="-1"><a class="header-anchor" href="#添加聚光灯光源" aria-hidden="true">#</a> 添加聚光灯光源</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加聚光灯光源</span>
<span class="token keyword">function</span> <span class="token function">initLight</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> light <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>SpotLight</span><span class="token punctuation">(</span><span class="token number">0xffffff</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  light<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  light<span class="token punctuation">.</span>target <span class="token operator">=</span> floor<span class="token punctuation">;</span> <span class="token comment">// 投射方向指向地板</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>light<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">initLight</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894019(1).png" alt="image"></p>
<p>可见添加光源之后，我们就可以看到我们的物体了，包括贴上图片材质的 cube 酱们。</p>
<h2 id="添加阴影" tabindex="-1"><a class="header-anchor" href="#添加阴影" aria-hidden="true">#</a> 添加阴影</h2>
<p>前面我们说过，能形成阴影的光源只有<code v-pre>THREE.DirectionalLight</code>与<code v-pre>THREE.SpotLight</code>。</p>
<p>而相对地，能表现阴影效果的材质只有<code v-pre>THREE.LambertMaterial</code>与<code v-pre>THREE.PhongMaterial</code>。</p>
<p>添加阴影我们需要以下步骤：</p>
<ol>
<li>对光源启用阴影</li>
<li>对被照射的物体启用阴影的产生</li>
<li>对投射的物体启用接受阴影</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 对cube启用阴影的产生</span>
cube<span class="token punctuation">.</span>castShadow <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

<span class="token comment">// 对floor接受阴影</span>
floor<span class="token punctuation">.</span>receiveShadow <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

<span class="token comment">// 光源设置</span>
light<span class="token punctuation">.</span>castShadow <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token comment">// 光源的阴影设置</span>
light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>mapSize<span class="token punctuation">.</span>width <span class="token operator">=</span> <span class="token number">512</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>mapSize<span class="token punctuation">.</span>height <span class="token operator">=</span> <span class="token number">512</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>camera<span class="token punctuation">.</span>near <span class="token operator">=</span> <span class="token number">0.5</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>camera<span class="token punctuation">.</span>far <span class="token operator">=</span> <span class="token number">500</span><span class="token punctuation">;</span> <span class="token comment">// default</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894379(1).png" alt="image"></p>
<p>可见我们光源照射到 cube 酱们的阴影投射到了地板上。</p>
<p>光源阴影的设置：</p>
<ul>
<li><code v-pre>shadow.mapSize.width</code>：阴影映射宽度</li>
<li><code v-pre>shadow.mapSize.height</code>：阴影映射高度</li>
<li><code v-pre>shadow.camera.near</code>:投影近点，距离光源多近能产生阴影</li>
<li><code v-pre>shadow.camera.far</code>：投影远点，到哪一点为止不再产生阴影</li>
<li><code v-pre>shadow.camera.fov</code>：投影视场，聚光的角度大小</li>
</ul>
<p>我们还可以开启光源阴影的辅助：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> helper <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>CameraHelper</span><span class="token punctuation">(</span>light<span class="token punctuation">.</span>shadow<span class="token punctuation">.</span>camera<span class="token punctuation">)</span><span class="token punctuation">;</span>
scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>helper<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486894648(1).png" alt="image"></p>
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
<span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.ituring.com.cn/minibook/792" target="_blank" rel="noopener noreferrer">《Three.js 入门指南》<ExternalLinkIcon/></a></li>
<li><a href="http://www.2cto.com/kf/201605/507002.html" target="_blank" rel="noopener noreferrer">《THREE.JS 中常用的 4 种光源》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这节主要讲了光源的几个分类（环境光、平行光、点光源、聚光灯），并记录往场景中添加光源，然后产生阴影的基本过程。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/3-add-light-source" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://three-notes.godbasin.com/three-notes-3-add-light-source/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


