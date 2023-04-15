<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文我们来细细品味一下整个 Cyclejs 的核心--流，从不一样的角度开始思考吧。</p>
<!--more-->
<h2 id="cycle-js-基础概念" tabindex="-1"><a class="header-anchor" href="#cycle-js-基础概念" aria-hidden="true">#</a> Cycle.js 基础概念</h2>
<p>基础知识什么时候恶补都不为晚。</p>
<h3 id="人机交互" tabindex="-1"><a class="header-anchor" href="#人机交互" aria-hidden="true">#</a> 人机交互</h3>
<p><a href="https://cycle.js.org/dialogue.html" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>用了这么个高大上的词语形容，“对话抽象”(Dialogue abstraction)、“人机交互”(Human-Computer Interaction)，其实主要讲了以下个东西，容我接地气地讲讲。</p>
<p>首先来看配图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/8JS`Y{$TBJ1H){_~O6DI907.png" alt="image"></p>
<p>先不管为什么官方文档要放这么一张逼死强迫症的缺个顶部的图片，这图片主要讲了一个轮回：</p>
<ul>
<li>人 =&gt; 机：通过操作对机器进行输入，例如从键盘输入内容、用鼠标点击某些元素等</li>
<li>机 =&gt; 人：机器拿到输入内容，根据程序进行计算，人通过眼睛观察得到输出</li>
</ul>
<p>其实这里面主要是进行了这样一个抽象：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  经过一些处理<span class="token punctuation">;</span>
  <span class="token keyword">return</span> 输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来看一个简单的场景：操作者需要登录一个页面。</p>
<ol>
<li>对于操作者--人：</li>
</ol>
<ul>
<li>输入 =&gt; 眼睛获得的图像</li>
<li>处理 =&gt; 打开浏览器</li>
<li>输出 =&gt; 输入一个地址，并按 Enter</li>
</ul>
<ol start="2">
<li>对于机器--电脑：</li>
</ol>
<ul>
<li>输入 =&gt; 浏览器获得地址</li>
<li>处理 =&gt; 解析地址，发送请求</li>
<li>输出 =&gt; 返回一个登录页面</li>
</ul>
<ol start="3">
<li>对于操作者--人：</li>
</ol>
<ul>
<li>输入 =&gt; 眼睛获得登录页面</li>
<li>处理 =&gt; 键盘输入帐号密码，登录</li>
<li>输出 =&gt; 上面的一系列操作便是输出</li>
</ul>
<p>以上如此轮回的输入和输出，可以简单理解为人机交互。
其实我们在电脑上进行的每一个操作，每一个按键、鼠标移动的每一下，都可以理解为一次输出，也是电脑的一次输入。
而电脑每一个显示的变动或是不变，也都是输出，同时是人通过眼睛的一次输入。</p>
<p>这里面的输入输出有各种的媒介：
电脑的输入包括键盘、鼠标等，输出包括显示器、音响等。
人的输入包括眼睛、耳朵等，输出包括手脚的移动、说话等。</p>
<p>至于这些媒介，我们可以理解为一个接口，或是在 Cycle.js 里面，可以算是个驱动（Driver）吧，后面章节应该也会讲到。</p>
<h3 id="对话抽象" tabindex="-1"><a class="header-anchor" href="#对话抽象" aria-hidden="true">#</a> 对话抽象</h3>
<p>上面所说的人机交互，只是一层简单的抽象，而且也有比较主观的角度。</p>
<p>这里我们尝试再进行一层抽象，不管是人还是机器，都是这样的物体：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  经过一些处理<span class="token punctuation">;</span>
  <span class="token keyword">return</span> 输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我们假设，物体和物体之间的交流通过电、光，所以我们得到这样的物体：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    光 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>光
    处理光

    电 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>电
    处理电

    <span class="token comment">// 输出</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">光</span><span class="token operator">:</span> 处理后的光
        <span class="token literal-property property">电</span><span class="token operator">:</span> 处理后的电
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这大概是这个世界中所有物体的抽象了。</p>
<p>这时候你可能会有些疑惑，如果每个物体都是这样，那承接这些光和电的传播途径或者方式呢？</p>
<p>到这里，事情变得有意思了，理所当然地，承接这些光和电的便是我们的世界。
而我们的世界又是什么呢？其实也是这样一个抽象的物体：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">处理器</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    光 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>光
    处理光（传输光）

    电 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>电
    处理电（传输电）

    <span class="token comment">// 输出</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">光</span><span class="token operator">:</span> 处理后的光
        <span class="token literal-property property">电</span><span class="token operator">:</span> 处理后的电
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token function">创建</span><span class="token punctuation">(</span>处理器<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">光</span><span class="token operator">:</span> 创建光源（驱动器）
    电：创建电源（驱动器）
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>说白了，就是世界除了作为一个普通抽象物体，拥有对光和电的处理（例如传播过程减弱等等），同时还有一个特殊的任务：负责创建光和电的驱动。</p>
<p>这个驱动是什么呢？</p>
<h3 id="驱动" tabindex="-1"><a class="header-anchor" href="#驱动" aria-hidden="true">#</a> 驱动</h3>
<p>这个驱动，跟我们平时理解的电脑的驱动有什么区别呢？其实说一样也是一样，说不一样也可以不一样。</p>
<p>其实这里的驱动相当于一些规则，在这里我们理解为对光和电的规则：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">光驱动器</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">创建流</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token function-variable function">天亮了</span><span class="token operator">:</span> <span class="token parameter">监听器</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      创建光
      光<span class="token punctuation">.</span><span class="token function-variable function">改变</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">增强<span class="token operator">/</span>减弱</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        监听器<span class="token punctuation">.</span><span class="token function">通知</span><span class="token punctuation">(</span>增强<span class="token operator">/</span>减弱<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      光<span class="token punctuation">.</span><span class="token function-variable function">停止</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">停止</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        监听器<span class="token punctuation">.</span><span class="token function">通知</span><span class="token punctuation">(</span>停止<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">天黑了</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      光<span class="token punctuation">.</span><span class="token function">消失</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>中文的代码是不是看起来好难懂，简单的说，这里面包括一下规则：</p>
<ol>
<li>光的传播处理（<code v-pre>改变 =&gt; 监听 =&gt; 通知</code>）</li>
<li>光的出现消失（<code v-pre>出现 =&gt; 开始监听</code>, <code v-pre>消失 =&gt; 关闭监听</code>）</li>
</ol>
<p>而所有的抽象物体里，输入和输出都遵守这样的处理。</p>
<p>到这里，我们给这个世界创建了物体，然后规定了光和电的规则，创建世界的时候我们便开始根据设定运作起来。</p>
<h3 id="流" tabindex="-1"><a class="header-anchor" href="#流" aria-hidden="true">#</a> 流</h3>
<p>现在还剩下最后一个概念：流。</p>
<p>其实流是最好理解的，它就是我们上面所说的光和电。</p>
<p>我们创建一个世界之后：</p>
<ol>
<li>流的规则设定好，流开始流动；</li>
<li>流的流动，表现为世界对流的输入 =&gt; 处理 =&gt; 输出；</li>
<li>物体和世界、物体间通过流来进行交流，表现为输入 =&gt; 处理 =&gt; 输出；</li>
<li>若世界消失，流消失，物体无输入也便无输出，表现为消失。</li>
</ol>
<p>[捂脸]感觉自己说的也好抽象，不过这是一个挺有意思的角度。不管 Cycle.js 适不适合用来做项目，但是这样一些新的想法和理念对设计和思路都能拓展空间。</p>
<p>这样的思路拓展到我们的页面中，便有了 Cycle.js：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 流的处理</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token constant">DOM</span><span class="token operator">:</span> <span class="token constant">DOM</span>$<span class="token punctuation">,</span> <span class="token comment">// 处理后的DOM流</span>
    <span class="token literal-property property">router</span><span class="token operator">:</span> router$<span class="token punctuation">,</span> <span class="token comment">// 处理后的router流</span>
    <span class="token constant">HTTP</span><span class="token operator">:</span> <span class="token constant">HTTP</span>$ <span class="token comment">// 处理后的HTTP流</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">run</span><span class="token punctuation">(</span>main<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token operator">:</span> <span class="token function">makeDOMDriver</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// DOM驱动</span>
  <span class="token literal-property property">router</span><span class="token operator">:</span> <span class="token function">makeRouterDriver</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 路由驱动</span>
  <span class="token constant">HTTP</span><span class="token operator">:</span> <span class="token function">makeHTTPDriver</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// HTTP驱动</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要发挥本骚年的大脑洞，来进行思想探索。<br>
主要是尝试讲解了一下 Cycle.js 的设计思路，当然这只是本骚年的理解，或许有些理解不到位，甚至完全颠倒的地方，请多多包涵，和仅供参考。</p>
</div></template>


