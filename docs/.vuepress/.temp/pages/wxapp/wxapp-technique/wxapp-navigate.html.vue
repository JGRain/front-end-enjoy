<template><div><p>小程序页面跳转也是一个很容易踩到坑的开发流程，本文介绍页面跳转相关的一些好用的实践和封装的组件库。</p>
<!--more-->
<h1 id="小程序页面跳转" tabindex="-1"><a class="header-anchor" href="#小程序页面跳转" aria-hidden="true">#</a> 小程序页面跳转</h1>
<p>一个小程序可以有很多页面，每个页面承载不同的功能，页面之间可以互相跳转。我们知道，小程序分为渲染层和逻辑层，渲染层中包含了多个 WebView，每个 WebView 对应到我们的小程序里就是一个页面 Page，每一个页面都独立运行在一个页面层级上，如图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-navigate-1.png" alt=""></p>
<h2 id="页面栈管理" tabindex="-1"><a class="header-anchor" href="#页面栈管理" aria-hidden="true">#</a> 页面栈管理</h2>
<p>一个小程序拥有多个页面，我们知道<code v-pre>wx.navigateTo</code>可以推入一个新的页面。我们看看小程序示例小程序里，在首页使用2次<code v-pre>wx.navigateTo</code>后，页面层级会有三层：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-17.jpg" alt=""></p>
<p>我们把这样的一个页面层级称为页面栈。在小程序中所有页面的路由全部由框架进行管理，框架以栈的形式维护了当前的所有页面。小程序中页面栈最多十层，也就是十个 WebView，如果超过了十个之后，就没法再打开新的页面了。</p>
<p>对于每一个新的页面层级，渲染层都需要进行一些额外的准备工作。在小程序启动前，客户端会提前准备好一个页面层级用于展示小程序的首页。除此以外，每当一个页面层级被用于渲染页面，客户端都会提前开始准备一个新的页面层级，使得每次调用<code v-pre>wx.navigateTo</code>都能够尽快展示一个新的页面。</p>
<h2 id="页面间跳转" tabindex="-1"><a class="header-anchor" href="#页面间跳转" aria-hidden="true">#</a> 页面间跳转</h2>
<p>小程序启动时仅有一个页面层级，而在小程序运行中，页面之间的跳转表现包括这些：</p>
<table>
<thead>
<tr>
<th>API</th>
<th>页面表现</th>
<th>页面栈表现</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>wx.navigateTo</code></td>
<td>保留当前页面，跳转到应用内的某个页面</td>
<td>创建一个新的页面层级</td>
</tr>
<tr>
<td><code v-pre>wx.navigateBack</code></td>
<td>关闭当前页面，返回上一页面或多级页面</td>
<td>销毁一个页面层级</td>
</tr>
<tr>
<td><code v-pre>wx.redirectTo</code></td>
<td>关闭当前页面，跳转到应用内的某个页面</td>
<td>将当前页面层级重新初始化。重新传入页面的初始数据、路径等，视图层清空当前页面层级的渲染结果然后重新渲染页面</td>
</tr>
<tr>
<td><code v-pre>wx.reLaunch</code></td>
<td>关闭所有页面，打开到应用内的某个页面</td>
<td>销毁所有页面层级，再创建一个新的页面层级</td>
</tr>
<tr>
<td><code v-pre>wx.switchTab</code></td>
<td>关闭其他所有非 tabBar 页面，跳转到 tabBar 页面</td>
<td>销毁所有非 tabBa 页面层级，打开tabBar页面层级</td>
</tr>
</tbody>
</table>
<p>上面提到了 tabBar。除了普通的页面跳转，小程序里还支持配置 tabBar。tabBar 就是类似客户端 APP 底部的 tab 切换，为了获得更好的体验，小程序提供了这样的全局组件，在 app.json 文件中设置 tabBar，因此我们小程序会区分 tabBar 页面和非 tabBar 页面。tabBar 页面之间的切换都只会有一个层级，而跳转到非 tabBar 页面之后，就有了页面层级和页面栈的管理。</p>
<h1 id="页面跳转技巧" tabindex="-1"><a class="header-anchor" href="#页面跳转技巧" aria-hidden="true">#</a> 页面跳转技巧</h1>
<p>小程序的 JS 脚本是运行在 JsCore 的线程里，小程序的每个页面各自有一个 WebView 线程进行渲染，所以小程序切换页面时，小程序逻辑层的 JS 脚本运行上下文依旧在同一个 JsCore 线程中。</p>
<p>因为在同一个 JsCore 线程中，我们就会有一些问题会遇到，也可以有一些小技巧来处理。</p>
<h2 id="判断跳转来源" tabindex="-1"><a class="header-anchor" href="#判断跳转来源" aria-hidden="true">#</a> 判断跳转来源</h2>
<p>由于切换页面后，业务逻辑依然在同一个 JsCore 线程中。因此，即使是小程序页面被关闭 unload 之后，如果有原本在执行的逻辑，会继续执行完毕。</p>
<p>在这样的情况下，如果有重定向、跳转等逻辑，在跳转之后后续的逻辑依然会继续执行，这时候如果还有其他的跳转逻辑，可能会导致页面连续跳转，严重的话跳转参数丢书会导致白屏。</p>
<p>为了防止用户自行返回等操作，可以添加当前页面的条件判断是否要执行，页面栈可以通过<code v-pre>getCurrentPages</code>拿到，例如我们可以添加这样的方法处理：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 处理是否有当前路由</span>
<span class="token keyword">function</span> <span class="token function">matchOriginPath</span><span class="token punctuation">(</span><span class="token parameter">originPageUrl</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> currentPages <span class="token operator">=</span> <span class="token function">getCurrentPages</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> currentPage <span class="token operator">=</span> currentPages<span class="token punctuation">[</span>currentPages<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>route<span class="token punctuation">;</span>
  <span class="token comment">// 判断是否设置了特定页面才进行跳转</span>
  <span class="token comment">// 如果设置了，判断当前页面是否特定页面，是才跳转</span>
  <span class="token comment">// 用于判断当前页面是否已经被跳转走（用户手动关闭等）</span>
  <span class="token keyword">const</span> isMatch <span class="token operator">=</span> <span class="token operator">!</span>originPageUrl <span class="token operator">||</span> <span class="token punctuation">(</span>originPageUrl <span class="token operator">&amp;&amp;</span> currentPage<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>originPageUrl<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 如果设置了，当页面路径不匹配，则进行报错提示</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isMatch<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>
      <span class="token string">"matchOriginPath do not match"</span><span class="token punctuation">,</span>
      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">currentPage: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>currentPage<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, originPageUrl: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>originPageUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> isMatch<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过这样的检查方式，我们可以通过传参来判断下是否要检查：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 跳转到页面
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">url</span> 要跳转的页面地址
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">originPageUrl</span> 原始页面地址，用于判断来源是否符合
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">url</span><span class="token operator">:</span> string<span class="token punctuation">,</span> originPageUrl<span class="token operator">?</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 不符合源页面条件则不跳转</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">matchOriginPath</span><span class="token punctuation">(</span>originPageUrl<span class="token operator">!</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    logger<span class="token punctuation">.</span><span class="token constant">RUN</span><span class="token punctuation">(</span><span class="token string">"navigateTo"</span><span class="token punctuation">,</span> <span class="token string">"originPageUrl != currentPage, return"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
  wx<span class="token punctuation">.</span><span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> url <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们跳转的时候可以添加参数，预防页面非预期的跳转：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">'/pages/pageB'</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">'/pages/pageA'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 后面的逻辑在页面跳转之后，不会再生效</span>
<span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">'/pages/pageC'</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">'/pages/pageA'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="跳转传参" tabindex="-1"><a class="header-anchor" href="#跳转传参" aria-hidden="true">#</a> 跳转传参</h2>
<p>小程序提供的跳转相关 API，需要在 url 后面添加参数的方式来传参，但有些时候我们不仅仅需要携带简单的字符串或者数字，我们还可能需要携带一个较大的对象数据。那么这种情况下，由于小程序页面切换依然在同一个 JsCore 上下文，我们可以通过共享对象的方式来传递。</p>
<p>共享对象需要在公共库中存储一个当前跳转的传参内容，同时为了避免页面同时跳转导致传参内容不匹配，我们可以通过一个随机 ID 的方式来标记：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getRandomId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 时间戳（9位） + 随机串（10位）</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span> <span class="token operator">+</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token number">32</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>跳转的时候，我们可以根据 url 传参的方式，还是共享对象传参的方式，来进行不同的判断处理：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">let</span> globalPageParams <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span> <span class="token comment">// 全局页面跳转参数</span>
<span class="token keyword">let</span> <span class="token literal-property property">globalPageParamsId</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span> <span class="token comment">// 全局页面跳转参数Id，用于标识某一次跳转的数据</span>

<span class="token comment">// 跳转时参数处理</span>
<span class="token keyword">function</span> <span class="token function">mangeUrl</span><span class="token punctuation">(</span><span class="token parameter">url<span class="token punctuation">,</span> options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> urlParams<span class="token punctuation">,</span> pageParams <span class="token punctuation">}</span> <span class="token operator">=</span> options<span class="token punctuation">;</span>

  <span class="token comment">// url参数处理</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>urlParams<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    url <span class="token operator">=</span> <span class="token function">addUrlParams</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> urlParams<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 页面参数处理</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pageParams<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    globalPageParams <span class="token operator">=</span> <span class="token function">objectCopy</span><span class="token punctuation">(</span>pageParams<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 获取随机 ID</span>
    globalPageParamsId <span class="token operator">=</span> <span class="token function">getRandomId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 将随机 ID 带入 url 参数中，可用来获取全局参数</span>
    url <span class="token operator">=</span> <span class="token function">addUrlParams</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">randomid</span><span class="token operator">:</span> globalPageParamsId <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    globalPageParams <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
    globalPageParamsId <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> url<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们的跳转方法可以这么处理：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 跳转到页面
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">url</span> 要跳转的页面地址
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">options</span> 要携带的参数信息
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">originPageUrl</span> 原始页面地址，用于判断来源是否符合
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token parameter">url<span class="token punctuation">,</span> options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> originPageUrl</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  url <span class="token operator">=</span> <span class="token function">mangeUrl</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 不符合源页面条件则不跳转</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">matchOriginPath</span><span class="token punctuation">(</span>originPageUrl<span class="token operator">!</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    logger<span class="token punctuation">.</span><span class="token constant">RUN</span><span class="token punctuation">(</span><span class="token string">"navigateTo"</span><span class="token punctuation">,</span> <span class="token string">"originPageUrl != currentPage, return"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  wx<span class="token punctuation">.</span><span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> url <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="结合-component-自动取参" tabindex="-1"><a class="header-anchor" href="#结合-component-自动取参" aria-hidden="true">#</a> 结合 Component 自动取参</h2>
<p>我们有介绍过如何使用 Component 来开发页面，使用 Component 有几个好处：</p>
<ol>
<li>可以通过 Behavior 来拓展组件的通用能力。</li>
<li>可以直接通过定义 properties 来获取页面参数。</li>
</ol>
<blockquote>
<p>页面如何使用 Behavior
看看<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>：事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用<code v-pre>Component</code>构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应<code v-pre>json</code>文件中包含<code v-pre>usingComponents</code>定义段。</p>
</blockquote>
<p>这里配合跳转传参，我们可以省略很多的逻辑。例如我们有一个结果页面，页面展示直接从 url 中取值（如果使用 Page 的 query 方式获取参数，需要自己进行  decodeURIComponent 才能使用，而使用组件的 properties 则不需要）：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// 其他配置省略</span>
  <span class="token literal-property property">properties</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>  <span class="token comment">// 结果类型，成功-success，失败-warn</span>
    <span class="token literal-property property">title</span><span class="token operator">:</span> String<span class="token punctuation">,</span> <span class="token comment">// 主要文案</span>
    <span class="token literal-property property">info</span><span class="token operator">:</span> String <span class="token comment">// 辅助文案</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们这样进行跳转：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">navigateTo</span><span class="token punctuation">(</span><span class="token string">"/pages/result/result"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token comment">// 直接带入参数，result组件可通过properties直接拿到</span>
  <span class="token literal-property property">urlParams</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"success"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token string">"操作成功"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">info</span><span class="token operator">:</span> <span class="token string">"成功就是这么简单"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>则可以直接在模板中显示：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token comment">&lt;!-- 使用的 weui 组件库 --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>page<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>weui-msg</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{{type}}<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{{title}}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name">slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>desc<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{info}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>weui-msg</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果是通过页面传参的方式，则需要通过随机 ID 来获取对应的参数：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 通过随机 ID 获取对应参数</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getPageParams</span><span class="token punctuation">(</span><span class="token parameter">randomId</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>globalPageParamsId <span class="token operator">===</span> randomId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> globalPageParams <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组件中可以通过 properties 来获取随机 ID，然后获取对应参数：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// 其他配置省略</span>
  <span class="token literal-property property">properties</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">randomid</span><span class="token operator">:</span> String<span class="token punctuation">,</span>  <span class="token comment">// 随机 ID</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">onLoad</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 获取参数</span>
      <span class="token keyword">const</span> params <span class="token operator">=</span> <span class="token function">getPageParams</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>randomid<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 处理参数</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体的代码实现，可参考项目代码：<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">wxapp-typescript-demo<ExternalLinkIcon/></a>。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/ebook?action=get_post_info&amp;docid=000a64a29c48b0eb0086f161b5940a" target="_blank" rel="noopener noreferrer">7.2 页面层级准备<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">Component构造器<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer">behaviors<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>使用自定义组件的方式来开发页面，简直不能太赞啦。通过 Behavior 来各种拓展组件的能力，同时还能简化一些取参的逻辑，还是特别方便的。</p>
</div></template>


