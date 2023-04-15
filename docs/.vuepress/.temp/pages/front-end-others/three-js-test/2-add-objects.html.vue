<template><div><p>Three.js 是一个 3D 库，该系列是在使用 three.js 中的一些过程和笔记。本文介绍物体的几何形状和材质等，并记录往场景中添加物体的基本过程。</p>
<!--more-->
<h1 id="物体-object" tabindex="-1"><a class="header-anchor" href="#物体-object" aria-hidden="true">#</a> 物体(Object)</h1>
<h2 id="概要" tabindex="-1"><a class="header-anchor" href="#概要" aria-hidden="true">#</a> 概要</h2>
<p>上一节我们创建了一个初始化的 3D 世界，这一节我们将会往该世界中添加物体。</p>
<p>最常用的一种物体就是网格(Mesh)，网格是由顶点、边、面等组成的物体；其他物体包括线段(Line)、骨骼(Bone)、粒子系统(ParticleSystem，后命名为 Points，其实就是一堆点的集合)等。</p>
<p>在创建物体时，需要传入两个参数，一个是几何形状(Geometry)，另一个是材质(Material)。</p>
<p>其中，几何形状决定了物体的顶点位置等信息，材质决定了物体的颜色、纹理等信息。</p>
<h2 id="几何形状-geometry" tabindex="-1"><a class="header-anchor" href="#几何形状-geometry" aria-hidden="true">#</a> 几何形状(Geometry)</h2>
<p>几何形状(Geometry)最主要的功能是储存了一个物体的顶点信息，通过存储模型用到的点集和点间关系(哪些点构成一个三角形)来达到描述物体形状的目的。</p>
<p>WebGL 需要程序员指定每个顶点的位置，而在 Three.js 中，可以通过指定一些特征来创建几何形状。</p>
<p>Three 提供了立方体(其实是长方体)、平面(其实是长方形)、球体、圆形、圆柱、圆台等许多基本形状。
也可以通过自己定义每个点的位置来构造形状。
对于比较复杂的形状，我们还可以通过外部的模型文件导入。</p>
<h2 id="材质-material" tabindex="-1"><a class="header-anchor" href="#材质-material" aria-hidden="true">#</a> 材质(Material)</h2>
<p>材质(Material)是独立于物体顶点信息之外的与渲染效果相关的属性。通过设置材质可以改变物体的颜色、纹理贴图、光照模式等。</p>
<ul>
<li>
<p>基本材质(BasicMaterial)</p>
<ul>
<li>使用基本材质(BasicMaterial)的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。</li>
<li>如果没有指定材质的颜色，则颜色是随机的。</li>
</ul>
</li>
<li>
<p>Lambert 材质(MeshLambertMaterial)</p>
<ul>
<li>Lambert 材质(MeshLambertMaterial)是符合 Lambert 光照模型的材质</li>
<li>Lambert 光照模型的主要特点是只考虑漫反射而不考虑镜面反射的效果，因而对于金属、镜子等需要镜面反射效果的物体就不适应，对于其他大部分物体的漫反射效果都是适用的</li>
</ul>
</li>
<li>
<p>Phong 材质(MeshPhongMaterial)</p>
<ul>
<li>Phong 材质(MeshPhongMaterial)是符合 Phong 光照模型的材质</li>
<li>和 Lambert 不同的是，Phong 模型考虑了镜面反射的效果，因此对于金属、镜面的表现尤为适合</li>
</ul>
</li>
<li>
<p>法向材质(MeshNormalMaterial)</p>
<ul>
<li>法向材质(MeshNormalMaterial)可以将材质的颜色设置为其法向量的方向，有时候对于调试很有帮助</li>
<li>材质的颜色与照相机与该物体的角度相关</li>
</ul>
</li>
<li>
<p>材质的纹理贴图</p>
<ul>
<li>使用图像作为材质，就需要导入图像作为纹理贴图，并添加到相应的材质中</li>
</ul>
</li>
</ul>
<h1 id="向场景中添加物体" tabindex="-1"><a class="header-anchor" href="#向场景中添加物体" aria-hidden="true">#</a> 向场景中添加物体</h1>
<h2 id="添加地板" tabindex="-1"><a class="header-anchor" href="#添加地板" aria-hidden="true">#</a> 添加地板</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加地板</span>
<span class="token keyword">function</span> <span class="token function">initFloor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> floorGeo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PlaneBufferGeometry</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> floorMaterial <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>MeshBasicMaterial</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">"#aaaaaa"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> floor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Mesh</span><span class="token punctuation">(</span>floorGeo<span class="token punctuation">,</span> floorMaterial<span class="token punctuation">)</span><span class="token punctuation">;</span>
  floor<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>floor<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">initFloor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486885952(1).png" alt="image"></p>
<h2 id="添加正方体" tabindex="-1"><a class="header-anchor" href="#添加正方体" aria-hidden="true">#</a> 添加正方体</h2>
<p>这里我们简单设计一个生成正方体的函数，当传入路径时则设置为材质的纹理贴图：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加物体</span>
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
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cube<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> cube<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，我们添加几个正方体到场景中：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加物体</span>
<span class="token keyword">var</span> cube1 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token string">"./img/1.jpg"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> cube2 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token string">"./img/2.png"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> cube3 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> cube4 <span class="token operator">=</span> <span class="token function">initCube</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube1<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube2<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube3<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
cube4<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1486887050(1).png" alt="image"></p>
<p>这里小伙伴们或许觉得奇怪，为什么正方体是黑色的呢，明明都已经添加材质纹理了呀。</p>
<p>这里我们使用的是 Lambert 材质，对光学有些了解的我们会知道，若没有光照射的时候，这些物体是没有反射的光，所以我们是看不到它们的颜色的。</p>
<p>而对于地板，由于我们使用的是基本材质。
前面也说过，使用基本材质的物体，渲染后物体的颜色始终为该材质的颜色，而不会由于光照产生明暗、阴影效果。故这里我们是可以看到地板的颜色的。</p>
<h2 id="让物体动起来" tabindex="-1"><a class="header-anchor" href="#让物体动起来" aria-hidden="true">#</a> 让物体动起来</h2>
<p>上一节<a href="https://godbasin.github.io/2017/04/13/three-notes-1-init-3d-world/" target="_blank" rel="noopener noreferrer">《three.js 笔记 1--初始化 3D 世界》<ExternalLinkIcon/></a>我们也说过，我们在动画渲染的时候可以添加动画处理，这样我们就能看到动画似的效果。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 让世界动起来</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候我们虽然看不到正方体的颜色，但是我们能看到它们已经动起来了。</p>
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

<span class="token comment">// 添加地板</span>
<span class="token keyword">function</span> <span class="token function">initFloor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> floorGeo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PlaneBufferGeometry</span><span class="token punctuation">(</span><span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> floorMaterial <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>MeshBasicMaterial</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">"#aaaaaa"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> floor <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Mesh</span><span class="token punctuation">(</span>floorGeo<span class="token punctuation">,</span> floorMaterial<span class="token punctuation">)</span><span class="token punctuation">;</span>
  floor<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  scene<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>floor<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">initFloor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.ituring.com.cn/minibook/792" target="_blank" rel="noopener noreferrer">《Three.js 入门指南》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这节主要讲了在初始化完毕后的 3D 世界中添加物体，由于 Lambert 材质的物体为漫反射物体，故我们需要在添加光源之后才能看到它们的效果。下一节将介绍光源的添加。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/three-notes/2-add-objets" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://three-notes.godbasin.com/three-notes-2-add-objects/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


