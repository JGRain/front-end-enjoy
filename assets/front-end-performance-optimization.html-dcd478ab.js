import{_ as a,M as r,p as n,q as o,Q as t,R as e,t as i,N as p,a1 as s}from"./framework-5866ffd3.js";const d={},h=e("p",null,"对于前端开发来说，性能优化老生常谈了。不管是日常工作中，还是涉及到晋级答辩，性能都是频繁被我们提及的一个话题。",-1),c=e("p",null,"性能优化不是一劳永逸的解决方案，项目在发展过程，代码不断地迭代和变更。我们在某个阶段优化过的代码，过段时间性能又会慢慢下降，这也是前端开发常把性能挂在嘴边的原因。",-1),u=s('<p>当页面加载时间过长、交互操作不流畅时，会给用户带来很糟糕的体验。越是使用时间越长的产品，用户对体验的要求越高，如果出现卡顿或是加载缓慢，最坏的情况下会导致用户的流失。</p><p>对于性能优化，其实解决方案也比较常见和通用了，但是基本上也只有指导思想，实施起来还得具体项目具体分析。</p><h1 id="常见的性能优化方案" tabindex="-1"><a class="header-anchor" href="#常见的性能优化方案" aria-hidden="true">#</a> 常见的性能优化方案</h1><p>对于前端应用来说，网络耗时、页面加载耗时、脚本执行耗时、渲染耗时等耗时情况会影响用户的等待时长，而 CPU 占用、内存占用、本地缓存占用等则可能会导致页面卡顿甚至卡死。</p><p>因此，性能优化可以分别从<strong>耗时和资源占用</strong>两方面来解决，我个人也比较喜欢将其称为“时间”和“空间”两个维度。</p><h2 id="时间角度优化-减少耗时" tabindex="-1"><a class="header-anchor" href="#时间角度优化-减少耗时" aria-hidden="true">#</a> 时间角度优化：减少耗时</h2><p>我们知道浏览器在页面加载过程中，会进行以下的步骤：</p><ul><li>网络请求相关（发起 HTTP 请求从服务端获取页面资源，包括 HTML/CSS/JS/图片资源等）</li><li>浏览器解析 HTML 和渲染页面</li><li>加载 Javascript 代码时会暂停页面渲染（包括解析到外部资源，会发起 HTTP 请求获取并加载）</li></ul><p>在浏览器的首次加载和渲染完成之后，不代表用户就可以马上交互和操作。根据业务代码加载过程，页面还会分别进入页面开始渲染、渲染完成、用户可交互等阶段。除此之外，页面交互过程中，会根据业务逻辑进行逻辑运算、页面更新。</p><blockquote><p>题外话：为什么我们常常说要理解原理呢？性能优化便是个很好的例子，如果你不知道这个过程具体发生了什么，就很难找到地方下手去进行优化。</p></blockquote><p>根据这个过程，我们可以从四个方面进行耗时优化：</p><ol><li>网络请求优化。</li><li>首屏加载优化。</li><li>渲染过程优化。</li><li>计算/逻辑运行提速。</li></ol><p>在前端性能优化实践中，网络请求优化和首屏加载优化方案使用频率最高，因为不管项目规模如何、各个模块和逻辑是否复杂，这两个方向的耗时优化方案都是比较通用的。相比之下，对于页面内容较多、交互逻辑/运算逻辑复杂的项目，才需要针对性地进行渲染过程优化和计算/逻辑运行提速。</p><p>一起来看看~</p><h3 id="_1-网络请求优化" tabindex="-1"><a class="header-anchor" href="#_1-网络请求优化" aria-hidden="true">#</a> 1. 网络请求优化</h3><p>网络请求优化的目标在于减少网络资源的请求和加载耗时，如果考虑 HTTP 请求过程，显然我们可以从几个角度来进行优化：</p><ol><li>请求链路：DNS 查询、部署 CDN 节点、缓存等。</li><li>数据大小：代码大小、图片资源等。</li></ol><p>对于请求链路，核心的方案常常包括使用缓存，比如 DNS 缓存、CDN 缓存、HTTP 缓存、后台缓存等等，前端的话还可以考虑使用 Service Worker、PWA 等技术。使用缓存并非万能药，很多使用由于缓存的存在，我们在功能更新修复的时候还需要考虑缓存的情况。除此之外，还可以考虑使用 HTTP/2、HTTP/3 等提升资源请求速度，以及对多个请求进行合并，减少通信次数；对请求进行域名拆分，提升并发请求数量。</p><p>数据大小则主要考对请求资源进行合理的拆分（CSS、Javascript 脚本、图片/音频/视频等）和压缩，减少请求资源的体积，比如使用 Tree-shaking、代码分割、移除用不上的依赖项等。</p><p>在请求资源返回后，浏览器会进行解析和加载，这个过程会影响页面的可见时间，通过对首屏加载的优化，可有效地提升用户体验。</p><h3 id="_2-首屏加载优化" tabindex="-1"><a class="header-anchor" href="#_2-首屏加载优化" aria-hidden="true">#</a> 2. 首屏加载优化</h3><p>首屏加载优化核心点在于两部分：</p><ol><li>将页面内容尽快地展示给用户，减少页面白屏时间。</li><li>将用户可操作的时间尽量提前，避免用户无法操作的卡顿体验。</li></ol><p>减少白屏时间除了我们常说的首屏加载耗时优化，还可以考虑使用一些过渡的动画，让用户感知到页面正在顺利加载，从而避免用户对于白屏页面或是静止页面产生烦躁和困惑。除了技术侧的优化，很多时候产品策略的调整，给用户带来的体验优化效果不低于技术手段优化，因此我们也需要重视。</p><p>整体的优化思路包括：尽可能提前页面可见，以及将用户可交互的时间提前。一般来说，我们需要尽可能地降低首屏需要的代码量和执行耗时，可以通过以下方式进行：</p><ul><li>对页面的内容进行分片/分屏加载</li><li>仅加载需要的资源，通过异步或是懒加载的方式加载剩余资源</li><li>使用骨架屏进行预渲染</li><li>使用差异化服务，比如读写分离，对于不同场景按需加载所需要的模块</li><li>使用服务端直出渲染，减少页面二次请求和渲染的耗时</li></ul><p>有些时候，我们的页面也需要在客户端进行展示，此时可充分利用客户端的优势：</p><ul><li>配合客户端进行资源预请求和预加载，比如使用预热 Web 容器</li><li>配合客户端将资源和数据进行离线，可用于下一次页面的快速渲染</li><li>使用秒看技术，通过生成预览图片的方式提前将页面内容提供给用户</li></ul><p>除了首屏渲染以外，用户在浏览器页面过程中，也会触发页面的二次运算和渲染，此时需要进行渲染过程的优化。</p><h3 id="_3-渲染过程优化" tabindex="-1"><a class="header-anchor" href="#_3-渲染过程优化" aria-hidden="true">#</a> 3. 渲染过程优化</h3><p>渲染过程的优化要怎么定义呢？我们可以将其理解为首屏加载完成后，用户的操作交互触发的二次渲染。</p><p>主要思路是减少用户的操作等待时间，以及通过将页面渲染帧率保持在 60FPS 左右，提升页面交互和渲染的流畅度。包括但不限于以下方案：</p><ul><li>使用资源预加载，提升空闲时间的资源利用率</li><li>减少/合并 DOM 操作，减少浏览器渲染过程中的计算耗时</li><li>使用离屏渲染，在页面不可见的地方提前进行渲染（比如 Canvas 离屏渲染）</li><li>通过合理使用浏览器 GPU 能力，提升浏览器渲染效率（比如使用 css transform 代替 Canvas 缩放绘制）</li></ul><p>以上这些，是对常见的 Web 页面渲染优化方案。对于运算逻辑复杂、计算量较大的业务逻辑，我们还需要进行计算/逻辑运行的提速。</p><h3 id="_4-计算-逻辑运行提速" tabindex="-1"><a class="header-anchor" href="#_4-计算-逻辑运行提速" aria-hidden="true">#</a> 4. 计算/逻辑运行提速</h3><p>计算/逻辑运行速度优化的主要思路是“拆大为小、多路并行”，方式包括但不限于：</p><ul><li>通过将 Javscript 大任务进行拆解，结合异步任务的管理，避免出现长时间计算导致页面卡顿的情况</li><li>将耗时长且非关键逻辑的计算拆离，比如使用 Web Worker</li><li>通过使用运行效率更高的方式，减少计算耗时，比如使用 Webassembly</li><li>通过将计算过程提前，减少计算等待时长，比如使用 AOT 技术</li><li>通过使用更优的算法或是存储结构，提升计算效率，比如 VSCode 使用红黑树优化文本缓冲区的计算</li><li>通过将计算结果缓存的方式，减少运算次数</li></ul><p>以上便是<strong>时间</strong>维度的性能优化思路，还有<strong>空间</strong>维度的资源优化情况。</p><h2 id="空间角度优化-降低资源占用" tabindex="-1"><a class="header-anchor" href="#空间角度优化-降低资源占用" aria-hidden="true">#</a> 空间角度优化：降低资源占用</h2><p>提到性能优化，大多数我们都在针对页面加载耗时进行优化，对资源占用的优化会更少，因为资源占用常常会直接受到用户设备性能和适应场景的影响，大多数情况下优化效果会比耗时优化局限，因此这里也只能说一些大概的思路。</p><p>资源占用常见的优化方式包括：</p><ul><li>合理使用缓存，不滥用用户的缓存资源（比如浏览器缓存、IndexDB），及时进行缓存清理</li><li>避免存在内存泄露，比如尽量避免全局变量的使用、及时解除引用等</li><li>避免复杂/异常的递归调用，导致调用栈的溢出</li><li>通过使用数据结构享元的方式，减少对象的创建，从而减少内存占用</li></ul><p>说到底，我们在做性能优化的时候，其实很多情况下会依赖时间换空间、空间换时间等方式。性能优化没有银弹，只能根据自己项目的实际情况做出取舍，选择相对合适的一种方案去进行优化。</p><p>对于页面耗时和资源占用的性能优化分析，大部分情况都可以使用 Chrome 开发者工具进行针对性的分析和优化。</p><h3 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h3>',45),_={href:"https://godbasin.github.io/front-end-playground/front-end-basic/performance/front-end-performance-analyze.html",target:"_blank",rel:"noopener noreferrer"},f=e("p",null,"对于性能优化，其实本文只整理和归纳了一些常见的思路，至于实际上在项目中要怎么处理和使用，等有空的时候我再来跟大家讲一下~~",-1);function m(b,T){const l=r("ExternalLinkIcon");return n(),o("div",null,[h,c,t("more"),u,e("p",null,[i("实际上，除了遇到问题的时候进行优化，更优的方案是在工作流中搭建一个监控性能指标的步骤，每次变更发布前都跑一遍，发现性能下降之后进行及时的告警，推动开发者解决。对于这块，之前我也有简单描述过，可以参考"),e("a",_,[i("《补齐 Web 前端性能分析的工具盲点》"),p(l)]),i("一文。")]),f])}const g=a(d,[["render",m],["__file","front-end-performance-optimization.html.vue"]]);export{g as default};
