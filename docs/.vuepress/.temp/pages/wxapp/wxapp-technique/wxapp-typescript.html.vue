<template><div><p>[2018.11.14 A 新增 typescript 支持] 小程序开发工具静悄悄地更新了版本，添加上了对 Typescript 的支持。Typescript ??? Typescript !!!</p>
<!--more-->
<h1 id="期待已久的-typescript" tabindex="-1"><a class="header-anchor" href="#期待已久的-typescript" aria-hidden="true">#</a> 期待已久的 Typescript</h1>
<h2 id="为什么要用-typescript" tabindex="-1"><a class="header-anchor" href="#为什么要用-typescript" aria-hidden="true">#</a> 为什么要用 Typescript</h2>
<p>关于 Typescript，可以看看以前写过的这篇<a href="https://godbasin.github.io/2017/09/01/about-typescript/" target="_blank" rel="noopener noreferrer">《关于 Typescript》<ExternalLinkIcon/></a>。文末的故事，便是大多数情况下 Typescript 能帮我们解决的痛点。</p>
<p>过了很久之后，想法还是一样：<strong>Typescript 这事情，当你管理大点的应用的时候，就会感受到它的好处了</strong>。尤其涉及团队配合的时候！</p>
<p>当然，如果你的项目比较小，或是写个小公（工）举（具）、小 demo 的时候， store 状态管理、typescript 编译这些，除非已经很熟悉、没有额外成本的时候，才勉强适合接入。离了具体场景谈架构，都是耍（xia）流（che）氓（dan）。</p>
<p>为什么要用 Typescript？</p>
<h3 id="变量类型不明确" tabindex="-1"><a class="header-anchor" href="#变量类型不明确" aria-hidden="true">#</a> 变量类型不明确</h3>
<p>之前带外包写小程序，除了代码风格不一致之外，还遇到一个会变的变量问题。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">let</span> formGroups <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>currentStep<span class="token punctuation">.</span>formGroups<span class="token punctuation">;</span> <span class="token comment">// 猜猜我的 formGroups 是数组数组 [[], [], []]，还是对象数组 [{}, {}, {}]？</span>
<span class="token keyword">let</span> flattenFields <span class="token operator">=</span> _<span class="token punctuation">.</span><span class="token function">flatten</span><span class="token punctuation">(</span>formGroups<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 不用猜了，我用个 flatten 抹平，它就一定是对象 [{}, {}, {}] 了！</span>

flattenFields<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span>fields<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 猜猜我的 item.fields 是数组还是对象？</span>
    flattenFields<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token operator">...</span>_<span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span>fields<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 不用猜了，我用个 values 抹平，它就一定是对象了！</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当我帮忙 debug 个问题的时候，打断点看到：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-1.png" alt="这好像是个数组？">
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-2.png" alt="这怎么变成个对象？？？"></p>
<p>喵喵喵？？？</p>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code># 我和外包童鞋的对话：
我：话说你这些到底是什么类型，从命名和上下文都看不出来。。
我：得去翻更细的代码。。

外包童鞋：values好像可以改一下试试

我：是数组还是对象？

外包童鞋：有的是数组，有的是对象
外包童鞋：一般带复数的是数组

我：（刀.jpg）
我：卧槽
我：你这item.fields，有时候是数组，有时候是对象，这样真的好吗
我：大哥
我：（刀.jpg）* 2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或许有人想，即使上了 Typescript 也可能会被 any 打败啊。</p>
<p>什么？在我眼皮底下用 any？！！</p>
<h3 id="接口协议不符合" tabindex="-1"><a class="header-anchor" href="#接口协议不符合" aria-hidden="true">#</a> 接口协议不符合</h3>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>前端：帮忙看看这个接口为什么返回失败了？
后台：你这个接口字段少了啊，这个xxx
（哼哧哼哧修改）
前端：帮忙看看这个接口为啥又报错了啊？
后台：你这个字段类型不对...我协议里有写的
前端：喔不好意思我改
（哼哧哼哧修改）
前端：（泪光）帮忙看看这个接口为啥还报错？
后台：...你这字段名拼错了啊！！！！
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，这个案例里稍微夸张了一点，一般我们都会自己一个个对着协议检查哪里不对，但是很多时候被 bug 光环环绕的时候，你就是发现不了问题。</p>
<p>这个时候，我们就可以用 Typescript 来管理接口啦。</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IDemoResponse</span> <span class="token punctuation">{</span>
  date<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  someNumber<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  otherThing<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>1. 使用约定的变量的时候，会有相关提示</strong>（请忽略我的强行 any）。</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-10.jpg" alt="输入提示"></p>
<p><strong>2. 使用约定以外的属性时候，会报错提示。</strong></p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-11.jpg" alt="错误提示"></p>
<p>除此以外，还有很多很棒的用法呢~</p>
<h3 id="一键调整协议" tabindex="-1"><a class="header-anchor" href="#一键调整协议" aria-hidden="true">#</a> 一键调整协议</h3>
<p>前端和后台协议约定后，就开始各自开发了。但是，我们总会遇到各种各样的问题，可能导致我们的协议变更。</p>
<p>字段的变更什么的最讨厌了，例如后台要把某个接口下<code v-pre>date</code>改成<code v-pre>day</code>。一般来说前端是拒绝的，你不能说让我改我就得改，我得看看我写了多少代码，评估下工作量。</p>
<p>什么，全局替换？你知道使用<code v-pre>date</code>多普遍吗？万一我替换错了咋办？？</p>
<p>这时候，如果你使用了 Typescript 并定义了协议接口的话，就很好办了~</p>
<p>依然是这段代码：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">interface</span> <span class="token class-name">IDemoResponse</span> <span class="token punctuation">{</span>
  date<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  someNumber<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  otherThing<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> demoResponse<span class="token operator">:</span> IDemoResponse <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token keyword">as</span> <span class="token builtin">any</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> date <span class="token operator">=</span> demoResponse<span class="token punctuation">.</span>date<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>1. 选中需要重命名的属性。</strong></p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-12.jpg" alt="选中需要重命名的属性"></p>
<p><strong>2. 按下 F2，重新输入属性名。</strong></p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-13.jpg" alt="选中需要重命名的属性"></p>
<p><strong>3. 按下回车，使用到的地方都会更新。</strong></p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-14.jpg" alt="属性更新"></p>
<p>是不是很酷~~~</p>
<h3 id="跨过-babel-直接使用-es6-es7-跨过-eslint-直接使用-prettier" tabindex="-1"><a class="header-anchor" href="#跨过-babel-直接使用-es6-es7-跨过-eslint-直接使用-prettier" aria-hidden="true">#</a> 跨过 Babel 直接使用 ES6/ES7，跨过 eslint 直接使用 prettier</h3>
<p>其实小程序工具本身也支持了不少的 ES6 新语法，不过像<code v-pre>async/await</code>这种，则还是需要自己搞个 Babel 来编译。</p>
<p>现在直接上 Typescript，连 Babel 都可以直接跳过啦。</p>
<p><strong>Prettier</strong></p>
<p>这里重点推荐 <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">prettier<ExternalLinkIcon/></a> 神器，也是团队配合的好工具啊：</p>
<ul>
<li>项目代码没有配 eslint？导致每次拉下来的代码一大堆冲突？</li>
<li>团队成员使用不同的编辑器？有的没有自动格式化？导致拉下来代码还是一堆冲突？</li>
<li>用 standard？有些规范和实际项目不符合，但是偏偏没得改？？</li>
</ul>
<p>偷偷地往项目里装个 Prettier，然后所有的矛盾都不见啦。不管你的代码格式多独特，最终在 Git commit 的时候，就被同化啦，而且 Prettier 的格式化也不会影响到 Git 记录。</p>
<h2 id="小程序与-typescript" tabindex="-1"><a class="header-anchor" href="#小程序与-typescript" aria-hidden="true">#</a> 小程序与 Typescript</h2>
<h3 id="typescript-编译下就可以用" tabindex="-1"><a class="header-anchor" href="#typescript-编译下就可以用" aria-hidden="true">#</a> Typescript 编译下就可以用？</h3>
<p>其实小程序它最终运行的还是 Javascript，那不是我们直接自己编译下就好了吗？</p>
<p>少年你太天真了。咱们写 Typescript 最重要的是什么呀？是 Typing 库呀！</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-3.jpg" alt="没错，就是这货"></p>
<p>网上开源的关于小程序和 Typescript 的工具或者脚手架也一大堆，为啥不用呢？因为小程序的 API 在不断地变化呀~</p>
<p>有了官方的支持，即使小程序的 API 变了，我们也可以及时地更新呀（奸笑）~</p>
<h3 id="开箱即用的尝鲜" tabindex="-1"><a class="header-anchor" href="#开箱即用的尝鲜" aria-hidden="true">#</a> 开箱即用的尝鲜</h3>
<p>既然官方提供支持了，义不容辞地使用呀！</p>
<ol>
<li>首先，我们更新到最近的工具版本，然后创建项目就能看到了：</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-4.jpg" alt="看到了没"></p>
<ol start="2">
<li>创建模版，我们来看看代码长什么样子。</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-5.jpg" alt="嗯，typing 在就足够了"></p>
<p>我们可以看到，在 package.json 里面多了俩脚本，其实也就是将 ts 文件原地编译，然后上传代码的时候忽略掉了。</p>
<ol start="3">
<li>仔细瞧瞧代码。</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-6.jpg" alt="emmmmm"></p>
<p>额，好像混入了一些奇怪的东西进去，感叹号是什么鬼？？？</p>
<p>后面问了下开发 GG，是因为这里比较特殊，目前定义的文件暂时没法兼顾，等后面的版本会兼容。</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-7.jpg" alt="但是还是很棒"></p>
<p>终于用上 Typescript 啦，爽歪歪~</p>
<h3 id="调整下代码结构" tabindex="-1"><a class="header-anchor" href="#调整下代码结构" aria-hidden="true">#</a> 调整下代码结构</h3>
<p>小项目的话，其实也不用带什么编译啦。不过如果你还想用 less，也想用 typescript，还不想看到项目下面乱糟糟的文件：</p>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>index.js
index.ts
index.json
index.less
index.wxss
index.wxml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们就简单弄个 gulp，把编译加上吧~</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-8.jpg" alt="会长这样"></p>
<p>然后我们再把 prettier 愉快地加上。这里就不多讲解啦，大家也可以参考我的 demo 项目:
<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">wxapp-typescript-demo<ExternalLinkIcon/></a></p>
<p>对了，目前官方的 typing 库也不是非常完善，如果需要写组件、插件、小游戏的你，可能会面临一大堆的 any 冲击波噢~</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-typescript-9.jpg" alt="emmmm"></p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html" target="_blank" rel="noopener noreferrer">小程序工具更新<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>Typescript 的普及度其实不算高，小程序的确是又一次给到惊喜。反观下我们自己呢？有没有被业务代码冲得找不到方向呢？<br>
很多时候，我们总爱说写业务没啥技术提升，但真的是这样吗？我看过很棒的业务代码，从框架设计到具体的实现，开发者都对自己做了很高的要求。而写技术需求代码的，就一定会写得很好吗？<br>
“我们是业务部门，技术肯定比不上”<br>
“项目很紧急，怎么快怎么来”<br>
“随便找一些能用的就好了，不要浪费时间在这些上面”<br>
...<br>
以上这些话，我是不认同的。当然项目急的时候可以理解，事后一定要把欠下的债务给还了。（较真脸）</p>
</div></template>


