<template><div><p>Three.js 是一个 3D 库，该系列是在使用 three.js 中的一些过程和笔记。本文记录初始化 3D 世界的基本过程。</p>
<!--more-->
<h1 id="three-js-基础" tabindex="-1"><a class="header-anchor" href="#three-js-基础" aria-hidden="true">#</a> Three.js 基础</h1>
<h2 id="概要" tabindex="-1"><a class="header-anchor" href="#概要" aria-hidden="true">#</a> 概要</h2>
<ul>
<li>
<p>OpenGL
OpenGL 是最常用的跨平台图形库。</p>
</li>
<li>
<p>WebGL
WebGL 是基于 OpenGL 设计的面向 web 的图形标准，提供了一系列 JavaScript API，通过这些 API 进行图形渲染将得以利用图形硬件从而获得较高性能。</p>
</li>
<li>
<p>Three.js
Three.js 是通过对 WebGL 接口的封装与简化而形成的一个易用的图形库。
除了 WebGL 之外，Three.js 还提供了基于 Canvas、SVG 标签的渲染器。</p>
</li>
</ul>
<h2 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念" aria-hidden="true">#</a> 基本概念</h2>
<ul>
<li>
<p>场景(Scene)
场景是所有物体的容器，也对应着我们创建的三维世界。</p>
</li>
<li>
<p>照相机(Camera)
照相机是三维世界中的观察者，为了观察这个世界，首先我们要描述空间中的位置。
Three 中使用采用常见的右手坐标系定位。</p>
</li>
<li>
<p>物体(Object)
创建物体需要指定几何形状和材质。
其中，几何形状决定了物体的顶点位置等信息，材质决定了物体的颜色、纹理等信息。</p>
</li>
<li>
<p>光源(Light)
Three 提供了包括环境光 AmbientLight、点光源 PointLight、 聚光灯 SpotLight、方向光 DirectionalLight、半球光 HemisphereLight 等多种光源。</p>
</li>
<li>
<p>着色器(Renderer)
Renderer 绑定一个 canvas 对象，并可以设置大小，默认背景颜色等属性。
调用 Renderer 的 render 函数，传入 scene 和 camera，就可以把图像渲染到 canvas 中了。</p>
</li>
</ul>
<h1 id="初始化场景" tabindex="-1"><a class="header-anchor" href="#初始化场景" aria-hidden="true">#</a> 初始化场景</h1>
<h2 id="添加基本元素" tabindex="-1"><a class="header-anchor" href="#添加基本元素" aria-hidden="true">#</a> 添加基本元素</h2>
<p>我们创建一个 3D 世界的基本步骤如下：</p>
<ol>
<li>创建场景(Scene)</li>
<li>创建照相机(Camera)</li>
<li>创建着色器(Renderer)，绑定 canvas</li>
<li>加载 renderer 并传入 scene 和 camera</li>
</ol>
<h2 id="创建场景" tabindex="-1"><a class="header-anchor" href="#创建场景" aria-hidden="true">#</a> 创建场景</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 设置场景</span>
<span class="token keyword">var</span> scene <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>Scene</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>场景相关函数
<ul>
<li><code v-pre>scene.add(obj)</code>: 在场景中添加物体</li>
<li><code v-pre>scene.remove(obj)</code>: 在场景中移除物体</li>
<li><code v-pre>scene.children()</code>: 获取场景中所有子对象的列表</li>
<li><code v-pre>scene.getChildByName()</code>: 利用 name 属性，获取场景中某个特定的物体</li>
</ul>
</li>
</ul>
<h2 id="创建照相机" tabindex="-1"><a class="header-anchor" href="#创建照相机" aria-hidden="true">#</a> 创建照相机</h2>
<p>照相机定义了三维空间到二维屏幕的投影方式：</p>
<ul>
<li>
<p>透视投影照相机
<code v-pre>THREE.OrthographicCamera(left, right, top, bottom, near, far)</code>
获得的结果是类似人眼在真实世界中看到的有“近大远小”的效果。</p>
</li>
<li>
<p>正交投影照相机
<code v-pre>THREE.PerspectiveCamera(fov, aspect, near, far)</code>
对于在三维空间内平行的线，投影到二维空间中也一定是平行的。</p>
</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 这里我们创建正交投影照相机</span>
<span class="token keyword">var</span> camera <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>PerspectiveCamera</span><span class="token punctuation">(</span>
  <span class="token number">75</span><span class="token punctuation">,</span>
  window<span class="token punctuation">.</span>innerWidth <span class="token operator">/</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">,</span>
  <span class="token number">0.1</span><span class="token punctuation">,</span>
  <span class="token number">1000</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 设置相机的坐标位置</span>
camera<span class="token punctuation">.</span>position<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 设置相机的焦点</span>
camera<span class="token punctuation">.</span><span class="token function">lookAt</span><span class="token punctuation">(</span>scene<span class="token punctuation">.</span>position<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建着色器" tabindex="-1"><a class="header-anchor" href="#创建着色器" aria-hidden="true">#</a> 创建着色器</h2>
<ul>
<li>
<p>渲染
将模型数据在屏幕上显示出来的过程。</p>
</li>
<li>
<p>着色器
着色器可以用来渲染高级的效果。
Three.js 可不定义着色器，采用默认的方法渲染。</p>
</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 定义着色器</span>
<span class="token keyword">var</span> renderer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>WebGLRenderer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 设置画布宽高</span>
renderer<span class="token punctuation">.</span><span class="token function">setSize</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>innerWidth<span class="token punctuation">,</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 添加到document中</span>
document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>renderer<span class="token punctuation">.</span>domElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里，若我们在 html 中早已添加 canvas，则可通过定义时传入该 canvas 元素来初始化着色器：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>renderer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">THREE<span class="token punctuation">.</span>WebGLRenderer</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">canvas</span><span class="token operator">:</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"canvas_id"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="渲染" tabindex="-1"><a class="header-anchor" href="#渲染" aria-hidden="true">#</a> 渲染</h2>
<p>我们需要调用着色器的<code v-pre>render()</code>方法，同时传入 scene 和 camera 来进行画布渲染：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 渲染</span>
renderer<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>scene<span class="token punctuation">,</span> camera<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>requestAnimationFrame
这个函数就是让浏览器去执行一次参数中的函数，就形成了我们通常所说的游戏循环了。</li>
</ul>
<p>若我们需要场景动起来，则需要添加动画帧渲染：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 让世界动起来</span>
<span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>render<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 此处可添加动画处理</span>

  renderer<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>scene<span class="token punctuation">,</span> camera<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，我们的 3D 世界已初始化完成。
但目前我们无法看到效果，因为我们还未曾给该 3D 世界添加光源和物体，后面章节我们会陆续完善。</p>
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

<span class="token comment">// 让世界动起来</span>
<span class="token keyword">function</span> <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>render<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 此处可添加动画处理</span>

  renderer<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>scene<span class="token punctuation">,</span> camera<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.ituring.com.cn/minibook/792" target="_blank" rel="noopener noreferrer">《Three.js 入门指南》<ExternalLinkIcon/></a></li>
<li><a href="http://www.jb51.net/article/92350.htm" target="_blank" rel="noopener noreferrer">《Three.js 快速入门教程》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这节主要讲了 Three.js 中的一些基本概念，创建并初始化了一个 3D 世界。这里我们并不能看到效果，后面章节会逐步往这个世界中添加光源、物体和一些事件交互。</p>
</div></template>


