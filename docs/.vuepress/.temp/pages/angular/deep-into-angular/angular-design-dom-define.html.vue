<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中与视图有关的一些定义进行介绍。</p>
<!--more-->
<h1 id="angular-中的视图抽象" tabindex="-1"><a class="header-anchor" href="#angular-中的视图抽象" aria-hidden="true">#</a> Angular 中的视图抽象</h1>
<p>Angular 版本可在不同的平台上运行：在浏览器中、在移动平台上或在 Web Worker 中。因此，需要特定级别的抽象来介于平台特定的 API 和框架接口之间。</p>
<p>Angular 中通过抽象封装了不同平台的差异，并以下列引用类型的形式出现：<code v-pre>ElementRef</code>，<code v-pre>TemplateRef</code>，<code v-pre>ViewRef</code>，<code v-pre>ComponentRef</code>和<code v-pre>ViewContainerRef</code>。</p>
<h2 id="各抽象类视图定义" tabindex="-1"><a class="header-anchor" href="#各抽象类视图定义" aria-hidden="true">#</a> 各抽象类视图定义</h2>
<p>在阅读源码的时候，如果不清楚这些定义之间的区别，很容易搞混淆。所以，这里我们先来理解下它们之间的区别。</p>
<h3 id="元素-elementref" tabindex="-1"><a class="header-anchor" href="#元素-elementref" aria-hidden="true">#</a> 元素 ElementRef</h3>
<p><code v-pre>ElementRef</code>是最基本的抽象。如果观察它的类结构，可以看到它仅包含与其关联的本地元素：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ElementRef<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token operator">=</span> <span class="token builtin">any</span><span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token comment">// 基础原生元素</span>
  <span class="token comment">// 如果不支持直接访问原生元素（例如当应用程序在 Web Worker 中运行时），则为 null</span>
  <span class="token keyword">public</span> nativeElement<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>nativeElement<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>nativeElement <span class="token operator">=</span> nativeElement<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该 API 可用于直接访问本地 DOM 元素，可以比作<code v-pre>document.getElementById('myId')</code>。但 Angular 并不鼓励直接使用，尽可能使用 Angular 提供的模板和数据绑定。</p>
<h3 id="模板-templateref" tabindex="-1"><a class="header-anchor" href="#模板-templateref" aria-hidden="true">#</a> 模板 TemplateRef</h3>
<p>在 Angular 中，模板用来定义要如何在 HTML 中渲染组件视图的代码。</p>
<p>模板通过<code v-pre>@Component()</code>装饰器与组件类类关联起来。模板代码可以作为<code v-pre>template</code>属性的值用内联的方式提供，也可以通过 <code v-pre>templateUrl</code>属性链接到一个独立的 HTML 文件。</p>
<p>用<code v-pre>TemplateRef</code>对象表示的其它模板用来定义一些备用视图或内嵌视图，它们可以来自多个不同的组件。<code v-pre>TemplateRef</code>是一组 DOM 元素（<code v-pre>ElementRef</code>），可在整个应用程序的视图中重复使用：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">TemplateRef<span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token comment">// 此嵌入视图的父视图中的 anchor 元素</span>
  <span class="token keyword">abstract</span> <span class="token keyword">get</span> <span class="token function">elementRef</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> ElementRef<span class="token punctuation">;</span>
  <span class="token comment">// 基于此模板实例化嵌入式视图，并将其附加到视图容器</span>
  <span class="token keyword">abstract</span> <span class="token function">createEmbeddedView</span><span class="token punctuation">(</span>context<span class="token operator">:</span> <span class="token constant">C</span><span class="token punctuation">)</span><span class="token operator">:</span> EmbeddedViewRef<span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span><span class="token punctuation">;</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就其本身而言，<code v-pre>TemplateRef</code>类是一个简单的类，仅包括：</p>
<ul>
<li><code v-pre>elementRef</code>属性：拥有对其宿主元素的引用</li>
<li><code v-pre>createEmbeddedView</code>方法：它允许我们创建视图并将其引用作为<code v-pre>ViewRef</code>返回。</li>
</ul>
<p>模板会把纯 HTML 和 Angular 的数据绑定语法、指令和模板表达式组合起来。Angular 的元素会插入或计算那些值，以便在页面显示出来之前修改 HTML 元素。</p>
<h2 id="angular-中的视图" tabindex="-1"><a class="header-anchor" href="#angular-中的视图" aria-hidden="true">#</a> Angular 中的视图</h2>
<p>在 Angular 中，视图是可显示元素的最小分组单位，它们会被同时创建和销毁。Angular 哲学鼓励开发人员将 UI 视为视图的组合（而不是独立的 html 标签树）。</p>
<p>组件(<code v-pre>component</code>) 类及其关联的模板(<code v-pre>template</code>)定义了一个视图。具体实现上，视图由一个与该组件相关的<code v-pre>ViewRef</code>实例表示。</p>
<h3 id="viewref" tabindex="-1"><a class="header-anchor" href="#viewref" aria-hidden="true">#</a> ViewRef</h3>
<p><code v-pre>ViewRef</code>表示一个 Angular 视图：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">declare</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">ViewRef</span> <span class="token keyword">extends</span> <span class="token class-name">ChangeDetectorRef</span> <span class="token punctuation">{</span>
    <span class="token comment">// 销毁该视图以及与之关联的所有数据结构</span>
    <span class="token keyword">abstract</span> <span class="token keyword">get</span> <span class="token function">destroyed</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
    <span class="token comment">// 报告此视图是否已被销毁</span>
    <span class="token keyword">abstract</span> <span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token comment">// 生命周期挂钩，为视图提供其他开发人员定义的清理功能</span>
    <span class="token keyword">abstract</span> <span class="token function">onDestroy</span><span class="token punctuation">(</span>callback<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中，<code v-pre>ChangeDetectorRef</code>提供更改检测功能的基类，用于更改检测树收集所有要检查更改的视图：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">declare</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">ChangeDetectorRef</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当输入已更改或视图中触发了事件时，通常会将组件标记为脏（需要重新渲染）</span>
    <span class="token comment">// 调用此方法以确保即使没有发生这些触发器，也要检查组件</span>
    <span class="token keyword">abstract</span> <span class="token function">checkNoChanges</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token comment">// 从变更检测树中分离该视图。在重新连接分离视图之前，不会对其进行检查。</span>
    <span class="token comment">// 与 detectChanges() 结合使用可实现本地变更检测检查</span>
    <span class="token keyword">abstract</span> <span class="token function">detach</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token comment">// 检查此视图及其子级，与 detach() 结合使用可实现本地更改检测检查</span>
    <span class="token keyword">abstract</span> <span class="token function">detectChanges</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token comment">// 检查变更检测器及其子级，如果检测到任何变更，则抛出该异常</span>
    <span class="token keyword">abstract</span> <span class="token function">markForCheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token comment">// 将先前分离的视图重新附加到变更检测树</span>
    <span class="token comment">// 默认情况下，视图将附加到树上</span>
    <span class="token keyword">abstract</span> <span class="token function">reattach</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="两种类型的视图" tabindex="-1"><a class="header-anchor" href="#两种类型的视图" aria-hidden="true">#</a> 两种类型的视图</h3>
<p>Angular 支持两种类型的视图：</p>
<p><strong>(1) 链接到模板（<code v-pre>template</code>）的嵌入式视图（<code v-pre>embeddedView</code>）。</strong></p>
<p>嵌入式视图表示视图容器中的 Angular 视图。模板只是保存视图的蓝图，可以使用上述的<code v-pre>createEmbeddedView</code>方法从模板实例化视图。</p>
<p><strong>(2) 链接到组件（<code v-pre>component</code>）的宿主视图（<code v-pre>hostView</code>）。</strong></p>
<p>直属于某个组件的视图叫做宿主视图。</p>
<p>宿主视图是在动态实例化组件时创建的，可以使用<code v-pre>ComponentFactoryResolver</code>动态创建实例化一个组件。在 Angular 中，每个组件都绑定到特定的注入器实例，因此在创建组件时我们将传递当前的注入器实例。</p>
<p>视图中各个元素的属性可以动态修改以响应用户的操作，而这些元素的结构（数量或顺序）则不能。你可以通过在它们的视图容器（<code v-pre>ViewContainer</code>）中插入、移动或移除内嵌视图来修改这些元素的结构。</p>
<h3 id="viewcontainerref" tabindex="-1"><a class="header-anchor" href="#viewcontainerref" aria-hidden="true">#</a> ViewContainerRef</h3>
<p><code v-pre>ViewContainerRef</code>是可以将一个或多个视图附着到组件中的容器：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">declare</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">ViewContainerRef</span> <span class="token punctuation">{</span>
    <span class="token comment">// 锚元素，用于指定此容器在包含视图中的位置</span>
    <span class="token comment">// 每个视图容器只能有一个锚元素，每个锚元素只能有一个视图容器</span>
    <span class="token keyword">abstract</span> <span class="token keyword">get</span> <span class="token function">element</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> ElementRef<span class="token punctuation">;</span>
    <span class="token comment">// 此视图容器的 DI</span>
    <span class="token keyword">abstract</span> <span class="token keyword">get</span> <span class="token function">injector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> Injector<span class="token punctuation">;</span>
    <span class="token comment">// 此容器当前附加了多少视图</span>
    <span class="token keyword">abstract</span> <span class="token keyword">get</span> <span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    <span class="token comment">// 销毁此容器中的所有视图</span>
    <span class="token keyword">abstract</span> <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token comment">// 实例化单个组件，并将其宿主视图插入此容器</span>
    <span class="token keyword">abstract</span> <span class="token generic-function"><span class="token function">createComponent</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>componentFactory<span class="token operator">:</span> ComponentFactory<span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span><span class="token punctuation">,</span> index<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">,</span> injector<span class="token operator">?</span><span class="token operator">:</span> Injector<span class="token punctuation">,</span> projectableNodes<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> ngModule<span class="token operator">?</span><span class="token operator">:</span> NgModuleRef<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">)</span><span class="token operator">:</span> ComponentRef<span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span><span class="token punctuation">;</span>
    <span class="token comment">// 实例化一个嵌入式视图并将其插入</span>
    <span class="token keyword">abstract</span> <span class="token generic-function"><span class="token function">createEmbeddedView</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>templateRef<span class="token operator">:</span> TemplateRef<span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span><span class="token punctuation">,</span> context<span class="token operator">?</span><span class="token operator">:</span> <span class="token constant">C</span><span class="token punctuation">,</span> index<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> EmbeddedViewRef<span class="token operator">&lt;</span><span class="token constant">C</span><span class="token operator">></span><span class="token punctuation">;</span>
    <span class="token comment">// 从此容器分离视图而不销毁它</span>
    <span class="token keyword">abstract</span> <span class="token function">detach</span><span class="token punctuation">(</span>index<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> ViewRef <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">// 从此容器检索视图</span>
    <span class="token keyword">abstract</span> <span class="token function">get</span><span class="token punctuation">(</span>index<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> ViewRef <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">// 返回当前容器内视图的索引</span>
    <span class="token keyword">abstract</span> <span class="token function">indexOf</span><span class="token punctuation">(</span>viewRef<span class="token operator">:</span> ViewRef<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
    <span class="token comment">// 将视图移动到此容器中的新位置</span>
    <span class="token keyword">abstract</span> <span class="token function">insert</span><span class="token punctuation">(</span>viewRef<span class="token operator">:</span> ViewRef<span class="token punctuation">,</span> index<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> ViewRef<span class="token punctuation">;</span>
    <span class="token keyword">abstract</span> <span class="token function">move</span><span class="token punctuation">(</span>viewRef<span class="token operator">:</span> ViewRef<span class="token punctuation">,</span> currentIndex<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> ViewRef<span class="token punctuation">;</span>
    <span class="token comment">// 销毁附加到此容器的视图</span>
    <span class="token keyword">abstract</span> <span class="token function">remove</span><span class="token punctuation">(</span>index<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>任何 DOM 元素都可以用作视图容器，Angular 不会在元素内插入视图，而是将它们附加到绑定到<code v-pre>ViewContainer</code>的元素之后。</p>
<blockquote>
<p>通常，标记<code v-pre>ng-container</code>元素是标记应创建<code v-pre>ViewContainer</code>的位置的最佳选择。它作为注释呈现，因此不会在 DOM 中引入多余的 HTML 元素。</p>
</blockquote>
<p>通过<code v-pre>ViewContainerRef</code>，可以用<code v-pre>createComponent()</code>方法实例化组件时创建宿主视图，也可以用 <code v-pre>createEmbeddedView()</code>方法实例化<code v-pre>TemplateRef</code>时创建内嵌视图。</p>
<p>视图容器的实例还可以包含其它视图容器，以创建层次化视图（视图树）。</p>
<h3 id="视图树-view-hierarchy" tabindex="-1"><a class="header-anchor" href="#视图树-view-hierarchy" aria-hidden="true">#</a> 视图树（View hierarchy）</h3>
<p>在 Angular 中，通常会把视图组织成一些视图树（view hierarchies）。视图树是一棵相关视图的树，它们可以作为一个整体行动，是 Angular 变更检测的关键部件之一。</p>
<p>视图树的根视图就是组件的宿主视图。宿主视图可以是内嵌视图树的根，它被收集到了宿主组件上的一个视图容器（<code v-pre>ViewContainerRef</code>）中。当用户在应用中导航时（比如使用路由器），视图树可以动态加载或卸载。</p>
<p>视图树和组件树并不是一一对应的：</p>
<ul>
<li>嵌入到指定视图树上下文中的视图，也可能是其它组件的宿主视图</li>
<li>组件可能和宿主组件位于同一个<code v-pre>NgModule</code>中，也可能属于其它<code v-pre>NgModule</code></li>
</ul>
<h3 id="组件、模板、视图与模块" tabindex="-1"><a class="header-anchor" href="#组件、模板、视图与模块" aria-hidden="true">#</a> 组件、模板、视图与模块</h3>
<p>在 Angular 中，可以通过组件的配套模板来定义其视图。模板就是一种 HTML，它会告诉 Angular 如何渲染该组件。</p>
<p>视图通常会分层次进行组织，让你能以 UI 分区或页面为单位进行修改、显示或隐藏。与组件直接关联的模板会定义该组件的宿主视图。该组件还可以定义一个带层次结构的视图，它包含一些内嵌的视图作为其它组件的宿主。</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/component-tree.png" alt=""></p>
<p>带层次结构的视图可以包含同一模块（<code v-pre>NgModule</code>）中组件的视图，也可以（而且经常会）包含其它模块中定义的组件的视图。</p>
<h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2>
<p>本文简单介绍了 Angular 中元素、视图、模板、组件中与视图相关的一些定义，包括<code v-pre>ElementRef</code>，<code v-pre>TemplateRef</code>，<code v-pre>ViewRef</code>，<code v-pre>ComponentRef</code>和<code v-pre>ViewContainerRef</code>。</p>
<p>其中，视图是 Angular 中应用程序 UI 的基本构建块，它是一起创建和销毁的最小元素组。</p>
<p><code v-pre>ViewContainerRef</code>主要用于创建和管理内嵌视图或组件视图。组件可以通过配置模板来定义视图，与组件直接关联的模板会定义该组件的宿主视图，同时组件还可以包括内嵌视图。</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://angular.cn/guide/architecture-components" target="_blank" rel="noopener noreferrer">Angular-组件简介<ExternalLinkIcon/></a></li>
<li><a href="https://angular.cn/guide/glossary" target="_blank" rel="noopener noreferrer">Angular 词汇表<ExternalLinkIcon/></a></li>
<li><a href="https://hackernoon.com/exploring-angular-dom-abstractions-80b3ebcfc02" target="_blank" rel="noopener noreferrer">Exploring Angular DOM manipulation techniques using ViewContainerRef<ExternalLinkIcon/></a></li>
</ul>
</div></template>


