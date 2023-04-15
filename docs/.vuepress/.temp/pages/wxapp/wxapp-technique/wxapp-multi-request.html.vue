<template><div><p>小程序里面多个页面，有时候会需要用到同一个接口的数据。而这些数据全局来说只需要拉取一遍，如果要存到缓存，要怎么保证其他页面取缓存的时候，数据已经拉取回来了呢？</p>
<!--more-->
<h1 id="多页面接口数据缓存实现" tabindex="-1"><a class="header-anchor" href="#多页面接口数据缓存实现" aria-hidden="true">#</a> 多页面接口数据缓存实现</h1>
<h2 id="思路设计" tabindex="-1"><a class="header-anchor" href="#思路设计" aria-hidden="true">#</a> 思路设计</h2>
<p>其实这种场景和实现方式，与小程序关系并不大，很多常见的应用开发都会遇到。这次刚好在小程序里用到了，就顺便做下记录。</p>
<p>在这里，我们假设需要全局拉取一个用户信息。在涉及异步请求中，我们常用的方式是封装成一个<code v-pre>Promise</code>：</p>
<ol>
<li>方法统一对外返回一个<code v-pre>Promise</code>。</li>
<li>加锁，在请求中不再请求，返回缓存的<code v-pre>Promise</code>。</li>
<li>若已有缓存，则返回一个马上<code v-pre>resolve</code>的<code v-pre>Promise</code>。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">let</span> isLoading <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> info <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> promise <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getInfo</span><span class="token punctuation">(</span><span class="token parameter">data <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>info<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isLoading<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> promise<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  isLoading <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">//登录权限接口</span>
    wx<span class="token punctuation">.</span><span class="token function">request</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"your_url"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"GET"</span><span class="token punctuation">,</span>
      data<span class="token punctuation">,</span>
      <span class="token function-variable function">success</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">resolve</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function-variable function">fail</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="稍作优化" tabindex="-1"><a class="header-anchor" href="#稍作优化" aria-hidden="true">#</a> 稍作优化</h2>
<p>这种情况下，我们在一个生命周期中都会只请求一次，其他都只会在缓存中获取。我们还可以做些调整：</p>
<ol>
<li>将数据写入本地缓存，小程序启用的时候获取。</li>
<li>提供强制拉取新数据的配置控制，这里用<code v-pre>needRefresh</code>参数控制。</li>
<li>使用上节<a href="https://godbasin.github.io/2018/11/17/wxapp-login/" target="_blank" rel="noopener noreferrer">《小程序的登录与静默续期》<ExternalLinkIcon/></a>封装的<code v-pre>request</code>方法来发起请求。</li>
</ol>
<p>我们来更新下代码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">let</span> isLoading <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> info <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">try</span> <span class="token punctuation">{</span>
  info <span class="token operator">=</span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token string">'info'</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">let</span> promise <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getInfo</span><span class="token punctuation">(</span><span class="token parameter">data <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> needRefresh <span class="token operator">=</span> <span class="token boolean">false</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>info <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>needRefresh<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span>info<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isLoading<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> promise<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  isLoading <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>promise <span class="token operator">=</span> <span class="token function">request</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"your_url"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"GET"</span><span class="token punctuation">,</span>
    data
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>**Tips:**前面也提到过，小程序的设计很大程度上考虑了管控力。在这里，为了保证小程序不乱用任意域名的服务，<code v-pre>wx.request</code>请求的域名需要在小程序管理平台进行配置，如果小程序正式版使用<code v-pre>wx.request</code>请求未配置的域名，在控制台会有相应的报错。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/api/network-request.html#wxrequestobject" target="_blank" rel="noopener noreferrer">小程序网络API<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/ebook?action=get_post_info&amp;token=935589521&amp;volumn=1&amp;lang=zh_CN&amp;book=miniprogram&amp;docid=000ee27c9c8d98ab0086788fa5b00a" target="_blank" rel="noopener noreferrer">《小程序开发指南》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>前面我们也提到，小程序里面发起请求，都会经过 Native 发起。在应用开发实践中，对一些原理的掌握，很多时候能更多地提升我们解决问题的效率，也能对项目整体有更好的认知。</p>
</div></template>


