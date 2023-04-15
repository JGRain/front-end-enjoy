<template><div><p>每一个有数据交互的小程序，都会涉及到登录、token 等问题，openid 又是什么呢？怎么使用静默续期，来提升用户体验呢？</p>
<!--more-->
<h1 id="小程序登录" tabindex="-1"><a class="header-anchor" href="#小程序登录" aria-hidden="true">#</a> 小程序登录</h1>
<h2 id="登录时序" tabindex="-1"><a class="header-anchor" href="#登录时序" aria-hidden="true">#</a> 登录时序</h2>
<p>一切的一切，都要从这么一张小程序登录时序图说起：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/授权时序图.jpg" alt="image"></p>
<p>通常情况下，我们的小程序都会有业务身份，如何将微信帐号和业务身份关联起来呢？这个时候我们需要上图的步骤：</p>
<ol>
<li>小程序调用<code v-pre>wx.login()</code>获取临时登录凭证<code v-pre>code</code>。</li>
<li>小程序将<code v-pre>code</code>传到开发者服务器。</li>
<li>开发者服务器以<code v-pre>code</code>换取用户唯一标识<code v-pre>openid</code>和会话密钥<code v-pre>session_key</code>。</li>
<li>开发者服务器可绑定微信用户身份<code v-pre>id</code>和业务用户身份。</li>
<li>开发者服务器可以根据用户标识来生成自定义登录态，用于后续业务逻辑中前后端交互时识别用户身份。</li>
</ol>
<h2 id="相关数据或参数" tabindex="-1"><a class="header-anchor" href="#相关数据或参数" aria-hidden="true">#</a> 相关数据或参数</h2>
<p>上面的登录时序中，我们会涉及到一些数据和参数，先来了解下它们都是用来做啥的。</p>
<p><strong>临时登录凭证 code</strong>
在小程序中调用<code v-pre>wx.login()</code>，能拿到一个<code v-pre>code</code>作为用户登录凭证（有效期五分钟）。在开发者服务器后台，开发者可使用<code v-pre>code</code>换取<code v-pre>openid</code>和<code v-pre>session_key</code>等信息（<code v-pre>code</code>只能使用一次）。</p>
<p><code v-pre>code</code>的设计，主要用于防止黑客使用穷举等方式把业务侧个人信息数据全拉走。</p>
<p><strong>AppId 与 AppSecret</strong>
为了确保拿<code v-pre>code</code>过来换取身份信息的人就是对应的小程序开发者，到微信服务器的请求要同时带上<code v-pre>AppId</code>和<code v-pre>AppSecret</code>。</p>
<p><strong>session_key</strong>
会话密钥<code v-pre>session_key</code>是对用户数据进行加密签名的密钥。<strong>为了应用自身的数据安全，开发者服务器不应该把会话密钥下发到小程序，也不应该对外提供这个密钥。</strong></p>
<p>设计<code v-pre>session_key</code>主要是为了节省流程消耗，如果每次都通过小程序前端<code v-pre>wx.login()</code>生成微信登录凭证<code v-pre>code</code>去微信服务器请求信息，步骤太多会造成整体耗时比较严重。</p>
<p>使用接口<code v-pre>wx.checkSession()</code>可以校验<code v-pre>session_key</code>是否有效。用户越频繁使用小程序，<code v-pre>session_key</code>有效期越长。<code v-pre>session_key</code>失效时，可以通过重新执行登录流程获取有效的<code v-pre>session_key</code>。</p>
<p><strong>openid</strong>
<code v-pre>openid</code>是微信用户<code v-pre>id</code>，可以用这个<code v-pre>id</code>来区分不同的微信用户。
微信针对不同的用户在不同的应用下都有唯一的一个<code v-pre>openid</code>, 但是要想确定用户是不是同一个用户，就需要靠<code v-pre>unionid</code>来区分。</p>
<p><strong>unionid</strong>
如果开发者拥有多个移动应用、网站应用、和公众帐号（包括小程序），可通过<code v-pre>unionid</code>来区分用户的唯一性。同一用户，对同一个微信开放平台下的不同应用，<code v-pre>unionid</code>是相同的。</p>
<h2 id="加锁的登录" tabindex="-1"><a class="header-anchor" href="#加锁的登录" aria-hidden="true">#</a> 加锁的登录</h2>
<p>在某些情况下，我们或许多个地方会同时触发登录逻辑（如多个接口同时拉取，发现登录态过期的情况）。一般来说，我们会简单地给请求加个锁来解决：</p>
<ol>
<li>使用<code v-pre>isLogining</code>来标志是否请求中。</li>
<li>方法返回 Promise，登录态过期时静默续期后重新发起。</li>
<li>使用<code v-pre>sessionId</code>来记录业务侧的登录态。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// session 参数 key（后台吐回）</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">SESSION_KEY</span> <span class="token operator">=</span> <span class="token string">'sessionId'</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> isLogining <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">doLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> session <span class="token operator">=</span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token constant">SESSION_KEY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>session<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 缓存中有 session</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>isLogining<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 正在登录中，请求轮询稍后，避免重复调用登录接口</span>
      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">doLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">res</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token function">resolve</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      isLogining <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      wx<span class="token punctuation">.</span><span class="token function">login</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token function-variable function">success</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>res<span class="token punctuation">.</span>code<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> <span class="token literal-property property">reqData</span><span class="token operator">:</span> ILoginRequest <span class="token operator">=</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">code</span><span class="token operator">:</span> res<span class="token punctuation">.</span>code
            <span class="token punctuation">}</span>
            wx<span class="token punctuation">.</span><span class="token function">request</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
              <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token constant">API</span><span class="token punctuation">.</span>login<span class="token punctuation">,</span>
              <span class="token literal-property property">data</span><span class="token operator">:</span> reqData<span class="token punctuation">,</span>
              <span class="token comment">// method: "POST",</span>
              <span class="token function-variable function">success</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">resp</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                <span class="token keyword">const</span> data <span class="token operator">=</span> resp<span class="token punctuation">.</span>data<span class="token punctuation">;</span>
                isLogining <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token comment">// 保存登录态</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>data<span class="token punctuation">.</span>return_code <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                  wx<span class="token punctuation">.</span><span class="token function">setStorageSync</span><span class="token punctuation">(</span><span class="token constant">SESSION_KEY</span><span class="token punctuation">,</span> data<span class="token punctuation">[</span><span class="token constant">SESSION_KEY</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                  <span class="token function">reject</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>return_msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
              <span class="token punctuation">}</span><span class="token punctuation">,</span>
              <span class="token function-variable function">fail</span><span class="token operator">:</span> <span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                <span class="token comment">// 登录失败，解除锁，防止死锁</span>
                isLogining <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 登录失败，解除锁，防止死锁</span>
            isLogining <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
            <span class="token function">reject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token function-variable function">fail</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token comment">// 登录失败，解除锁，防止死锁</span>
          isLogining <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="登录态静默续期的实现" tabindex="-1"><a class="header-anchor" href="#登录态静默续期的实现" aria-hidden="true">#</a> 登录态静默续期的实现</h1>
<h2 id="checksession" tabindex="-1"><a class="header-anchor" href="#checksession" aria-hidden="true">#</a> checkSession</h2>
<p>前面也提到，微信不会把<code v-pre>session_key</code>的有效期告知开发者，因此需要使用接口<code v-pre>wx.checkSession()</code>来校验<code v-pre>session_key</code>是否有效。</p>
<p>这里我们：</p>
<ol>
<li>使用<code v-pre>isCheckingSession</code>来标志是否查询中。</li>
<li>返回 Promise。</li>
<li>使用<code v-pre>isSessionFresh</code>来标志<code v-pre>session_key</code>是否有效。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> doLogin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./doLogin"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">SESSION_KEY</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./doLogin"</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> isCheckingSession <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> isSessionFresh <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">checkSession</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> Promise<span class="token operator">&lt;</span>string<span class="token operator">></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> session <span class="token operator">=</span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token constant">SESSION_KEY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>isCheckingSession<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">checkSession</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">res</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token function">resolve</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isSessionFresh <span class="token operator">&amp;&amp;</span> session<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      isCheckingSession <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      wx<span class="token punctuation">.</span><span class="token function">checkSession</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token function-variable function">success</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token comment">// session_key 未过期，并且在本生命周期一直有效</span>
          isSessionFresh <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token function-variable function">fail</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token comment">// session_key 已经失效，需要重新执行登录流程</span>
          wx<span class="token punctuation">.</span><span class="token function">removeStorage</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"skey"</span><span class="token punctuation">,</span>
            <span class="token function-variable function">complete</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
              <span class="token function">doLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                  <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token function-variable function">complete</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          isCheckingSession <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">doLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">res</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="静默续期的接口请求" tabindex="-1"><a class="header-anchor" href="#静默续期的接口请求" aria-hidden="true">#</a> 静默续期的接口请求</h2>
<p>至此，我们可以封装一个简单的接口，来在每次登录态过期的时候自动续期：</p>
<ol>
<li>在请求前，使用<code v-pre>checkSession()</code>检车本次周期内<code v-pre>session_key</code>是否有效，无效则<code v-pre>doLogin()</code>拉起登录获取<code v-pre>sessionId</code>。</li>
<li>请求接口，若返回特定登录态失效错误码（此处假设为<code v-pre>LOGIN_FAIL_CODE</code>），则<code v-pre>doLogin()</code>拉起登录获取<code v-pre>sessionId</code>。</li>
<li>使用<code v-pre>tryLoginCount</code>来标志重试次数，<code v-pre>TRY_LOGIN_LIMIT</code>来标志重试次数上限，避免进入死循环。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> doLogin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./doLogin"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">SESSION_KEY</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./doLogin"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> checkSession <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"./checkSession"</span><span class="token punctuation">;</span>

<span class="token comment">// 会话过期错误码，需要重新登录</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">LOGIN_FAIL_CODES</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">10000</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">TRY_LOGIN_LIMIT</span> <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">request</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">obj</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span><span class="token operator">:</span> Promise<span class="token operator">&lt;</span>object<span class="token operator">></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">checkSession</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> session <span class="token operator">=</span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token constant">SESSION_KEY</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">const</span> <span class="token punctuation">{</span> url<span class="token punctuation">,</span> data<span class="token punctuation">,</span> method<span class="token punctuation">,</span> header<span class="token punctuation">,</span> dataType <span class="token punctuation">}</span> <span class="token operator">=</span> obj<span class="token punctuation">;</span>
        <span class="token keyword">let</span> tryLoginCount <span class="token operator">=</span> obj<span class="token punctuation">.</span>tryLoginCount <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token comment">// 如果需要通过 data 把登录态 sessionId 带上</span>
        <span class="token keyword">const</span> dataWithSession <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>data<span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token constant">SESSION_KEY</span><span class="token punctuation">]</span><span class="token operator">:</span> session<span class="token punctuation">,</span> <span class="token literal-property property">appid</span><span class="token operator">:</span> <span class="token constant">APPID</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
        wx<span class="token punctuation">.</span><span class="token function">request</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          url<span class="token punctuation">,</span>
          <span class="token literal-property property">data</span><span class="token operator">:</span> dataWithSession<span class="token punctuation">,</span>
          method<span class="token punctuation">,</span>
          header<span class="token punctuation">,</span>
          dataType<span class="token punctuation">,</span>
          <span class="token function-variable function">success</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">res</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>res<span class="token punctuation">.</span>statusCode <span class="token operator">===</span> <span class="token number">200</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token keyword">const</span> <span class="token literal-property property">data</span><span class="token operator">:</span> ICommonResponse <span class="token operator">=</span> res<span class="token punctuation">.</span>data<span class="token punctuation">;</span>
              <span class="token comment">// 登陆态失效特定错误码判断，且重试次数未达到上限</span>
              <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">LOGIN_FAIL_CODES</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>return_code<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">&amp;&amp;</span> tryLoginCount <span class="token operator">&lt;</span> <span class="token constant">TRY_LOGIN_LIMIT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token function">doLogin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                  obj<span class="token punctuation">.</span>tryLoginCount <span class="token operator">=</span> <span class="token operator">++</span>tryLoginCount<span class="token punctuation">;</span>
                  <span class="token function">request</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span>
                    <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">res</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                      <span class="token function">resolve</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span><span class="token punctuation">)</span>
                    <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                      <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
              <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                <span class="token function">resolve</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
              <span class="token function">reject</span><span class="token punctuation">(</span>res<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token function-variable function">fail</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">err</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span><span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">reject</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，我们大概包装了一个能自动登录或是进行静默续期的一个请求接口。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html" target="_blank" rel="noopener noreferrer">小程序登录API<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/ebook?action=get_post_info&amp;token=935589521&amp;volumn=1&amp;lang=zh_CN&amp;book=miniprogram&amp;docid=000cc48f96c5989b0086ddc7e56c0a" target="_blank" rel="noopener noreferrer">《小程序开发指南》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>小程序的登录和登录态管理，大概是大部分小程序都需要的能力。<code v-pre>code</code>和<code v-pre>session_key</code>的设计，做了哪些事情来保护用户的数据。
如何在全局范围地保证登录态的有效性，微信侧的登录态也好，业务侧的登录态也好，静默续期的能力能给用户带来不少的体验提升。</p>
</div></template>


