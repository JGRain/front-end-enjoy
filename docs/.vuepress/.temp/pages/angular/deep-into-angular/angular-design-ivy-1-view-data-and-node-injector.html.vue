<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要介绍在 Angular 的 Ivy 编译器中，是如何管理和查找视图数据的。</p>
<!--more-->
<h2 id="ivy-模型" tabindex="-1"><a class="header-anchor" href="#ivy-模型" aria-hidden="true">#</a> Ivy 模型</h2>
<p>在<RouterLink to="/angular/deep-into-angular/angular-design-ivy-0-design.html">上一节《Ivy 编译器整体设计》</RouterLink>中，我们从整体上介绍了 Ivy 编译器主要做的一些事情，包括模板编译、TypeScript 解析器等。我们可以看到 Ivy 编译器实现了更优的 Tree-shaking 支持、组件的延迟加载、支持增量编译等，而达到这些效果的一个核心设计点便在于视图的解析和数据管理。</p>
<h3 id="视图数据-lview-tview" tabindex="-1"><a class="header-anchor" href="#视图数据-lview-tview" aria-hidden="true">#</a> 视图数据 LView/TView</h3>
<p>在 Angular Ivy 中，使用了<code v-pre>LView</code>和<code v-pre>TView.data</code>来管理和跟踪渲染模板所需要的内部数据。</p>
<p>其中，<code v-pre>LView</code>存储了从模板调用指令时，处理指令所需的所有信息。每个嵌入式视图和组件视图都有自己的<code v-pre>LView</code>，我们来看看<code v-pre>LView</code>的定义：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">LView</span> <span class="token keyword">extends</span> <span class="token class-name"><span class="token builtin">Array</span><span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token comment">// 插入该 LView 的节点</span>
  <span class="token punctuation">[</span><span class="token constant">HOST</span><span class="token punctuation">]</span><span class="token operator">:</span> RElement <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 此视图的静态数据</span>
  <span class="token keyword">readonly</span> <span class="token punctuation">[</span><span class="token constant">TVIEW</span><span class="token punctuation">]</span><span class="token operator">:</span> TView<span class="token punctuation">;</span>

  <span class="token comment">// 父视图</span>
  <span class="token punctuation">[</span><span class="token constant">PARENT</span><span class="token punctuation">]</span><span class="token operator">:</span> LView <span class="token operator">|</span> LContainer <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 下一个同级视图或容器</span>
  <span class="token punctuation">[</span><span class="token constant">NEXT</span><span class="token punctuation">]</span><span class="token operator">:</span> LView <span class="token operator">|</span> LContainer <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 对此视图有效的查询-视图中的节点将报告给这些查询</span>
  <span class="token punctuation">[</span><span class="token constant">QUERIES</span><span class="token punctuation">]</span><span class="token operator">:</span> LQueries <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 存储当前 LView 插入位置的 TNode</span>
  <span class="token punctuation">[</span><span class="token constant">T_HOST</span><span class="token punctuation">]</span><span class="token operator">:</span> TNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 当视图被破坏时，需要释放侦听器，并且必须取消订阅输出</span>
  <span class="token punctuation">[</span><span class="token constant">CLEANUP</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 上下文信息</span>
  <span class="token punctuation">[</span><span class="token constant">CONTEXT</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token operator">|</span> RootContext <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 在咨询了元素注入器之后，将使用可选的模块注入器作为回退</span>
  <span class="token keyword">readonly</span> <span class="token punctuation">[</span><span class="token constant">INJECTOR</span><span class="token punctuation">]</span><span class="token operator">:</span> Injector <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 用于创建渲染器的工厂</span>
  <span class="token punctuation">[</span><span class="token constant">RENDERER_FACTORY</span><span class="token punctuation">]</span><span class="token operator">:</span> RendererFactory3<span class="token punctuation">;</span>

  <span class="token comment">// 要用于此视图的渲染器</span>
  <span class="token punctuation">[</span><span class="token constant">RENDERER</span><span class="token punctuation">]</span><span class="token operator">:</span> Renderer3<span class="token punctuation">;</span>

  <span class="token comment">// 引用层次结构中此 LView 下的第一个 LView 或 LContainer</span>
  <span class="token punctuation">[</span><span class="token constant">CHILD_HEAD</span><span class="token punctuation">]</span><span class="token operator">:</span> LView <span class="token operator">|</span> LContainer <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 层次结构中此 LView 下的最后一个 LView 或 LContainer</span>
  <span class="token punctuation">[</span><span class="token constant">CHILD_TAIL</span><span class="token punctuation">]</span><span class="token operator">:</span> LView <span class="token operator">|</span> LContainer <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 查看声明此视图的模板的位置</span>
  <span class="token punctuation">[</span><span class="token constant">DECLARATION_VIEW</span><span class="token punctuation">]</span><span class="token operator">:</span> LView <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 指向声明组件视图，用于跟踪已移植的 LView</span>
  <span class="token punctuation">[</span><span class="token constant">DECLARATION_COMPONENT_VIEW</span><span class="token punctuation">]</span><span class="token operator">:</span> LView<span class="token punctuation">;</span>

  <span class="token comment">// 嵌入视图的声明点（基于 &lt;ng-template> 的内容实例化的声明点），其他类型的视图为 null</span>
  <span class="token punctuation">[</span><span class="token constant">DECLARATION_LCONTAINER</span><span class="token punctuation">]</span><span class="token operator">:</span> LContainer <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们能看到，<code v-pre>LView</code>中存储了足够多的信息，这样的设计使单个数组可以以紧凑的形式包含模板渲染所需的所有必要数据。</p>
<p>其中，<code v-pre>[TVIEW]</code>为该视图的静态数据，存储了所有可在模板实例之间共享的信息（比如<code v-pre>template</code>、<code v-pre>components</code>、<code v-pre>data</code>以及各种钩子），以便可以轻松地在 DI 中遍历节点树并获取与节点（存储指令<code v-pre>defs</code>的节点）关联的<code v-pre>TView.data</code>数组。这些信息存储在<code v-pre>ComponentDef.tView</code>中。</p>
<p>显然，<code v-pre>LView</code>还存储了除此之外的所有渲染模板需要的信息，比如：</p>
<ul>
<li><code v-pre>[PARENT]</code>用于存储父视图。在处理特定视图时，Ivy 将<code v-pre>viewData</code>设置为该<code v-pre>LView</code>；完成该视图的处理后，将<code v-pre>viewData</code>设置回原始<code v-pre>viewData</code>之前的状态（父<code v-pre>LView</code>）</li>
<li><code v-pre>[NEXT]</code>用来链接组件视图和跨容器的视图</li>
<li><code v-pre>[T_HOST]</code>存储当前<code v-pre>LView</code>插入位置的<code v-pre>TNode</code>，因为“子级”除了插入到“父级”中，还可以插入到任何地方，因此不能将插入信息存储在<code v-pre>TView</code>中</li>
<li><code v-pre>[DECLARATION_VIEW]</code>用于存储“声明视图”（声明模板的视图），因为动态创建的视图的模板可以在与插入的视图不同的视图中声明，因此，上下文应继承自声明视图树，而不是插入视图树</li>
<li><code v-pre>[CHILD_HEAD]</code>存储引用层次结构中此<code v-pre>LView</code>下的第一个<code v-pre>LView</code>或<code v-pre>LContainer</code>，以便视图可以遍历其嵌套视图以除去侦听器并调用<code v-pre>onDestroy</code>回调</li>
<li><code v-pre>[CHILD_TAIL]</code>存储层次结构中此<code v-pre>LView</code>下的最后一个<code v-pre>LView</code>或<code v-pre>LContainer</code>，尾部使 Ivy 可以快速向视图列表的末尾添加新状态，而不必从第一个孩子开始传播</li>
</ul>
<p><code v-pre>LView</code>的设计，可以为每个视图保留单独的状态以方便视图的插入/删除，因此我们不必根据存在的视图来编辑数据数组。</p>
<h3 id="lview-tview-data-数据视图" tabindex="-1"><a class="header-anchor" href="#lview-tview-data-数据视图" aria-hidden="true">#</a> LView/TView.data 数据视图</h3>
<p>在 Ivy 中，<code v-pre>LView</code>和<code v-pre>TView.data</code>都是数组，它们的索引指向相同的项目。它们的数据视图布局如下：</p>
<table>
<thead>
<tr>
<th>Section</th>
<th><code v-pre>LView</code></th>
<th><code v-pre>TView.data</code></th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>HEADER</code></td>
<td>上下文数据</td>
<td>大多数为<code v-pre>null</code></td>
</tr>
<tr>
<td><code v-pre>DECLS</code></td>
<td>DOM、pipe 和本地引用实例</td>
<td></td>
</tr>
<tr>
<td><code v-pre>VARS</code></td>
<td>绑定值</td>
<td>属性名称</td>
</tr>
<tr>
<td><code v-pre>EXPANDO</code></td>
<td>host bindings; directive instances; providers; dynamic nodes</td>
<td>host prop names; directive tokens; provider tokens; <code v-pre>null</code></td>
</tr>
</tbody>
</table>
<p>其中：</p>
<ul>
<li><code v-pre>HEADER</code>是一个固定的数组大小，其中包含有关模板的上下文信息。主要是诸如父级<code v-pre>LView``Sanitizer</code>、<code v-pre>TView</code>之类的信息，以及模板渲染所需的更多信息</li>
<li><code v-pre>DECKS</code>包含 DOM 元素、管道实例和本地引用，<code v-pre>DECKS</code>节的大小在组件定义的属性<code v-pre>decl</code>中声明</li>
<li><code v-pre>VARS</code>包含有关如何处理绑定的信息，<code v-pre>VARS</code>部分的大小在组件定义的属性<code v-pre>var</code>中声明</li>
<li><code v-pre>EXPANDO</code>包含有关在编译时未知大小的数据的信息。比如<code v-pre>Component/Directives</code>，因为 Ivy 在编译时不知道会匹配哪些指令</li>
</ul>
<p>至于具体的例子这里便不展开介绍了，你可以从 <a href="https://github.com/angular/angular/blob/master/packages/core/src/render3/VIEW_DATA.md" target="_blank" rel="noopener noreferrer">DOCS: View Data Explanation<ExternalLinkIcon/></a> 文档中找到。</p>
<h2 id="ivy-中-的-di" tabindex="-1"><a class="header-anchor" href="#ivy-中-的-di" aria-hidden="true">#</a> Ivy 中 的 DI</h2>
<p>在 Angular DI 中，注入器获取对应的示例依赖于 token 令牌。Ivy 将所有令牌存储在<code v-pre>TView.data</code>中，将实例存储在<code v-pre>LView</code>中，因此我们可以检索查看该视图的所有注入器。</p>
<p>而 DI 查找依赖的过程，离不开<code v-pre>NodeInjector</code>。</p>
<h3 id="nodeinjector" tabindex="-1"><a class="header-anchor" href="#nodeinjector" aria-hidden="true">#</a> NodeInjector</h3>
<p><a href="">上一节中</a>，我们介绍了 Ivy 编译器中使用增量编译来优化构建速度，增量编译意味着一个库只会根据变更的部分进行重新编译。要做到增量编译，Ivy 编译器不得依赖未直接传递给它的任何输入（可理解为“纯函数”）。使用<code v-pre>Lview</code>来存储每个视图的状态和数据，则可以通过 DI 注入依赖的视图数据。</p>
<p>在<RouterLink to="/angular/deep-into-angular/angular-design-di-2-hierarchical-di.html">《Angular 框架解读--多级依赖注入设计》</RouterLink>一文中，我们介绍了 Angular 中的两种注入器：模块注入器<code v-pre>ModuleInjector</code>和元素注入器<code v-pre>ElementInjector</code>。Angular 通过依次遍历元素注入器树和模块注入器树来查找提供令牌的注入器。</p>
<p>实际上，在 Ivy 中使用<code v-pre>NodeInjector</code>替换了 View Engine 中的元素注入器：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NodeInjector</span> <span class="token keyword">implements</span> <span class="token class-name">Injector</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> _tNode<span class="token operator">:</span>
      <span class="token operator">|</span> TElementNode
      <span class="token operator">|</span> TContainerNode
      <span class="token operator">|</span> TElementContainerNode
      <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token keyword">private</span> _lView<span class="token operator">:</span> LView
  <span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token function">get</span><span class="token punctuation">(</span>token<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> notFoundValue<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">any</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">getOrCreateInjectable</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>_tNode<span class="token punctuation">,</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>_lView<span class="token punctuation">,</span>
      token<span class="token punctuation">,</span>
      <span class="token keyword">undefined</span><span class="token punctuation">,</span>
      notFoundValue
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中，<code v-pre>getOrCreateInjectable</code>方法从<code v-pre>NodeInjectors</code>到<code v-pre>ModuleInjector</code>进行遍历，并返回（或创建）与给定令牌关联的值。</p>
<h3 id="di-查找依赖的过程" tabindex="-1"><a class="header-anchor" href="#di-查找依赖的过程" aria-hidden="true">#</a> DI 查找依赖的过程</h3>
<p>我们知道 Angular 会构建一棵视图树，该视图树总是以只含一个根元素的伪根视图开始（参考<RouterLink to="/angular/deep-into-angular/angular-design-dom-define.html">《Angular 框架解读--视图抽象定义》</RouterLink>）。</p>
<p>Ivy 使用<code v-pre>LView</code>和<code v-pre>TView.data</code>数组来存储视图数据，其中便包括了节点的注入信息。这意味着，<strong><code v-pre>NodeInjector</code>需要从<code v-pre>LView</code>和<code v-pre>TView.data</code>数组中得到具体的视图数据信息</strong>。</p>
<p>我们可以从<code v-pre>getOrCreateInjectable</code>中看到该过程：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token generic-function"><span class="token function">getOrCreateInjectable</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>
  tNode<span class="token operator">:</span> TDirectiveHostNode <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  lView<span class="token operator">:</span> LView<span class="token punctuation">,</span>
  token<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span> <span class="token operator">|</span> AbstractType<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span> <span class="token operator">|</span> InjectionToken<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span><span class="token punctuation">,</span>
  flags<span class="token operator">:</span> InjectFlags <span class="token operator">=</span> InjectFlags<span class="token punctuation">.</span>Default<span class="token punctuation">,</span>
  notFoundValue<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">any</span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token constant">T</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>tNode <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> bloomHash <span class="token operator">=</span> <span class="token function">bloomHashBitOrFactory</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 如果此处存储的 ID 是一个函数，则这是一个特殊的对象，例如 ElementRef 或 TemplateRef</span>
    <span class="token comment">// 因此只需调用 factory 函数即可创建它</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> bloomHash <span class="token operator">===</span> <span class="token string">"function"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">enterDI</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> tNode<span class="token punctuation">,</span> flags<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 无法进入 DI，则尝试使用模块注入器</span>
        <span class="token comment">// 如果使用 @Host 标志注入令牌，则在 Ivy 中不会在模块注入器中搜索该令牌</span>
        <span class="token keyword">return</span> flags <span class="token operator">&amp;</span> InjectFlags<span class="token punctuation">.</span>Host
          <span class="token operator">?</span> <span class="token generic-function"><span class="token function">notFoundValueOrThrow</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>notFoundValue<span class="token punctuation">,</span> token<span class="token punctuation">,</span> flags<span class="token punctuation">)</span>
          <span class="token operator">:</span> <span class="token generic-function"><span class="token function">lookupTokenUsingModuleInjector</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>
              lView<span class="token punctuation">,</span>
              token<span class="token punctuation">,</span>
              flags<span class="token punctuation">,</span>
              notFoundValue
            <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token function">bloomHash</span><span class="token punctuation">(</span>flags<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> InjectFlags<span class="token punctuation">.</span>Optional<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">throwProviderNotFoundError</span><span class="token punctuation">(</span>token<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> value<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
        <span class="token function">leaveDI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> bloomHash <span class="token operator">===</span> <span class="token string">"number"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 对遍历元素注入器树时找到的上一个注入器 TView 的引用</span>
      <span class="token comment">// 这用于了解是否可以在当前注射器上访问 viewProviders</span>
      <span class="token keyword">let</span> previousTView<span class="token operator">:</span> TView <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> injectorIndex <span class="token operator">=</span> <span class="token function">getInjectorIndex</span><span class="token punctuation">(</span>tNode<span class="token punctuation">,</span> lView<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> parentLocation<span class="token operator">:</span> RelativeInjectorLocation <span class="token operator">=</span> <span class="token constant">NO_PARENT_INJECTOR</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> hostTElementNode<span class="token operator">:</span> TNode <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">=</span>
        flags <span class="token operator">&amp;</span> InjectFlags<span class="token punctuation">.</span>Host
          <span class="token operator">?</span> lView<span class="token punctuation">[</span><span class="token constant">DECLARATION_COMPONENT_VIEW</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token constant">T_HOST</span><span class="token punctuation">]</span>
          <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

      <span class="token comment">// 如果我们应该跳过此注入器，或者此节点上没有注入器，需先搜索父注入器</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>injectorIndex <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">||</span> flags <span class="token operator">&amp;</span> InjectFlags<span class="token punctuation">.</span>SkipSelf<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        parentLocation <span class="token operator">=</span>
          injectorIndex <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span>
            <span class="token operator">?</span> <span class="token function">getParentInjectorLocation</span><span class="token punctuation">(</span>tNode<span class="token punctuation">,</span> lView<span class="token punctuation">)</span>
            <span class="token operator">:</span> lView<span class="token punctuation">[</span>injectorIndex <span class="token operator">+</span> NodeInjectorOffset<span class="token punctuation">.</span><span class="token constant">PARENT</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>
          parentLocation <span class="token operator">===</span> <span class="token constant">NO_PARENT_INJECTOR</span> <span class="token operator">||</span>
          <span class="token operator">!</span><span class="token function">shouldSearchParent</span><span class="token punctuation">(</span>flags<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span>
        <span class="token punctuation">)</span> <span class="token punctuation">{</span>
          injectorIndex <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          previousTView <span class="token operator">=</span> lView<span class="token punctuation">[</span><span class="token constant">TVIEW</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
          injectorIndex <span class="token operator">=</span> <span class="token function">getParentInjectorIndex</span><span class="token punctuation">(</span>parentLocation<span class="token punctuation">)</span><span class="token punctuation">;</span>
          lView <span class="token operator">=</span> <span class="token function">getParentInjectorView</span><span class="token punctuation">(</span>parentLocation<span class="token punctuation">,</span> lView<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// 遍历注入器树，直到找到潜​​在的匹配项，或者直到知道*不是*匹配项为止。</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span>injectorIndex <span class="token operator">!==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        ngDevMode <span class="token operator">&amp;&amp;</span> <span class="token function">assertNodeInjector</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> injectorIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 检查当前的注入器。如果匹配，请查看它是否包含令牌</span>
        <span class="token keyword">const</span> tView <span class="token operator">=</span> lView<span class="token punctuation">[</span><span class="token constant">TVIEW</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        ngDevMode <span class="token operator">&amp;&amp;</span>
          <span class="token function">assertTNodeForLView</span><span class="token punctuation">(</span>
            tView<span class="token punctuation">.</span>data<span class="token punctuation">[</span>injectorIndex <span class="token operator">+</span> NodeInjectorOffset<span class="token punctuation">.</span><span class="token constant">TNODE</span><span class="token punctuation">]</span> <span class="token keyword">as</span> TNode<span class="token punctuation">,</span>
            lView
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">bloomHasToken</span><span class="token punctuation">(</span>bloomHash<span class="token punctuation">,</span> injectorIndex<span class="token punctuation">,</span> tView<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 在这一点上，我们有一个*可能*包含令牌的注入器</span>
          <span class="token comment">// 因此我们逐步浏览与注入器的相应节点相关联的提供程序和指令以获取实例</span>
          <span class="token keyword">const</span> instance<span class="token operator">:</span> <span class="token constant">T</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">=</span> <span class="token generic-function"><span class="token function">searchTokensOnInjector</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>
            injectorIndex<span class="token punctuation">,</span>
            lView<span class="token punctuation">,</span>
            token<span class="token punctuation">,</span>
            previousTView<span class="token punctuation">,</span>
            flags<span class="token punctuation">,</span>
            hostTElementNode
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">!==</span> <span class="token constant">NOT_FOUND</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        parentLocation <span class="token operator">=</span> lView<span class="token punctuation">[</span>injectorIndex <span class="token operator">+</span> NodeInjectorOffset<span class="token punctuation">.</span><span class="token constant">PARENT</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>
          parentLocation <span class="token operator">!==</span> <span class="token constant">NO_PARENT_INJECTOR</span> <span class="token operator">&amp;&amp;</span>
          <span class="token function">shouldSearchParent</span><span class="token punctuation">(</span>
            flags<span class="token punctuation">,</span>
            lView<span class="token punctuation">[</span><span class="token constant">TVIEW</span><span class="token punctuation">]</span><span class="token punctuation">.</span>data<span class="token punctuation">[</span>injectorIndex <span class="token operator">+</span> NodeInjectorOffset<span class="token punctuation">.</span><span class="token constant">TNODE</span><span class="token punctuation">]</span> <span class="token operator">===</span>
              hostTElementNode
          <span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
          <span class="token function">bloomHasToken</span><span class="token punctuation">(</span>bloomHash<span class="token punctuation">,</span> injectorIndex<span class="token punctuation">,</span> lView<span class="token punctuation">)</span>
        <span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 在此节点上的任何位置都找不到 def，因此它是误报。遍历树并继续搜索</span>
          previousTView <span class="token operator">=</span> tView<span class="token punctuation">;</span>
          injectorIndex <span class="token operator">=</span> <span class="token function">getParentInjectorIndex</span><span class="token punctuation">(</span>parentLocation<span class="token punctuation">)</span><span class="token punctuation">;</span>
          lView <span class="token operator">=</span> <span class="token function">getParentInjectorView</span><span class="token punctuation">(</span>parentLocation<span class="token punctuation">,</span> lView<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// 如果我们不应该搜索父对象，或者如果祖先的 bloom 过滤器值没有对应于该指令的位</span>
          <span class="token comment">// 我们可以放弃遍历以查找特定的注入器</span>
          injectorIndex <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token generic-function"><span class="token function">lookupTokenUsingModuleInjector</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> token<span class="token punctuation">,</span> flags<span class="token punctuation">,</span> notFoundValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上述代码中，如果我们调用<code v-pre>injector.get(SomeClass)</code>方法，会产生以下步骤：</p>
<ol>
<li>Angular 在<code v-pre>SomeClass.__NG_ELEMENT_ID__</code>静态属性中查找哈希。</li>
<li>如果该哈希是工厂函数，则还有另一种特殊情况，即应通过调用该函数来初始化对象。</li>
<li>如果该哈希等于-1，则是一种特殊情况，我们将获得<code v-pre>NodeInjector</code>实例。</li>
<li>如果该哈希是一个数字，那么我们会从<code v-pre>TNode</code>获取<code v-pre>injectorIndex</code>。</li>
<li>查看模板布隆过滤器（<code v-pre>TView.data [injectorIndex]</code>），如果为真，那么我们将搜索<code v-pre>SomeClass</code>令牌（通过<code v-pre>tNode.providerIndexes</code>可以找到所需的令牌）。</li>
<li>如果模板布隆过滤器返回错误，那么会查看一下累积布隆过滤器。如果它为真，则继续进行遍历，否则将切换到<code v-pre>ModuleInjector</code>。</li>
</ol>
<p>该过程可以用以下流程图表示：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-2.png" alt=""></p>
<p>这便是在 Ivy 中，使用<code v-pre>NodeInjector</code>来解析依赖关系的过程。可以看到，该过程中还使用了两个布隆过滤器：累积布隆过滤器（cumulativeBloom）和模板布隆过滤器（templateBloom）。</p>
<h3 id="布隆过滤器" tabindex="-1"><a class="header-anchor" href="#布隆过滤器" aria-hidden="true">#</a> 布隆过滤器</h3>
<p>布隆过滤器常用于加快数据检索的过程，属于哈希函数的一种，你可以阅读 <a href="https://hackernoon.com/probabilistic-data-structures-bloom-filter-5374112a7832" target="_blank" rel="noopener noreferrer">Probabilistic Data structures: Bloom filter<ExternalLinkIcon/></a> 一文来了解它。</p>
<p>在 Ivy 中，一个视图可以具有与为该视图上的节点创建的注入器数量一样多的布隆过滤器。下图为可视化结果：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-1.png" alt=""></p>
<p>可以看到，布隆过滤器存储在前面提到的<code v-pre>LView/TView.data</code>布局中的<code v-pre>EXPANDO</code>部分:</p>
<ul>
<li><code v-pre>LView</code>和<code v-pre>TView.data</code>数组可以包含许多布隆过滤器，长度为 8 个时隙（[n，n + 7]索引），它们的数量与为其创建喷射器的节点数量成正比</li>
<li>每个布隆过滤器在“压缩的”<code v-pre>parentLocation</code>插槽（n + 8 索引）中都有一个指向父布隆过滤器的指针</li>
</ul>
<p>我们结合<code v-pre>NodeInjector</code>中查找依赖的过程，以以下简单的代码为例：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">"my-app"</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">
    &lt;div dirA>
      &lt;div dirB>Hello Ivy&lt;/div>
    &lt;/div>
  </span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppComponent</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Directive</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> selector<span class="token operator">:</span> <span class="token string">"[dirA]"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DirA</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Directive</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> selector<span class="token operator">:</span> <span class="token string">"[dirB]"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DirB</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token keyword">private</span> rootComp<span class="token operator">:</span> AppComponent<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Ivy 中，上述代码会生成这样的可视化视图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-3.png" alt=""></p>
<p>Ivy 在<code v-pre>TNode</code>上创建了<code v-pre>InjectorIndex</code>属性，以便知道专用于此节点布隆过滤器的位置。除此之外，Ivy 还在<code v-pre>LView</code>数组中存储了<code v-pre>parentLocation</code>指针，以便我们可以遍历所有父注入器。</p>
<p>而我们也看到，<code v-pre>NodeInjector</code>是具有对<code v-pre>TNode</code>和<code v-pre>LView</code>对象的引用的对象。因此，每个<code v-pre>NodeInjector</code>分别保存在<code v-pre>LView</code>的 9 个连续插槽和<code v-pre>TView.data</code>的 9 个连续插槽中，如图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-4.png" alt=""></p>
<p>那么，上面简单的代码示例中，DI 查找依赖的过程如图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-ivy-2-5.png" alt=""></p>
<blockquote>
<p>以上例子来自于 <a href="https://indepth.dev/posts/1268/angular-di-getting-to-know-the-ivy-nodeinjector" target="_blank" rel="noopener noreferrer">Angular DI: Getting to know the Ivy NodeInjector<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2>
<p>今天给大家介绍了 Ivy 编译器中的数据视图<code v-pre>LView/TView</code>，而依赖解析过程中需要从中取出对应的数据，该过程使用到<code v-pre>NodeInjector</code>。<code v-pre>NodeInjector</code>用于创建注入器，为了加快 DI 搜索依赖的过程，Ivy 还设计了累加布隆过滤器和模板布隆过滤器。</p>
<p>这些内容，是理解 Angular 中依赖注入过程中不可或缺的。而在查阅这部分文章和代码之前，我甚至无法想象在 Angular 中依赖注入过程如此复杂。很多时候，我们都认为前端领域并不存在太多的算法和数据结构相关的内容，实际上可能只是我们并没有接触到而已。</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://indepth.dev/posts/1268/angular-di-getting-to-know-the-ivy-nodeinjector" target="_blank" rel="noopener noreferrer">Angular DI: Getting to know the Ivy NodeInjector<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/angular/angular/blob/master/packages/core/src/render3/VIEW_DATA.md" target="_blank" rel="noopener noreferrer">DOCS: View Data Explanation<ExternalLinkIcon/></a></li>
<li><a href="https://hackernoon.com/probabilistic-data-structures-bloom-filter-5374112a7832" target="_blank" rel="noopener noreferrer">Probabilistic Data structures: Bloom filter<ExternalLinkIcon/></a></li>
</ul>
</div></template>


