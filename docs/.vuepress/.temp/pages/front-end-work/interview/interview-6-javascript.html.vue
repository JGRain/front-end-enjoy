<template><div><p>这些年也有不少的面试别人和面试自己的经历，也有好些人来咨询一些前端的面试题目和准备，所以整理一下记录下来。本文针对面试中 Javascript 相关的内容，进行详细的描述。</p>
<!--more-->
<p>不管是小前端还是大前端，我们的开发都离不开 Javascript。关于 Javascript 有太多内容可以讲了，每一个点都可以讲很久很久。本文主要是围绕知识点，来讲述面试可能出现的一些题目。</p>
<h2 id="单线程的-javascript" tabindex="-1"><a class="header-anchor" href="#单线程的-javascript" aria-hidden="true">#</a> 单线程的 Javascript</h2>
<p>要怎么理解 Javascript 是单线程这个概念呢？大概可以从浏览器来说起。</p>
<p><strong>Q:为什么 Javascript 是单线程？</strong>
A:作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。如果 Javascript 是多线程，当页面更新内容的时候、用户又触发了交互，这时候线程间的同步问题会变得很复杂，为了避免复杂性，Javascript 被设计为单线程。</p>
<p>因此我们的 Javascript 是单线程的，这是大前提。</p>
<h3 id="异步任务" tabindex="-1"><a class="header-anchor" href="#异步任务" aria-hidden="true">#</a> 异步任务</h3>
<p>那么这样一个单线程的 Javascript，要如何高效地进行页面的交互和渲染处理呢？Javascript 只有一个线程，意味着任务需要一个接一个地进行，如果这时候我们有一个任务是等待用户输入，那在用户进行操作前，所有其他任务都会等待，页面处于假死状态，体验糟糕。因此，异步任务出现了。</p>
<p><strong>Q: 为什么说 Javascript 是异步的？</strong>
A: I/O 类型的任务会有较长的等待时间。使用异步任务的方式，只要异步任务有了运行结果，再进行处理。这个过程中浏览器就不用处于等待状态，CPU 也可以处理其他任务。</p>
<p>(该问题其实不完全准确，因为 Javascript 中分为同步任务和异步任务，因此我们可以深入回答。)</p>
<p>A: 在浏览器中，任务可以分为同步任务和异步任务两种。同步任务在主线程上排队执行，只有前一个任务执行完毕，才能执行后一个任务。异步任务进入&quot;任务队列&quot;的任务，当该任务完成后，&quot;任务队列&quot;通知主线程，该任务才会进入主线程排队执行。</p>
<p><strong>Q: 在实际使用中异步任务可能会存在什么问题？</strong>
A: <code v-pre>setTimeout</code>、<code v-pre>setInterval</code>的时间精确性。该类方法设置一个定时器，当定时器计时完成，需要执行回调函数，此时才把回调函数放入事件队列中。如果当回调函数放入队列时，假设队列中还有大量的事件没执行，此时就会造成任务执行时间不精确。</p>
<p>（那要怎么提升精确度呢？）</p>
<p>A: 可以使用系统时钟来补偿计时器不准确性。如果你的定时器是一系列的，可以在每次回调任务结束的时候，根据最初的系统时间和该任务的执行时间进行差值比较，来修正后续的定时器时间。</p>
<h3 id="eventloop" tabindex="-1"><a class="header-anchor" href="#eventloop" aria-hidden="true">#</a> EventLoop</h3>
<p>前面我们提到异步任务机制，而 EventLoop 的设计解决了异步任务的同步问题。</p>
<p><strong>Q: 介绍浏览器的 EventLoop。</strong>
A: JavaScript 有一个基于事件循环的并发模型，称为 EventLoop。
Javascript 有一个主线程和调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。同步任务会在调用栈中按照顺序等待主线程依次执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。</p>
<p><strong>Q: 宏任务（MacroTask）和微任务（MicroTask）的区别。</strong></p>
<ul>
<li>宏任务（MacroTask）包括：script全部代码、<code v-pre>setTimeout</code>、<code v-pre>setInterval</code>、<code v-pre>setImmediate</code>(Node独有)、<code v-pre>requestAnimationFrame</code>(浏览器独有)、I/O、UI rendering(浏览器独有)。</li>
<li>微任务（MicroTask）包括：<code v-pre>process.nextTick</code>(Node独有)、<code v-pre>Promise</code>、<code v-pre>Object.observe</code>(废弃)、<code v-pre>MutationObserver</code>。</li>
</ul>
<ol>
<li>宏任务（MacroTask）队列一次只从队列中取一个任务执行，执行完后就去执行微任务（MicroTask）队列中的任务。</li>
<li>微任务（MicroTask）队列中所有的任务都会被依次取出来执行，直到微任务队列为空；</li>
<li>执行 UI rendering 的节点是在执行完所有的微任务（MicroTask）之后，下一个宏任务（MacroTask）之前，紧跟着执行 UI rendering。</li>
</ol>
<blockquote>
<p>篇幅关系，大家可以从以下文章中获取更详细的内容说明：</p>
<ul>
<li><a href="http://www.ruanyifeng.com/blog/2013/10/event_loop.html" target="_blank" rel="noopener noreferrer">什么是 Event Loop？<ExternalLinkIcon/></a></li>
<li><a href="http://www.ruanyifeng.com/blog/2014/10/event-loop.html" target="_blank" rel="noopener noreferrer">JavaScript 运行机制详解：再谈Event Loop<ExternalLinkIcon/></a></li>
<li><a href="https://juejin.im/post/5c3d8956e51d4511dc72c200" target="_blank" rel="noopener noreferrer">一次弄懂Event Loop（彻底解决此类面试问题）<ExternalLinkIcon/></a></li>
<li><a href="https://juejin.im/post/5b8f76675188255c7c653811" target="_blank" rel="noopener noreferrer">带你彻底弄懂Event Loop<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<p>这里可能会出各式各样的题目，考察包括：</p>
<ul>
<li>浏览器中，<code v-pre>setTimeout</code>、<code v-pre>Promise</code>和<code v-pre>async</code>/<code v-pre>await</code>的执行顺序</li>
<li>Node.js 中，<code v-pre>setTimeout</code>、<code v-pre>setImmediate</code>和<code v-pre>process.nextTick</code>的执行顺序</li>
</ul>
<blockquote>
<p>这里就不写具体题目了，大家可以参考上面的文章，或者自行搜一下题目看看，理解原理了比死记硬背要好得多。</p>
</blockquote>
<h3 id="web-workers-service-workers" tabindex="-1"><a class="header-anchor" href="#web-workers-service-workers" aria-hidden="true">#</a> Web Workers/Service Workers</h3>
<p>现在硬件的性能也越来越强了，为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准。</p>
<p><strong>Q: 介绍一下 Web Workers。</strong>
A: Web Workers 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。</p>
<p><strong>Q: Service workers 有什么用途。</strong>
A: Service workers 可拦截并修改访问和资源请求，细粒度地缓存资源，本质上可充当 Web 应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。</p>
<blockquote>
<p>参考内容：</p>
<ul>
<li><a href="http://www.ruanyifeng.com/blog/2018/07/web-worker.html" target="_blank" rel="noopener noreferrer">Web Worker 使用教程<ExternalLinkIcon/></a></li>
<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API" target="_blank" rel="noopener noreferrer">Service Worker API<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h2 id="javascript-的设计" tabindex="-1"><a class="header-anchor" href="#javascript-的设计" aria-hidden="true">#</a> Javascript 的设计</h2>
<p>理解 Javascript 的一些基本设计，日常工作中也有很多帮助，例如可以更优雅地实现一些逻辑，也可以在遇到一些问题的时候快速定位。</p>
<h3 id="原型和继承" tabindex="-1"><a class="header-anchor" href="#原型和继承" aria-hidden="true">#</a> 原型和继承</h3>
<p><strong>Q: 如何理解 Javascript 中的“一切皆对象”？</strong>
A: 当谈到继承时，JavaScript 只有一种结构：对象。
每个实例对象<code v-pre>object</code>都有一个私有属性<code v-pre>__proto__</code>指向它的构造函数的原型对象（prototype ）。该原型对象也有一个自己的原型对象<code v-pre>__proto__</code>，层层向上直到一个对象的原型对象为 null。null 没有原型，并作为这个原型链中的最后一个环节。</p>
<p><strong>Q: 如何理解 Javascript 的原型继承？</strong>
A: JavaScript 对象有一个指向一个原型对象的链。
当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。
函数的继承与其他的属性继承没有差别。需要注意的是，当继承的函数被调用时，<code v-pre>this</code>指向的是当前继承的对象，而不是继承的函数所在的原型对象。</p>
<p><strong>Q: 如何创建一个对象？</strong>
A: 可以使用以下方法：</p>
<ul>
<li>使用语法结构创建的对象，即定义一个数组、函数、对象等</li>
<li>使用构造器创建的对象: <code v-pre>new XXX()</code></li>
<li>使用<code v-pre>Object.create</code>创建对象</li>
<li>使用<code v-pre>class</code>关键字创建对象</li>
</ul>
<p><strong>Q: <strong>proto</strong> 与 prototype 有什么区别？</strong>
A: JavaScript 可以通过<code v-pre>prototype</code>和<code v-pre>__proto__</code>在两个对象之间创建一个关联，使得一个对象就可以通过委托访问另一个对象的属性和函数。当我们创建函数时，Javascript 会为这个函数自动添加<code v-pre>prototype</code>属性，值是一个有<code v-pre>constructor</code>属性的对象。一旦我们通过<code v-pre>new</code>关键字调用，那么 Javascript 就会帮你创建该构造函数的实例，实例通过将<code v-pre>__proto__</code>指向承构造函数的<code v-pre>prototype</code>，来继承构造函数<code v-pre>prototype</code>的所有属性和方法。
对象<code v-pre>__proto__</code>属性的值就是它所对应的原型对象，指向自己构造函数的<code v-pre>prototype</code>。每个对象都有<code v-pre>__proto__</code>属性来标识自己所继承的原型，但只有函数才有<code v-pre>prototype</code>属性。</p>
<blockquote>
<p><code v-pre>__proto__</code>与<code v-pre>prototype</code>可以考的点也很多，这里也不详述了，可以参考下：</p>
<ul>
<li><a href="https://github.com/creeperyang/blog/issues/9" target="_blank" rel="noopener noreferrer">从__proto__和prototype来深入理解JS对象和原型链<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<p><strong>Q: 如何判断对象类型？</strong>
A: 看情境可结合使用以下三种方法：</p>
<ol>
<li><code v-pre>typeof</code>运算符，返回值包括但不限于: <code v-pre>undefined</code>, <code v-pre>boolean</code>, <code v-pre>number</code>, <code v-pre>string</code>, <code v-pre>object</code>。问题：容易混淆<code v-pre>object</code>和<code v-pre>null</code>，会把<code v-pre>Array</code>还有用户自定义函数都返回为<code v-pre>object</code>。</li>
<li><code v-pre>instanceof</code>运算符，判断某一个对象是否是所给的构造函数的一个实例。</li>
<li><code v-pre>constructor</code>属性，返回对创建此对象的数组函数的引用。</li>
</ol>
<h3 id="作用域与闭包" tabindex="-1"><a class="header-anchor" href="#作用域与闭包" aria-hidden="true">#</a> 作用域与闭包</h3>
<p><strong>Q: 请描述以下代码的执行输出内容（题略，考察作用域）。</strong>
A: 当代码在一个环境中执行时，会创建变量对象的一个作用域链，来保证对执行环境有权访问的变量和函数的有序访问。</p>
<blockquote>
<p>考察内容可包括：全局作用域、函数作用域、块级作用域、词法作用域、动态作用域，可参考：</p>
<ul>
<li><a href="https://juejin.im/post/5abb99e9f265da2392366824" target="_blank" rel="noopener noreferrer">谈谈 JavaScript 的作用域<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<p><strong>Q: 什么场景需要使用闭包？</strong>
A: 由于 Javascript 特殊的变量作用域，函数内部可以直接读取全局变量，但在函数外部自然无法读取函数内的局部变量。闭包用途:</p>
<ul>
<li>用于从外部读取其他函数内部变量的函数</li>
<li>可以使用闭包来模拟私有方法</li>
<li>让这些变量的值始终保持在内存中（涉及垃圾回收机制，可能导致内存泄露问题）</li>
</ul>
<blockquote>
<p>可参考:</p>
<ul>
<li><a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures" target="_blank" rel="noopener noreferrer">闭包<ExternalLinkIcon/></a></li>
<li><a href="https://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html" target="_blank" rel="noopener noreferrer">学习Javascript闭包（Closure）<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h3 id="关于-this" tabindex="-1"><a class="header-anchor" href="#关于-this" aria-hidden="true">#</a> 关于 this</h3>
<p><strong>Q: 简单描述 this 在不同场景下的指向。</strong>
A: Javascript 中 <code v-pre>this</code>指针代表的是执行当前代码的对象的所有者，可简单理解为<code v-pre>this</code>永远指向最后调用它的那个对象。
根据 JavaScript 中函数的调用方式不同，分为以下情况：</p>
<ol>
<li>函数作为对象的方法调用：此时<code v-pre>this</code>被自然绑定到该对象。</li>
<li>作为函数调用: 函数可以直接被调用，此时<code v-pre>this</code>绑定到全局对象（在浏览器中为 window）。</li>
<li>作为构造函数调用：如果不使用<code v-pre>new</code>调用，则和普通函数一样。</li>
<li>使用<code v-pre>apply</code>、<code v-pre>call</code>、<code v-pre>bind</code>等方式调用：根据API不同，可切换函数执行的上下文环境，即<code v-pre>this</code>绑定的对象。</li>
</ol>
<p><strong>Q: 手写代码实现 call/apply/bind。</strong>
A: 此处略，请自行谷歌。</p>
<p><strong>Q: 箭头函数与普通函数的区别。</strong>
箭头函数的<code v-pre>this</code>始终指向函数定义时的<code v-pre>this</code>，而非执行时。</p>
<blockquote>
<p>关于 Javascript 的一些设计，可以参考：</p>
<ul>
<li><a href="https://github.com/mqyqingfeng/Blog/issues/17" target="_blank" rel="noopener noreferrer">JavaScript深入系列15篇正式完结！<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h3 id="es6" tabindex="-1"><a class="header-anchor" href="#es6" aria-hidden="true">#</a> ES6+</h3>
<p>ES6/ES7/.../ESn这些都是不断发展的语法糖，虽然可能很多人都没有大量用到，但是一些基本的还是需要掌握的。
推荐阮大神的<a href="https://es6.ruanyifeng.com/" target="_blank" rel="noopener noreferrer">ES6 入门教程<ExternalLinkIcon/></a>，里面讲的特别详细和清晰。</p>
<p><strong>Q: 为什么要使用 Promise？</strong>
Javascript 的单线程设计，导致网络请求、事件监听等都需要异步执行。异步执行通常用回调函数实现，多层的回调会导致回调金字塔的出现。
Promise 允许我们为异步操作的成功和失败分别绑定相应的处理方法（handlers），同时可以通过<code v-pre>Promise.all()</code>、<code v-pre>Promise.race()</code>等方法来同时处理多个异步操作的结果。</p>
<p><strong>Q: 手写代码 or 讲解 Promise、async/await 的实现。</strong>
对于<code v-pre>Promise</code>、<code v-pre>async</code>/<code v-pre>await</code>理解的考察，最简单的就是让描述或者手写它们的实现方式。具体可以参考 MDN 上的内容，也可以找一些 polyfill 来看，也可以看其他人的文章分享，这里就不多说啦。</p>
<p>除此之外，关于已下内容也可以去了解一下，这里也不多说了：</p>
<ul>
<li>解构的使用</li>
<li>Class 的使用</li>
<li>Set 和 Map 数据结构</li>
<li>浏览器兼容性与 Babel</li>
</ul>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>除了以上问题以外，Javascript 还有一个典型的浮点数运算精确度的问题，大家可参考<a href="https://github.com/camsong/blog/issues/9" target="_blank" rel="noopener noreferrer">JavaScript 浮点数陷阱及解法<ExternalLinkIcon/></a>。
Javascript 这块的内容太多了，大家平时可以多关注一下自己对这些内容的理解和掌握程度，平时工作中也可以多进行思考，基础性的内容不建议临时抱佛脚哦。</p>
</div></template>


