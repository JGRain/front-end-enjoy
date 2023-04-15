<template><div><p>Javascript 包括三块：ECMAScript、DOM 和 BOM，本文主要介绍 DOM 和 BOM。</p>
<!--more-->
<h1 id="dom" tabindex="-1"><a class="header-anchor" href="#dom" aria-hidden="true">#</a> DOM</h1>
<h2 id="什么是-dom" tabindex="-1"><a class="header-anchor" href="#什么是-dom" aria-hidden="true">#</a> 什么是 DOM</h2>
<p>文档对象模型 (<code v-pre>DOM</code>) 是<code v-pre>HTML</code>和<code v-pre>XML</code>文档的编程接口。<br>
<code v-pre>DOM</code>将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。</p>
<p>尽管通常会使用<code v-pre>JavaScript</code>来访问<code v-pre>DOM</code>， 但它并不是<code v-pre>JavaScript</code>的一部分，它也可以被其他语言使用。</p>
<h2 id="dom-解析" tabindex="-1"><a class="header-anchor" href="#dom-解析" aria-hidden="true">#</a> DOM 解析</h2>
<p>我们常见的<code v-pre>HTML</code>元素，在浏览器中会被解析成节点：<br>
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/ct_htmltree.gif" alt="image"></p>
<p>在控制台，我们也能比较清晰地看到这样的层级关系：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/{EA4AA8AF-DB12-4B48-8A6A-E71099D1A942}.png" alt="image"></p>
<p><strong>节点树中的节点彼此拥有层级关系。</strong><br>
父（<code v-pre>parent</code>）、子（<code v-pre>child</code>）和同胞（<code v-pre>sibling</code>）等术语用于描述这些关系。父节点拥有子节点。同级的子节点被称为同胞（兄弟或姐妹）。</p>
<ul>
<li>在节点树中，顶端节点被称为根（<code v-pre>root</code>）</li>
<li>每个节点都有父节点、除了根（它没有父节点）</li>
<li>一个节点可拥有任意数量的子</li>
<li>同胞是拥有相同父节点的节点</li>
</ul>
<p><strong>通过<code v-pre>HTML DOM</code>，树中的所有节点均可通过<code v-pre>JavaScript</code>进行访问。所有<code v-pre>HTML</code>元素（节点）均可被修改，也可以创建或删除节点。</strong></p>
<h2 id="dom-接口" tabindex="-1"><a class="header-anchor" href="#dom-接口" aria-hidden="true">#</a> DOM 接口</h2>
<p><code v-pre>DOM</code>接口主要用于操作<code v-pre>DOM</code>节点，如常见的增删查改。</p>
<p>在 web 和 XML 页面脚本中使用 DOM 时，一些常用的 API 如下：</p>
<ul>
<li><code v-pre>document.getElementById(id)</code>：根据<code v-pre>id</code>获取元素</li>
<li><code v-pre>document.getElementsByTagName(name)</code>：根据<code v-pre>tag</code>获取元素</li>
<li><code v-pre>document.createElement(name)</code>：创建元素</li>
<li><code v-pre>parentNode.appendChild(node)</code>：添加子元素</li>
<li><code v-pre>element.innerHTML</code>：设置/获取元素内容</li>
<li><code v-pre>element.styles</code>：设置/获取元素样式</li>
<li><code v-pre>element.setAttribute()</code>：设置元素属性值</li>
<li><code v-pre>element.getAttribute()</code>：获取元素属性值</li>
<li><code v-pre>element.addEventListener()</code>：添加事件绑定</li>
</ul>
<p>通常什么时候会用呢，最常见的便是列表的维护，包括增加新的选项、删除某个、修改某个等等。</p>
<p>在浏览器兼容性问题很多的时候，我们常常会使用<code v-pre>jQuery</code>来进行些<code v-pre>DOM</code>操作，如今兼容性问题逐渐变少，大家更倾向于用原生<code v-pre>DOM</code>接口来进行操作。</p>
<h2 id="dom-事件流" tabindex="-1"><a class="header-anchor" href="#dom-事件流" aria-hidden="true">#</a> DOM 事件流</h2>
<p>事件流所描述的就是从页面中接受事件的顺序。<br>
<strong>DOM 事件流（<code v-pre>event flow</code>）存在三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。</strong></p>
<ol>
<li>捕获阶段：一开始从文档的根节点流向目标对象；</li>
<li>目标阶段：然后在目标对象上被触发；</li>
<li>冒泡阶段：之后再回溯到文档的根节点。</li>
</ol>
<h3 id="事件捕获" tabindex="-1"><a class="header-anchor" href="#事件捕获" aria-hidden="true">#</a> 事件捕获</h3>
<p>当鼠标点击或者触发 dom 事件时，浏览器会从根节点开始由外到内进行事件传播，即点击了子元素，如果父元素通过事件捕获方式注册了对应的事件的话，会先触发父元素绑定的事件。</p>
<p>在事件捕获的概念下在<code v-pre>p</code>元素上发生<code v-pre>click</code>事件的顺序应该是<code v-pre>document -&gt; html -&gt; body -&gt; div -&gt; p</code>。</p>
<h3 id="事件冒泡" tabindex="-1"><a class="header-anchor" href="#事件冒泡" aria-hidden="true">#</a> 事件冒泡</h3>
<p>与事件捕获恰恰相反，事件冒泡顺序是由内到外进行事件传播，直到根节点。</p>
<p>在事件冒泡的概念下在<code v-pre>p</code>元素上发生<code v-pre>click</code>事件的顺序应该是<code v-pre>p -&gt; div -&gt; body -&gt; html -&gt; document</code>。</p>
<p><strong><code v-pre>DOM</code>标准事件流的触发的先后顺序为：先捕获再冒泡，即当触发 dom 事件时，会先进行事件捕获，捕获到事件源之后通过事件传播进行事件冒泡。</strong></p>
<p>不同的浏览器对此有着不同的实现，IE10 及以下不支持捕获型事件，所以就少了一个事件捕获阶段，IE11、Chrome 、Firefox、Safari 等浏览器则同时存在。</p>
<p>曾经踩过 IE9 中<code v-pre>button</code>的坑，例如<code v-pre>&lt;button&gt;&lt;span&gt;&lt;/span&gt;&lt;/button&gt;</code>，如果我们分别在<code v-pre>button</code>以及<code v-pre>span</code>里均绑定<code v-pre>click</code>事件，则<code v-pre>span</code>的事件不会被触发。不知道这个跟事件机制是否相关呢？</p>
<p><strong>addEventListener</strong>
<code v-pre>addEventListener</code>的第三个参数就是为冒泡和捕获准备的.
<code v-pre>addEventListener</code>有三个参数：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>element<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">,</span> useCapture<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>event</code>：需要绑定的事件</li>
<li><code v-pre>function</code>：触发事件后要执行的函数</li>
<li><code v-pre>useCapture</code>：默认值是 false，表示在事件冒泡阶段调用事件处理函数。如果参数为 true，则表示在事件捕获阶段调用处理函数。</li>
</ul>
<h3 id="事件委托" tabindex="-1"><a class="header-anchor" href="#事件委托" aria-hidden="true">#</a> 事件委托</h3>
<p>基于事件冒泡机制，我们可以实现将子元素的事件委托给父级元素来进行处理。<br>
当我们需要对很多元素添加事件的时候，可以通过将事件添加到它们的父节点而将事件委托给父节点来触发处理函数。</p>
<p>这样能解决什么问题呢？</p>
<ol>
<li>绑定子元素会绑定很多次的绑定，而绑定父元素只需要一次绑定。</li>
<li>将事件委托给父节点，这样我们对子元素的增加和删除、移动等，都不需要重新进行事件绑定。</li>
</ol>
<p>很常见的就是我们有个列表，每个选项都可以进行编辑、删除、添加标签等功能，而把事件委托给父元素或者<code v-pre>document</code>，不管我们新增、删除、更新选项，都不需手动去绑定和移除事件。</p>
<p>最常在<code v-pre>jQuery</code>中使用事件委托：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">$</span><span class="token punctuation">(</span><span class="token string">"#my-list"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">delegate</span><span class="token punctuation">(</span><span class="token string">"button"</span><span class="token punctuation">,</span> <span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// "$(this)"是被click的元素</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"you clicked a button"</span><span class="token punctuation">,</span> <span class="token function">$</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我们基本上都使用框架了，我们可以随意地在元素上绑定事件，如 Vue 中<code v-pre>&lt;div @click=&quot;myClickEvent&quot; /&gt;</code>，因为框架会帮我们用事件委托的方式处理掉，大部分都会绑定在最外层初始化的<code v-pre>id</code>元素，或者是<code v-pre>document</code>吧。</p>
<h2 id="虚拟-dom" tabindex="-1"><a class="header-anchor" href="#虚拟-dom" aria-hidden="true">#</a> 虚拟 DOM</h2>
<p>一个<code v-pre>DOM</code>节点元素，其实是很复杂的，包含了很多的属性和方法。</p>
<p>我们来简单打印一下一个<code v-pre>DOM</code>元素：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1512633321(1).png" alt="image"></p>
<p>看到右边的滚动条了没，有如此之多的属性。</p>
<p>所以随着应用程序越来越复杂，<code v-pre>DOM</code>操作越来越频繁，需要监听事件和在事件回调用更新页面的 DOM 操作也越来越多，性能消耗则会比较大。于是乎，虚拟<code v-pre>DOM</code>的想法便被人提出并实现了。</p>
<p>虚拟<code v-pre>DOM</code>其实是用来模拟真实<code v-pre>DOM</code>的中间产物，主要包括以下功能：</p>
<p><strong>1. 用<code v-pre>JS</code>对象模拟<code v-pre>DOM</code>树，简化<code v-pre>DOM</code>对象。</strong></p>
<p>简单来说，就是用一个对象模拟，保留主要的一些<code v-pre>DOM</code>属性，其他的则去掉。</p>
<p><strong>2. 使用虚拟<code v-pre>DOM</code>，结合操作<code v-pre>DOM</code>的接口，来生成真实<code v-pre>DOM</code>。</strong></p>
<p>使用假<code v-pre>DOM</code>生成真<code v-pre>DOM</code>，同时保持真实<code v-pre>DOM</code>对象的引用，以便 3 步骤的执行。</p>
<p><strong>3. 更新<code v-pre>DOM</code>时，比较两棵虚拟<code v-pre>DOM</code>树的差异，局部更新真实<code v-pre>DOM</code>。</strong></p>
<p>这个就比较有意思，可以根据数据的变化，来最小化地移动、替换、删除原有的<code v-pre>DOM</code>元素。</p>
<p>结合使用以上功能，便能在复杂应用中更好地维护了。而我们现在很多的前端框架，例如 Angular、React、Vue 等，都为了给开发者提供便捷的数据绑定机制、高效的 DOM 更新机制而做了不少的工作，更多的可以参考<RouterLink to="/vue/vue-for-everyone/vue-for-everyone-1.html">《如何理解前端和 Vue》</RouterLink>一文。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.jb51.net/article/55851.htm" target="_blank" rel="noopener noreferrer">《javascript 学习笔记（三）BOM 和 DOM 详解》<ExternalLinkIcon/></a></li>
<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction" target="_blank" rel="noopener noreferrer">DOM | MDN<ExternalLinkIcon/></a></li>
<li><a href="https://coolshell.cn/articles/9666.html" target="_blank" rel="noopener noreferrer">《浏览器的渲染原理简介》<ExternalLinkIcon/></a></li>
<li><a href="http://www.cnblogs.com/bfgis/p/5460191.html" target="_blank" rel="noopener noreferrer">《JavaScript 详说事件机制之冒泡、捕获、传播、委托》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="bom" tabindex="-1"><a class="header-anchor" href="#bom" aria-hidden="true">#</a> BOM</h1>
<h2 id="什么是-bom" tabindex="-1"><a class="header-anchor" href="#什么是-bom" aria-hidden="true">#</a> 什么是 BOM</h2>
<p><code v-pre>BOM</code>是<code v-pre>Browser Object Model</code>，浏览器对象模型。主要处理浏览器窗口和框架，不过通常浏览器特定的<code v-pre>JavaScript</code>扩展都被看做<code v-pre>BOM</code>的一部分。<br>
<code v-pre>BOM</code>是各个浏览器厂商根据<code v-pre>DOM</code>在各自浏览器上的实现，表现为不同浏览器定义有差别，实现方式不同。</p>
<p><code v-pre>javacsript</code>是通过访问<code v-pre>BOM</code>对象来访问、控制、修改客户端(浏览器)。</p>
<h2 id="bom-与-dom" tabindex="-1"><a class="header-anchor" href="#bom-与-dom" aria-hidden="true">#</a> BOM 与 DOM</h2>
<p><code v-pre>DOM</code>（<code v-pre>Document Object Model</code>文档对象模型）是为了操作文档出现的<code v-pre>API</code>，包括<code v-pre>document</code>。<br>
<code v-pre>BOM</code>（<code v-pre>Browser Object Model</code>浏览器对象模型）是为了操作浏览器出现的<code v-pre>API</code>，包括<code v-pre>window</code>/<code v-pre>location</code>/<code v-pre>history</code>等。</p>
<p>由于<code v-pre>BOM</code>的<code v-pre>window</code>包含了<code v-pre>document</code>，换个角度讲，<code v-pre>BOM</code>包含了<code v-pre>DOM</code>(对象)，浏览器提供出来给予访问的是<code v-pre>BOM</code>对象，从<code v-pre>BOM</code>对象再访问到<code v-pre>DOM</code>对象，从而<code v-pre>js</code>可以操作浏览器以及浏览器读取到的文档。</p>
<p>以上都是一些默认或是传说，但其实浏览器对象模型<code v-pre>BOM</code>尚无正式标准。</p>
<h2 id="window-对象" tabindex="-1"><a class="header-anchor" href="#window-对象" aria-hidden="true">#</a> window 对象</h2>
<p>所有浏览器都支持<code v-pre>window</code>对象。它表示浏览器窗口。<br>
所有<code v-pre>JavaScript</code>全局对象、函数以及变量均自动成为<code v-pre>window</code>对象的成员。<br>
全局变量是<code v-pre>window</code>对象的属性，全局函数是<code v-pre>window</code>对象的方法。</p>
<p><code v-pre>window</code>对象包括：</p>
<ul>
<li><code v-pre>window.screen</code>对象：包含有关用户屏幕的信息</li>
<li><code v-pre>window.location</code>对象：用于获得当前页面的地址(URL)，并把浏览器重定向到新的页面</li>
<li><code v-pre>window.history</code>对象：浏览历史的前进后退等</li>
<li><code v-pre>window.navigator</code>对象：常常用来获取浏览器信息、是否移动端访问等等</li>
<li><code v-pre>JavaScript</code>消息框：<code v-pre>alert()</code>等</li>
<li><code v-pre>JavaScript</code>计时：<code v-pre>setTimeout()</code>等</li>
</ul>
<h2 id="参考-1" tabindex="-1"><a class="header-anchor" href="#参考-1" aria-hidden="true">#</a> 参考</h2>
<p><a href="http://www.jb51.net/article/55851.htm" target="_blank" rel="noopener noreferrer">《javascript 学习笔记（三）BOM 和 DOM 详解》<ExternalLinkIcon/></a></p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>DOM 和 BOM，会在我们日常实战中会经常用到，但是很多时候我们都只觉得自己在使用 Javascript。<br>
当我们开始写 node.js 的时候，才会发现其中很多的不一致吧~</p>
</div></template>


