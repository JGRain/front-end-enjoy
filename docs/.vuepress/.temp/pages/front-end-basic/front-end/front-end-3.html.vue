<template><div><p>本文稍微讲一下 HTML 和 CSS。</p>
<!--more-->
<h1 id="编辑器" tabindex="-1"><a class="header-anchor" href="#编辑器" aria-hidden="true">#</a> 编辑器</h1>
<p>写代码，怎么可以少了编辑器呢。</p>
<h2 id="ide" tabindex="-1"><a class="header-anchor" href="#ide" aria-hidden="true">#</a> IDE</h2>
<p>集成开发环境（Integrated Development Environment，简称 IDE）是一种辅助程序开发人员开发软件的应用软件，在开发工具内部就可以辅助编写源代码文本、并编译打包成为可用的程序，有些甚至可以设计图形接口。</p>
<p>简单来说，IDE 会集成了很多工具、插件和环境，常见代码提示、错误提示、编译工具等等，在 IDE 下面打开一个 web 项目，很多的辅助信息都帮你解析好了。<br>
而相对来说，IDE 比起文本编辑器就会笨重很多，尤其在多项目开发管理、编辑器启动的时候，速度明显下降。</p>
<p>前端常用的 IDE 无非是 Webstorm 了。</p>
<h2 id="文本编辑器" tabindex="-1"><a class="header-anchor" href="#文本编辑器" aria-hidden="true">#</a> 文本编辑器</h2>
<p>文本编辑器最大的优势，便是轻。像项目多的时候，常常是打开多个文本编辑器，也不至于卡顿。</p>
<p>而文本编辑器通常也是很灵活的，可以安装需要的一些插件，也能获得想要的辅助功能。</p>
<p>前端常用的文本编辑器有 Sublime、VSCode 等等。</p>
<h2 id="提升写码幸福指数" tabindex="-1"><a class="header-anchor" href="#提升写码幸福指数" aria-hidden="true">#</a> 提升写码幸福指数</h2>
<p>个人习惯的开发伴侣是 VSCode（<strong>VSCode 万岁！</strong>）。</p>
<p>作为伴随长时间的同伴，当然要好好设置一下啦。</p>
<ol>
<li>
<p>选择喜欢的主题样式。
个人比较喜欢 VSCode 的默认样式，大家也可以去下载各种的主题或是自定义样式。</p>
</li>
<li>
<p>安装一些插件。
像本骚年前段时间安装的一个 VSCode 插件：</p>
</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/微信图片_20171108125834.jpg" alt="image"></p>
<p>还有比较出名的当然是 Atom 的 power mode 啦：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/68747470733a2f2f636c6f75642e67697468756275736572636f6e74656e742e636f6d2f6173736574732f3638383431352f31313631353536352f31306631363435362d396336352d313165352d386166342d3236356630316663383361302e676966.gif" alt="image"></p>
<p>以及最近比较有人气的 <a href="https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode" target="_blank" rel="noopener noreferrer">TabNine<ExternalLinkIcon/></a> AI 训练自动补全的插件，写得越多补齐越厉害哦。</p>
<p>嘛，喜欢的事情要做得开心才对啦。除了编辑器，一台好的电脑、机械键盘、耳机等都是写码必备的提高幸福指数的装备啦。</p>
<p>我认识的很多很(ai)牛(zhuang)逼(bi)的程序员，都会让写代码变成很开心的事情。而这样的态度，也是很棒的生活态度。</p>
<h1 id="html-与-css" tabindex="-1"><a class="header-anchor" href="#html-与-css" aria-hidden="true">#</a> HTML 与 CSS</h1>
<p>上一节也有简单说过 HTML 相关的，我想想这里讲些啥的好。<br>
这里主要针对一些样式的逻辑来说明，其他详细的属性和设置值希望大家已经在 <a href="http://www.w3school.com.cn/" target="_blank" rel="noopener noreferrer">w3c<ExternalLinkIcon/></a> 或是 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS" target="_blank" rel="noopener noreferrer">MDN<ExternalLinkIcon/></a> 上学习过了。</p>
<h2 id="盒子模型" tabindex="-1"><a class="header-anchor" href="#盒子模型" aria-hidden="true">#</a> 盒子模型</h2>
<p>我们能从控制台的 Element 模块里，找到这样的盒子模型：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1510119051(1).png" alt="image"></p>
<p>盒模型(box model)是 CSS 中的一个重要概念，它是元素大小的呈现方式。</p>
<h3 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h3>
<p>在一个文档中，每个元素都被表示为一个矩形的盒子。确定这些盒子的尺寸, 属性（像它的颜色，背景，边框方面）和位置是渲染引擎的目标。</p>
<p>在 CSS 中，使用标准盒模型描述这些矩形盒子中的每一个。这个模型描述了元素所占空间的内容。<br>
每个盒子有四个边：外边距边（<code v-pre>margin</code>）,边框边（<code v-pre>border</code>）,内填充边（<code v-pre>padding</code>）与内容边（<code v-pre>content</code>）。</p>
<h3 id="margin-叠加" tabindex="-1"><a class="header-anchor" href="#margin-叠加" aria-hidden="true">#</a> margin 叠加</h3>
<p>当两个或更多个垂直边距相遇时，它们将形成一个外边距（<code v-pre>margin</code>）。</p>
<p><code v-pre>margin</code>的叠加会有一些混淆，需要注意的地方是：<br>
外边距（<code v-pre>margin</code>）的高度等于两个发生叠加的外边距的高度中的较大者。<br>
<strong>只有普通文档流中块框的垂直外边距才会发生外边距叠加。行内框、 浮动框或绝对定位框之间的外边距不会叠加。</strong></p>
<h3 id="盒模型计算" tabindex="-1"><a class="header-anchor" href="#盒模型计算" aria-hidden="true">#</a> 盒模型计算</h3>
<p>CSS3 中新增了一种盒模型计算方式：<code v-pre>box-sizing</code>属性。盒模型默认的值是<code v-pre>content-box</code>, 新增的值是<code v-pre>padding-box</code>和<code v-pre>border-box</code>，几种盒模型计算元素宽高的区别如下：</p>
<h4 id="content-box-默认" tabindex="-1"><a class="header-anchor" href="#content-box-默认" aria-hidden="true">#</a> content-box（默认）</h4>
<p>元素宽高(<code v-pre>width/height</code>)等于：<code v-pre>content</code><br>
布局所占宽高等于：<code v-pre>width/height(content) + border + padding</code></p>
<h4 id="padding-box" tabindex="-1"><a class="header-anchor" href="#padding-box" aria-hidden="true">#</a> padding-box</h4>
<p>元素宽高(<code v-pre>width/height</code>)等于：<code v-pre>content + padding</code>
布局所占宽高等于：<code v-pre>width/height(content + padding) + border</code></p>
<h4 id="border-box" tabindex="-1"><a class="header-anchor" href="#border-box" aria-hidden="true">#</a> border-box</h4>
<p>元素宽高(<code v-pre>width/height</code>)等于：<code v-pre>content + padding + border</code><br>
布局所占宽高等于：<code v-pre>width/height(content + padding + border)</code></p>
<h2 id="内联元素与块状元素" tabindex="-1"><a class="header-anchor" href="#内联元素与块状元素" aria-hidden="true">#</a> 内联元素与块状元素</h2>
<h3 id="内联元素" tabindex="-1"><a class="header-anchor" href="#内联元素" aria-hidden="true">#</a> 内联元素</h3>
<p>内联元素又称行内元素等，表示位于行内的元素。<br>
内联元素只能容纳文本或者其他内联元素，它允许其他内联元素与其位于同一行。<br>
内联元素的宽度高度不起作用。</p>
<p>常见的内联元素：<code v-pre>&lt;a&gt;</code>/<code v-pre>&lt;span&gt;</code>/<code v-pre>&lt;i&gt;</code>/<code v-pre>&lt;strong&gt;</code>等。</p>
<h3 id="块状元素" tabindex="-1"><a class="header-anchor" href="#块状元素" aria-hidden="true">#</a> 块状元素</h3>
<p>块状元素一般是其他元素的容器，可容纳内联元素和其他块状元素。<br>
块状元素排斥其他元素与其位于同一行。<br>
块状元素的宽度高度起作用。</p>
<p>常见的块状元素有：</p>
<ul>
<li><code v-pre>&lt;div&gt;</code>/<code v-pre>&lt;p&gt;</code>/<code v-pre>&lt;h1&gt;</code>/<code v-pre>&lt;h2&gt;…&lt;h6&gt;</code>/<code v-pre>&lt;ul&gt;</code>/<code v-pre>&lt;ol&gt;</code></li>
<li>HTML5 新元素: <code v-pre>&lt;section&gt;</code>/<code v-pre>&lt;article&gt;</code>/<code v-pre>&lt;header&gt;</code>/<code v-pre>&lt;footer&gt;</code>等</li>
</ul>
<h3 id="常用的-display-属性" tabindex="-1"><a class="header-anchor" href="#常用的-display-属性" aria-hidden="true">#</a> 常用的 display 属性</h3>
<h4 id="block-块状元素" tabindex="-1"><a class="header-anchor" href="#block-块状元素" aria-hidden="true">#</a> block：块状元素</h4>
<ul>
<li>可容纳其他块状元素或内联元素</li>
<li>排斥其他元素与其位于同一行</li>
<li>宽度高度起作用，<code v-pre>block</code>元素可以设置宽度<code v-pre>width</code>和高度<code v-pre>height</code>，有效</li>
</ul>
<h4 id="inline-内联元素" tabindex="-1"><a class="header-anchor" href="#inline-内联元素" aria-hidden="true">#</a> inline：内联元素</h4>
<ul>
<li>位于行内，即位于块状元素或者其他内联元素内</li>
<li>只能容纳文本或者其他内联元素</li>
<li>允许其他内联元素与其位于同一行</li>
<li>inline 元素的宽度高度不起作用</li>
</ul>
<h4 id="inline-block-元素" tabindex="-1"><a class="header-anchor" href="#inline-block-元素" aria-hidden="true">#</a> inline-block 元素</h4>
<ul>
<li>
<p>与<code v-pre>inline</code>元素相似的地方</p>
<ul>
<li>位于行内，即位于块状元素或者其他内联元素内</li>
<li>允许其他内联元素与其位于同一行</li>
</ul>
</li>
<li>
<p>与<code v-pre>block</code>元素相似的地方</p>
<ul>
<li>可容纳其他块状元素或内联元素</li>
<li>宽度高度起作用</li>
</ul>
</li>
<li>
<p>使用<code v-pre>inline-block</code>可以很方便解决一些问题:</p>
<ul>
<li>使元素居中</li>
<li><code v-pre>inline</code>元素<code v-pre>a</code>/<code v-pre>span</code>设置宽高</li>
<li>将多个块状元素放在一行</li>
</ul>
</li>
</ul>
<h3 id="float-浮动" tabindex="-1"><a class="header-anchor" href="#float-浮动" aria-hidden="true">#</a> float 浮动</h3>
<p><code v-pre>float</code>属性定义元素在哪个方向浮动。<br>
<code v-pre>float</code>属性可应用于图像，使文本围绕在图像周围。</p>
<p>使用<code v-pre>float</code>还可能遇到高度塌陷的问题，而可以使用几个方法解决：</p>
<ul>
<li>父元素使用<code v-pre>overflow: hidden</code>（此时高度为<code v-pre>auto</code>）</li>
<li>使父元素也成为浮动<code v-pre>float</code>元素</li>
<li>使用<code v-pre>clear</code>清除浮动</li>
</ul>
<p><code v-pre>float</code>撑开父元素主要依赖 BFC 原则。</p>
<p><strong>BFC 特性：</strong></p>
<ol>
<li>BFC 会阻止垂直外边距（margin-top、margin-bottom）折叠。</li>
<li>BFC 不会重叠浮动元素。</li>
<li>BFC 可以包含浮动。</li>
</ol>
<h3 id="具体说明" tabindex="-1"><a class="header-anchor" href="#具体说明" aria-hidden="true">#</a> 具体说明</h3>
<p>以上的一些样式属性和方法，更多具体说明可参考<a href="https://godbasin.github.io/2016/06/26/about-display/" target="_blank" rel="noopener noreferrer">《CSS 的 display 有关》<ExternalLinkIcon/></a>。</p>
<h2 id="元素定位" tabindex="-1"><a class="header-anchor" href="#元素定位" aria-hidden="true">#</a> 元素定位</h2>
<p><strong>文档流</strong>：正常的文档流也叫普通流，在 HTML 里面的写法就是从上到下，从左到右的排版布局。</p>
<p>而我们常用的布局，与<code v-pre>position</code>样式属性紧紧相关。</p>
<h3 id="static" tabindex="-1"><a class="header-anchor" href="#static" aria-hidden="true">#</a> static</h3>
<p>默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。</p>
<h3 id="inherit" tabindex="-1"><a class="header-anchor" href="#inherit" aria-hidden="true">#</a> inherit</h3>
<p>规定应该从父元素继承 position 属性的值。</p>
<h3 id="relative" tabindex="-1"><a class="header-anchor" href="#relative" aria-hidden="true">#</a> relative</h3>
<p>生成相对定位的元素，相对于其正常位置进行定位。</p>
<p><code v-pre>relative</code>的特点：</p>
<ul>
<li>保持原有文档流，但相对本身的原始位置发生位移，且占空间</li>
<li>元素也遵循从上到下，从左到右的排版布局</li>
<li>相对于其正常位置进行定位，在这里设置了<code v-pre>relative</code>的元素相对其原本位置（<code v-pre>position: static</code>）进行位移</li>
<li>元素占有原本位置，因此下一个元素会排到该元素后方</li>
<li>元素占位不会随着定位的改变而改变。也就是说<code v-pre>relative</code>在文档流中占有的位置与其原本位置（<code v-pre>position: static</code>）相同</li>
</ul>
<p>这里有个需要注意的地方： 虽然<code v-pre>relative</code>元素占位与<code v-pre>static</code>相同，但会溢出父元素，撑开整个页面（<code v-pre>document</code>）。</p>
<h3 id="absolute" tabindex="-1"><a class="header-anchor" href="#absolute" aria-hidden="true">#</a> absolute</h3>
<p>生成绝对定位的元素，相对于<code v-pre>static</code>定位以外的第一个父元素进行定位。<br>
元素的位置通过<code v-pre>left</code>, <code v-pre>top</code>, <code v-pre>right</code>以及<code v-pre>bottom</code>属性进行规定。</p>
<p><code v-pre>absolute</code>的特点：</p>
<ul>
<li><code v-pre>absolute</code>元素脱离文档流</li>
<li><code v-pre>absolute</code>元素不占位，因此下一个符合普通流的元素会略过<code v-pre>absolute</code>元素排到其上一个元素的后方</li>
<li><code v-pre>absolute</code>元素的定位是相对于<code v-pre>static</code>定位以外的第一个父元素进行定位</li>
</ul>
<h3 id="fixed" tabindex="-1"><a class="header-anchor" href="#fixed" aria-hidden="true">#</a> fixed</h3>
<p>生成绝对定位的元素，相对于浏览器窗口进行定位。<br>
元素的位置通过<code v-pre>left</code>, <code v-pre>top</code>, <code v-pre>right</code>以及<code v-pre>bottom</code>属性进行规定。</p>
<p><code v-pre>fixed</code>的特点：</p>
<ul>
<li><code v-pre>fixed</code>元素脱离文档流</li>
<li><code v-pre>fixed</code>元素不占位</li>
<li><code v-pre>fixed</code>相对于浏览器窗口来定位，不管是否有<code v-pre>static</code>定位以外的父元素</li>
<li><code v-pre>absolute</code>元素会随着页面的滚动而滚动，而<code v-pre>fixed</code>不会</li>
</ul>
<h2 id="元素堆叠" tabindex="-1"><a class="header-anchor" href="#元素堆叠" aria-hidden="true">#</a> 元素堆叠</h2>
<p>元素的堆叠方式和顺序，除了与<code v-pre>position</code>定位有关，也与<code v-pre>z-index</code>有关。</p>
<h3 id="z-index" tabindex="-1"><a class="header-anchor" href="#z-index" aria-hidden="true">#</a> z-index</h3>
<p>有关<code v-pre>z-index</code>的说明：</p>
<ol>
<li>无<code v-pre>z-index</code>或者<code v-pre>z-index</code>值相等时，堆叠顺序均由元素在文档中的先后位置决定，后出现的会在上面。</li>
<li>当向上追溯找不到含有<code v-pre>z-index</code>值的父元素的情况下，则可以视为自由的<code v-pre>z-index</code>元素。</li>
<li>自由的<code v-pre>z-index</code>元素可以与其他自由的定位元素或者父元素的同级兄弟定位元素来比较<code v-pre>z-index</code>的值，决定其堆叠顺序。</li>
<li><code v-pre>z-index</code>值只决定同一父元素中的同级子元素的堆叠顺序。</li>
<li>父元素的<code v-pre>z-index</code>值为子元素定义了堆叠顺序，即子元素依赖于父元素<code v-pre>z-index</code>值来获得页面中的堆叠顺序。</li>
</ol>
<h3 id="具体说明-1" tabindex="-1"><a class="header-anchor" href="#具体说明-1" aria-hidden="true">#</a> 具体说明</h3>
<p>有关元素定位和堆叠的更多说明，可以参考文章<a href="https://godbasin.github.io/2016/06/25/about-position/" target="_blank" rel="noopener noreferrer">《CSS 的 position 和 z-index 有关》<ExternalLinkIcon/></a>。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节简单介绍了关于 HTML 和 CSS 主要的一些规则和说明，或许有些杂乱，但这些都是我们在调试样式的时候需要遵循的逻辑。<br>
即使是元素的尺寸和颜色，或许也是有一套规则的，只要掌握了这些原理，debug 速度不就快很多了嘛。</p>
</div></template>


