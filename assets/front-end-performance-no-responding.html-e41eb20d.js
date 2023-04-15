import{_ as t,M as r,p as d,q as c,Q as l,R as a,t as e,N as n,V as s,a1 as o}from"./framework-5866ffd3.js";const h={},m=a("p",null,"如果页面中存在耗时较长的计算任务，那么卡顿也是需要关注的一个性能优化点。",-1),f=o('<p>当我们开始讨论卡顿时，往往意味着页面中有较大的逻辑运算，该计算任务耗时太长，阻塞了浏览器的主线程，导致用户的一些操作无法及时响应。因此，我们今天卡顿优化的重点在于如何优化耗时较长的计算。</p><h1 id="卡顿优化" tabindex="-1"><a class="header-anchor" href="#卡顿优化" aria-hidden="true">#</a> 卡顿优化</h1><p>还是那句话，对于大多数的渲染场景，我们都可以使用浏览器的 Performance 来录制和分析性能问题，Performance 适用于针对某个具体、可复现的问题做分析。</p><p>卡顿问题同样也是，我们可以在火焰图中看到一些长耗时的任务，然后再逐个分析具体的耗时问题出现在哪里，逐一解决。</p><p>这里介绍一些耗时任务的优化方案。</p><h2 id="赋值和取值" tabindex="-1"><a class="header-anchor" href="#赋值和取值" aria-hidden="true">#</a> 赋值和取值</h2><p>其实大多数情况下，我们都很少会去在意一些变量的取值和赋值。</p><p>但是在一些复杂的计算场景下，比如深层次的遍历中，需要考虑的点就很多很细，比如：</p><ul><li>尽量将不需要执行的逻辑前置，提前判断做<code>return</code></li><li>减少<code>window</code>对象或是深层次对象上的取值，可以将其保存为临时变量使用</li><li>减少不必要的遍历，<code>Array.filter()</code>这种语法也是一次遍历，需要注意</li><li>对复杂数据结构的数据查询，可以考虑优化数据结构</li></ul><p>一些简单的问题，在重复上百万次的计算之后，都会被无数放大。即使是从<code>window</code>对象上获取某个值，然后做计算生成 DOM 这样的操作，如果将它放在多层遍历的最里层去做，同样会造成性能问题。</p><p>如果你的项目中有使用 Canvas，且重度依赖画布绘制，你会发现 ctx 的上下文切换开销也不低，后面也会单独对 Canvas 的一些性能问题做补充说明。</p><p>这也告诉我们，平时的代码习惯也要好，比如副作用、全局对象等，都可以考虑做更好的设计。</p><h2 id="优化计算性能-内存" tabindex="-1"><a class="header-anchor" href="#优化计算性能-内存" aria-hidden="true">#</a> 优化计算性能/内存</h2><p>除了上面提到的一些基础场景（比如取值赋值），很多时候我们提升计算性能，还依赖于使用更好的算法和数据结构。</p><p>其实大多数时候，前端都很少涉及到算法和数据结构相关的设计，但是在极端复杂的场景下，也需要考虑做一些优化。</p>',15),u={href:"https://code.visualstudio.com/blogs/2018/03/23/text-buffer-reimplementation",target:"_blank",rel:"noopener noreferrer"},_=o('<p>在这次优化中，VSCode 引入了红黑树的数据结构，替代了原有的线性阵列，优化了内存避免了内存爆炸，同时也优化了查询的时间复杂度。</p><p>其实，除了计算耗时过长，如果出现内存占用过多的情况下，同样会造成浏览器频繁的 GC。如果你有仔细观察 Performance，便会发现浏览器的 GC 本身也需要不小的耗时。</p><p>所以，我们还需要时常关注内存情况，考虑：</p><ul><li>使用享元的方式来优化数据存储，减少内存占用</li><li>及时地清理不用的资源，比如定时器</li><li>避免内存泄露等问题</li></ul><h2 id="大任务拆解" tabindex="-1"><a class="header-anchor" href="#大任务拆解" aria-hidden="true">#</a> 大任务拆解</h2><p>对于一些计算耗时较长的任务，我们可以考虑将任务做拆解，分成一个个的小任务，做异步执行。</p><p>比如，考虑将任务执行耗时控制在 50 ms 左右。每执行完一个任务，如果耗时超过 50 ms，将剩余任务设为异步，放到下一次执行，给到页面响应用户操作和更新渲染的时间。</p><p>我们都知道 React 框架有使用虚拟 DOM 的设计。实际上，虽然虚拟 DOM 解决了页面被频繁更新和渲染带来的性能问题，但传统虚拟 DOM 依然有以下性能瓶颈：</p><ul><li>在单个组件内部依然需要遍历该组件的整个虚拟 DOM 树</li><li>在一些组件整个模版内只有少量动态节点的情况下，这些遍历都是性能的浪费</li><li>递归遍历和更新逻辑容易导致 UI 渲染被阻塞，用户体验下降</li></ul><p>对此，React 中还设计了协调器（Reconciler）与渲染器（Renderer）来优化页面的渲染性能。而在 React16 中，还新增了调度器（Scheduler）。</p><p>调度器能够把可中断的任务切片处理，能够调整优先级，重置并复用任务。调度器会根据任务的优先级去分配各自的过期时间，在过期时间之前按照优先级执行任务，可以在不影响用户体验的情况下去进行计算和更新。通过这样的方式，React 可在浏览器空闲的时候进行调度并执行任务。</p><p>这便是将大任务做拆解方案中，很好的一个例子。</p><h2 id="其他计算优化" tabindex="-1"><a class="header-anchor" href="#其他计算优化" aria-hidden="true">#</a> 其他计算优化</h2><p>除了上述的一些优化方案，我们还可以考虑：</p><p>(1) 使用 Web Worker。</p><p>如今 Web Worker 已经是前端应用中比较常用的一个能力了，对于一些耗时较长、相对独立的计算任务，我们可以使用 Web Worker 来进行计算。</p><p>当然，由于这些计算任务已经不在主线程了，那么通信的耗时、数据的同步、Worker 兼容性等问题也需要考虑，做好兜底和兼容方案，保证核心能力的使用。</p><p>(2) 使用 WebAssembly。</p><p>WebAssembly 的运行性能接近原生，因此在许多计算耗时的场景上会被使用来优化，比如文件上传、文件/视频内容识别等等。</p><p>(3) 使用 AOT 技术。</p><p>使用 AOT 技术，通过将计算过程提前，减少计算等待时长。</p><p>举个例子，在 Angular 框架中，提供了预编译（AOT）能力，无须等待应用首次编译，以及通过预编译的方式移除不需要的库代码、减少体积，还可以提早检测模板错误。</p><h1 id="卡顿的监控和定位" tabindex="-1"><a class="header-anchor" href="#卡顿的监控和定位" aria-hidden="true">#</a> 卡顿的监控和定位</h1><p>出现卡顿问题的时候，往往难以定位，因为这个时候页面常常已经卡死，无法做更多的调试操作。</p><h2 id="performance" tabindex="-1"><a class="header-anchor" href="#performance" aria-hidden="true">#</a> Performance</h2><p>定位一个页面的运行是否有卡顿，最简单又直接的方式是录制 Performance。Performance 会把耗时长的任务直接标记为红色，我们可以根据这些任务，查找和分析具体产生耗时的脚本是哪些，然后去做优化。</p><p>但是，Performance 仅对开发者来说比较方便，在真实用户的使用场景里，未必有条件能提供 Performance 的录制。更多的时候，我们只能粗略地监控用户的卡顿情况，发现这样的场景，并尝试去解决。</p><h2 id="requestanimationframe" tabindex="-1"><a class="header-anchor" href="#requestanimationframe" aria-hidden="true">#</a> requestAnimationFrame</h2><p>一般来说我们监控卡顿，可以考虑使用<code>window.requestAnimationFrame</code>方法。该方法会在绘制下一帧绘制前被调用，这意味着当前的同步计算任务即将结束。</p><p>前面也有说到，卡顿大多数是因为长耗时的计算任务导致的。那么，我们就可以考虑在某个函数执行之前记下时间戳，而在<code>window.requestAnimationFrame</code>的时候再取其中的时间差，判断当前函数的执行耗时是否合理。</p><p>当然，该方案并不是完全准确，因为我们常常会在一个函数中间调用另外一个函数，还可能会同步抛出事件通知，执行其他的计算任务。</p><p>不过，考虑到真实的线上用户里无法直接使用 Performance，这也算是一个能做卡顿监控的方案。我们可以配合日志、其他不同的监控和上报等，来做更多的问题定位。</p><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1><p>大多数的卡顿场景，都是由于页面渲染掉帧导致的。因此针对页面的更新渲染，不管是 DOM 渲染还是 Canvas 渲染，需要注意将帧率保持在 50~60 FPS 的范围内，这样用户的体验会流程很多。</p><p>当然，如果我们的代码里写了死循环，造成页面直接卡死了，也是卡顿的一种情况，但这就又是另外一个故事了。</p><blockquote><p>愿天下所有的开发同学不再遇到卡顿~</p></blockquote>',36);function b(x,k){const p=r("RouterLink"),i=r("ExternalLinkIcon");return d(),c("div",null,[m,l("more"),a("p",null,[e("前面我有给大家整体地讲过"),n(p,{to:"/front-end-basic/performance/front-end-performance-optimization.html"},{default:s(()=>[e("《前端性能优化--归纳篇》")]),_:1}),e("，其实里面已经囊括了大多数场景下的一些性能优化的方向。")]),f,a("p",null,[e("讲一个经典例子，在 VSCode 的 1.21 发布版本中包含了一项重大改进："),a("a",u,[e("全新的文本缓冲区实现"),n(i)]),e("，在内存和速度方面都有大幅的性能提升。")]),_])}const A=t(h,[["render",b],["__file","front-end-performance-no-responding.html.vue"]]);export{A as default};
