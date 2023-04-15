<template><div><p>SSR 也算是前端性能优化中最常用的技术方案了，能有效地缩短页面的可见时间，给用户带来很好的体验。</p>
<!--more-->
<p>我们常说的 SSR 指 Server-Side Rendering，即服务端渲染，属于首屏直出渲染的一种方案。</p>
<h1 id="ssr-性能优化" tabindex="-1"><a class="header-anchor" href="#ssr-性能优化" aria-hidden="true">#</a> SSR 性能优化</h1>
<p>首先，我们来看一下 SSR 方案主要优化了哪些地方的性能。</p>
<h2 id="ssr-渲染方案" tabindex="-1"><a class="header-anchor" href="#ssr-渲染方案" aria-hidden="true">#</a> SSR 渲染方案</h2>
<p>一般来说，我们页面加载会分为好几个步骤：</p>
<ol>
<li>请求域名，服务器返回 HTML 资源。</li>
<li>浏览器加载 HTML 片段，识别到有 CSS/JavaScript 资源时，获取资源并加载。</li>
</ol>
<p>现在大多数前端页面都是单页面应用，使用了一些前端框架来渲染页面，因此还会有以下的流程：</p>
<ol start="3">
<li>加载并初始化前端框架、路由库。</li>
<li>根据当前页面路由配置，命中对应的页面组件并进行渲染。</li>
<li>页面组件如果有依赖的资源，则发起请求获取数据后，再进行渲染。</li>
</ol>
<p>到这里，用户才完整地可见到当前页面的内容，并进行操作。可见，页面启动时的加载流程比较长，对应的耗时也都无法避免。</p>
<p>使用 SSR 服务端渲染，可以在第 1 步中直接返回当前页面的内容，浏览器可以直接进行渲染，再加载剩余的其他资源，因此优化效果是十分明显的。除了性能上的优化，SSR 还可以带来更好的 SEO 效果，因为搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。</p>
<p>那一般来说 SSR 技术方案要怎么做呢？其实从上面的过程中，我们也可以推导出，需要根据页面路由和页面内容生成对应的 HTML 内容，用于首次获取 HTML 的时候直接返回。</p>
<h3 id="框架自带-ssr-渲染" tabindex="-1"><a class="header-anchor" href="#框架自带-ssr-渲染" aria-hidden="true">#</a> 框架自带 SSR 渲染</h3>
<p>现在我们大多数前端项目都会使用框架，而许多开源框架也提供了 SSR 能力。由于前端框架本身就负责动态拼接和渲染 HTML 的工作，因此实现 SSR 有天然的便利性。</p>
<p>以 Vue 为例子，Vue 提供了 <a href="https://ssr.vuejs.org/zh/" target="_blank" rel="noopener noreferrer">vue-server-renderer<ExternalLinkIcon/></a> 服务端能力，基本思想基本也是前面说过的：浏览器请求服务端时，服务端完成动态拼接 HTML 的能力，将拼接好的 HTML 直接返回给浏览器，浏览器可以直接渲染页面：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// 省略，可直接查看官网例子：https://ssr.vuejs.org/zh/guide/#%E5%AE%8C%E6%95%B4%E5%AE%9E%E4%BE%8B%E4%BB%A3%E7%A0%81</span>

<span class="token comment">// 服务端收到请求时，生成 HTML 内容并返回</span>
server<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"*"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token comment">// 使用 Vue 实例</span>
  <span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    data<span class="token operator">:</span> <span class="token punctuation">{</span>
      url<span class="token operator">:</span> req<span class="token punctuation">.</span>url<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;div>访问的 URL 是： {{ url }}&lt;/div></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 使用 vue-server-renderer 将 Vue 实例生成最终的 HTML 内容</span>
  renderer<span class="token punctuation">.</span><span class="token function">renderToString</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> context<span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">,</span> html<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token string">"Internal Server Error"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

server<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">8080</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当服务端收到请求时，生成 Vue 实例并依赖<code v-pre>vue-server-renderer</code>的能力，将 Vue 实例生成最终的 HTML 内容。该例子中，服务端直接使用现有资源就可以完成直出 HTML 的拼接.</p>
<p>但是在更多的前端应用场景下，通常还需要服务端动态获取其他的数据，才能完整地拼接出首屏需要的内容。一般来说，我们可以在服务端接到浏览器请求时，同时获取对应的数据，使用这些数据完成 HTML 拼接后再返回给浏览器。</p>
<p>在 Vue SSR 能力中，可以依赖<code v-pre>createApp</code>的能力，引入<code v-pre>Vuex</code>提前获取对应的数据并更新到 Store 中（参考<a href="https://ssr.vuejs.org/zh/guide/data.html" target="_blank" rel="noopener noreferrer">数据预取和状态<ExternalLinkIcon/></a>），然后在服务端收到请求时，创建完整的 Vue 应用的能力：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">const</span> createApp <span class="token operator">=</span> <span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string">"/path/to/built-server-bundle.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

server<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"*"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>req<span class="token punctuation">,</span> res<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> context <span class="token operator">=</span> <span class="token punctuation">{</span> url<span class="token operator">:</span> req<span class="token punctuation">.</span>url <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function">createApp</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    renderer<span class="token punctuation">.</span><span class="token function">renderToString</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> <span class="token punctuation">(</span>err<span class="token punctuation">,</span> html<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">.</span>code <span class="token operator">===</span> <span class="token number">404</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">404</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token string">"Page not found"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          res<span class="token punctuation">.</span><span class="token function">status</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token string">"Internal Server Error"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        res<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="同构-ssr-渲染" tabindex="-1"><a class="header-anchor" href="#同构-ssr-渲染" aria-hidden="true">#</a> 同构 SSR 渲染</h3>
<p>前面我们讲到，Vue 提供了 SSR 的能力，这意味着我们可以使用 Vue 来完成客户端和服务端渲染，因此大部分的代码都可以复用。对于这种一份代码可分别在服务器和客户端上运行，我们成为“同构”。</p>
<p>对比自行实现 SSR 渲染，依赖开源框架提供的同构能力，一套代码可以分别实现 CSR 和 SSR，可大大节省维护成本。</p>
<p>还是以 Vue 为例，使用 Vue 框架实现同构，大概的逻辑如图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/786a415a-5fee-11e6-9c11-45a2cfdf085c.png" alt=""></p>
<p>不管是路由能力，还是组件渲染的能力，要保持同一套代码能分别运行在浏览器和服务端环境（Node.js）中，对于代码的编写则有一定的要求，比如 DOM 操作、window/document 对象等都需要谨慎，这些 <a href="https://ssr.vuejs.org/zh/guide/universal.html" target="_blank" rel="noopener noreferrer">Vue 官方指引<ExternalLinkIcon/></a>也有介绍。</p>
<p>除此之外，服务端的入口逻辑显然会和客户端有差异，比如资源的获取方式、依赖的公共资源有所不一样等等。因此，在打包构建时会区分出两端的入口文件，并对通用逻辑做整合打包。这些内容也都在上面的图中有所体现。</p>
<h3 id="非同构-ssr-渲染" tabindex="-1"><a class="header-anchor" href="#非同构-ssr-渲染" aria-hidden="true">#</a> 非同构 SSR 渲染</h3>
<p>如果我们并没有强依赖前端框架，或是我们的项目过于复杂，此时可能要实现同构需要的成本比较大（抽离通用模块、移除环境依赖代码等）。考虑到项目的确需要 SSR 来加速页面可见，此时我们可以针对首屏渲染内容，自行实现 SSR 渲染。</p>
<p>SSR 核心思想前面也讲过好几遍了，因此要做的事情也比较明确：根据不同的路由，提供对于的页面首屏拼接的能力。由于不强依赖于同构，因此可以直接使用其他语言或是 ejs 来实现首屏 HTML 内容的拼接。</p>
<p>显然，非同构的方案实现 SSR 的成本，比同构的方案成本要高不少，并且还存在代码一致性、可维护性等一系列问题。因此，即使首屏直出的内容无法使用框架同构，大多数情况下，我们也会考虑尽量复用现有的代码，抽离核心的通用代码，并提供 SSR 服务代码编译打包的能力。</p>
<p>举个例子，假设我们的页面完全由 Canvas 进行渲染，显然 Canvas 是无法直出的。但正因为 Canvas 渲染前，需要加载的代码、计算渲染内容等各种流程过长，耗时较多，想要实现 SSR 渲染则可能只能考虑，针对首屏内容做一套 DOM/SVG 渲染用于 SSR。</p>
<p>基于这样的情况下，我们需要尽量复用计算部分的能力，抽离出通用的 Canvas/DOM/SVG 渲染接口，以尽可能实现对接口编程而不是对实现编程。</p>
<h2 id="ssr-利弊" tabindex="-1"><a class="header-anchor" href="#ssr-利弊" aria-hidden="true">#</a> SSR 利弊</h2>
<p>上面主要围绕 SSR 的实现思想，介绍了开源框架 SSR、同构/非同构等 SSR 方案。</p>
<p>其实除了代码实现的部分以外，一个完整的 SSR 方案，还需要考虑：</p>
<ul>
<li>代码构建/部署：代码发布流程中，如何确保 SSR 部分代码的有效性，即不会因为非 SSR 部分代码的变更导致 SSR 服务异常</li>
<li>是否使用 Serverless：是否使用 Serverless 来部署 SSR 服务</li>
<li>是否使用缓存：是否可以将 SSR 部分或是最终生成的 HTML 结果进行缓存，节约服务端计算和拼接成本</li>
</ul>
<p>我们在选择一个技术方案的时候，不能只看它能带来什么收益，同时还需要评估一并带来的风险以及弊端。</p>
<p>对于 SSR 来说，收益是显而易见的，前面也有提到：</p>
<ul>
<li>实现更快的内容到达时间 (time-to-content)</li>
<li>更好的 SEO</li>
</ul>
<p>而其弊端也是客观存在的，包括：</p>
<ul>
<li>服务端资源消耗</li>
<li>方案需要开发成本和维护成本</li>
<li>可能会影响页面最终的完全可交互时间</li>
</ul>
<p>对于最后一点，有时候也会被我们忽略。因为 SSR 在最开始就提供了首屏完整的 HTML 内容，用户可见时间极大地提前了，我们常常会忘了关注页面所有功能加载完成、页面可交互的时间点。显然，由于浏览器需要在首屏时渲染完整的 HTML 内容，该过程也是需要一定的耗时的，所以后面的其他步骤完成的时间点都会有所延迟。如果首屏 HTML 内容很多/复杂的情况下，这种情况会更明显。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>SSR 的内容大概讲到这里，其实在更多的时候，SSR 方案的重点往往是文中一笔带过的弊端。实现一套同构渲染的代码，亦或是维护两套分别用于 CSR/SSR 的代码，这些方案的目的和方向都比较明确。</p>
<p>而 SSR 部署在什么环境、使用服务端还是 Serverless 生成，是否结合缓存实现、缓存更新策略又该是怎样的，如何保证非同构代码的渲染一致性，这些问题才是我们在将 SSR 方案落地过程中，需要反复思考和琢磨的问题。</p>
<p>我们在做方案调研的时候，也常常会过于关注开发成本和最终效果，从而忽略了整个项目和方案过程中的许多可能性。虽然目的的确很重要，但要记住过程也是很重要的。</p>
</div></template>


