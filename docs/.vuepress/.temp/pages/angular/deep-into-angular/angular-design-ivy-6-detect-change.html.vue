<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文围绕 Angular 的核心功能 Ivy 编译器，介绍其中变更检测的过程。</p>
<!--more-->
<p>上一篇<RouterLink to="/angular/deep-into-angular/angular-design-ivy-5-incremental-dom.html">《14.Ivy编译器之增量DOM》</RouterLink>中，我介绍了 Ivy 编译器中使用了增量 DOM 的设计。在 Ivy 中，通过编译器将模板编译为<code v-pre>template</code>渲染函数，该过程会将对模板的解析编译成增量 DOM 相关的指令。其中，在<code v-pre>elementStart()</code>执行时，我们可以看到会通过<code v-pre>createElementNode()</code>方法来创建 DOM。</p>
<p>而增量 DOM 中的变更检测、Diff 和更新 DOM 等能力，都与<code v-pre>elementStart()</code>方法紧紧关联着。</p>
<h2 id="ivy-中的变更检测" tabindex="-1"><a class="header-anchor" href="#ivy-中的变更检测" aria-hidden="true">#</a> Ivy 中的变更检测</h2>
<h3 id="ngzone-的自动变更检测" tabindex="-1"><a class="header-anchor" href="#ngzone-的自动变更检测" aria-hidden="true">#</a> ngZone 的自动变更检测</h3>
<p>在<RouterLink to="/angular/deep-into-angular/angular-design-zone-ngzone.html">《4.Zone区域之ngZone》</RouterLink>一文中，我们介绍了默认情况下，所有异步操作都在 Angular Zone 内。该逻辑在创建 Angular 应用的时候便已添加，这会自动触发变更检测：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ApplicationRef</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span>
      <span class="token keyword">private</span> _zone<span class="token operator">:</span> NgZone<span class="token punctuation">,</span> <span class="token keyword">private</span> _injector<span class="token operator">:</span> Injector<span class="token punctuation">,</span> <span class="token keyword">private</span> _exceptionHandler<span class="token operator">:</span> ErrorHandler<span class="token punctuation">,</span>
      <span class="token keyword">private</span> _componentFactoryResolver<span class="token operator">:</span> ComponentFactoryResolver<span class="token punctuation">,</span>
      <span class="token keyword">private</span> _initStatus<span class="token operator">:</span> ApplicationInitStatus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Microtask 为空时，触发变更检测</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_onMicrotaskEmptySubscription <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>_zone<span class="token punctuation">.</span>onMicrotaskEmpty<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token function-variable function">next</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>_zone<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token comment">// tick 为变更检测的逻辑，会重新进行 template 的计算和渲染</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">tick</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>tick</code>方法中，核心的逻辑是调用了<code v-pre>view.detectChanges()</code>来检测更新。该接口来自<code v-pre>ChangeDetectorRef</code>，它提供变更检测功能的基类。</p>
<p>变更检测树收集所有要检查变更的视图，可以使用方法从树中添加和删除视图，启动更改检测，并将视图显式标记为<code v-pre>_dirty_</code>，这意味着它们已更改并需要重新渲染。</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">ChangeDetectorRef</span> <span class="token punctuation">{</span>
  <span class="token comment">// 当视图中的输入更改或事件触发时，组件通常被标记为脏（需要重新渲染）</span>
  <span class="token comment">// 调用此方法以确保即使未发生这些触发器也会检查组件</span>
  <span class="token keyword">abstract</span> <span class="token function">markForCheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>

  <span class="token comment">// 从变更检测树中分离此视图，在重新附加之前不会检查分离的视图</span>
  <span class="token comment">// 与 detectChanges() 结合使用以实现本地更改检测检查</span>
  <span class="token keyword">abstract</span> <span class="token function">detach</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>

  <span class="token comment">// 检查此视图及其子视图</span>
  <span class="token comment">// 与 detach() 结合使用以实现本地更改检测检查</span>
  <span class="token keyword">abstract</span> <span class="token function">detectChanges</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>

  <span class="token comment">// 检查更改检测器及其子项，如果检测到任何更改则抛出</span>
  <span class="token keyword">abstract</span> <span class="token function">checkNoChanges</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>

  <span class="token comment">// 将先前分离的视图重新附加到更改检测树</span>
  <span class="token comment">// 默认情况下，视图附加到树</span>
  <span class="token keyword">abstract</span> <span class="token function">reattach</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述的<code v-pre>ChangeDetectorRef</code>中，变更检测<code v-pre>detectChanges()</code>中，核心逻辑调用了<code v-pre>refreshView()</code>。</p>
<h3 id="refreshview-视图更新处理" tabindex="-1"><a class="header-anchor" href="#refreshview-视图更新处理" aria-hidden="true">#</a> refreshView 视图更新处理</h3>
<p><code v-pre>refreshView()</code>用于在更新模式下处理视图：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token generic-function"><span class="token function">refreshView</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>
    tView<span class="token operator">:</span> TView<span class="token punctuation">,</span> lView<span class="token operator">:</span> LView<span class="token punctuation">,</span> templateFn<span class="token operator">:</span> ComponentTemplate<span class="token operator">&lt;</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token operator">></span><span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">,</span> context<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  ngDevMode <span class="token operator">&amp;&amp;</span> <span class="token function">assertEqual</span><span class="token punctuation">(</span><span class="token function">isCreationMode</span><span class="token punctuation">(</span>lView<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token string">'Should be run in update mode'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> lView<span class="token punctuation">[</span><span class="token constant">FLAGS</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token function">enterView</span><span class="token punctuation">(</span>lView<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> isInCheckNoChangesPass <span class="token operator">=</span> <span class="token function">isInCheckNoChangesMode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token function">resetPreOrderHookFlags</span><span class="token punctuation">(</span>lView<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token function">setBindingIndex</span><span class="token punctuation">(</span>tView<span class="token punctuation">.</span>bindingStartIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>templateFn <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 1. 执行 template 模板函数</span>
      <span class="token function">executeTemplate</span><span class="token punctuation">(</span>tView<span class="token punctuation">,</span> lView<span class="token punctuation">,</span> templateFn<span class="token punctuation">,</span> RenderFlags<span class="token punctuation">.</span>Update<span class="token punctuation">,</span> context<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 2. 执行预处理钩子，包括 OnInit、OnChanges、DoCheck</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isInCheckNoChangesPass<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hooksInitPhaseCompleted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executeCheckHooks</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> preOrderCheckHooks<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">executeInitAndCheckHooks</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> preOrderHooks<span class="token punctuation">,</span> InitPhaseState<span class="token punctuation">.</span>OnInitHooksToBeRun<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">incrementInitPhaseFlags</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> InitPhaseState<span class="token punctuation">.</span>OnInitHooksToBeRun<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 首先将在此 lView 中声明的移植视图标记为需要在其插入点刷新</span>
    <span class="token comment">// 这是为了避免模板在这个 LView 中定义但它的声明出现在插入组件之后的情况</span>
    <span class="token function">markTransplantedViewsForRefresh</span><span class="token punctuation">(</span>lView<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 遍历嵌入式视图（通过 ViewContainerRef API 创建的视图）并通过执行关联的模板函数刷新它们</span>
    <span class="token function">refreshEmbeddedViews</span><span class="token punctuation">(</span>lView<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 3. 在调用内容钩子之前，必须刷新内容查询结果</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tView<span class="token punctuation">.</span>contentQueries <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">refreshContentQueries</span><span class="token punctuation">(</span>tView<span class="token punctuation">,</span> lView<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 执行内容钩子，包括 AfterContentInit, AfterContentChecked</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isInCheckNoChangesPass<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hooksInitPhaseCompleted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executeCheckHooks</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> contentCheckHooks<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">executeInitAndCheckHooks</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> contentHooks<span class="token punctuation">,</span> InitPhaseState<span class="token punctuation">.</span>AfterContentInitHooksToBeRun<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">incrementInitPhaseFlags</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> InitPhaseState<span class="token punctuation">.</span>AfterContentInitHooksToBeRun<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 4. 设置 host 绑定</span>
    <span class="token function">processHostBindingOpCodes</span><span class="token punctuation">(</span>tView<span class="token punctuation">,</span> lView<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 5. 刷新子组件视图</span>
    <span class="token keyword">const</span> components <span class="token operator">=</span> tView<span class="token punctuation">.</span>components<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>components <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">refreshChildComponents</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> components<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 刷新子组件后必须执行视图查询，因为此视图中的模板可以插入子组件中</span>
    <span class="token comment">// 如果视图查询在子组件刷新之前执行，则模板可能尚未插入</span>
    <span class="token keyword">const</span> viewQuery <span class="token operator">=</span> tView<span class="token punctuation">.</span>viewQuery<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>viewQuery <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">executeViewQueryFn</span><span class="token punctuation">(</span>RenderFlags<span class="token punctuation">.</span>Update<span class="token punctuation">,</span> viewQuery<span class="token punctuation">,</span> context<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 执行视图钩子，包括 AfterViewInit, AfterViewChecked</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isInCheckNoChangesPass<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hooksInitPhaseCompleted<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executeCheckHooks</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> viewCheckHooks<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">executeInitAndCheckHooks</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> viewHooks<span class="token punctuation">,</span> InitPhaseState<span class="token punctuation">.</span>AfterViewInitHooksToBeRun<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">incrementInitPhaseFlags</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> InitPhaseState<span class="token punctuation">.</span>AfterViewInitHooksToBeRun<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 我们需要确保我们只在成功的 refreshView 上翻转标志</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tView<span class="token punctuation">.</span>firstUpdatePass <span class="token operator">===</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      tView<span class="token punctuation">.</span>firstUpdatePass <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 在检查无变化模式下运行时不要重置脏状态</span>
    <span class="token comment">// 例如：在 ngAfterViewInit 钩子中将 OnPush 组件标记为脏组件以刷新 NgClass 绑定应该可以工作</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>isInCheckNoChangesPass<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      lView<span class="token punctuation">[</span><span class="token constant">FLAGS</span><span class="token punctuation">]</span> <span class="token operator">&amp;=</span> <span class="token operator">~</span><span class="token punctuation">(</span>LViewFlags<span class="token punctuation">.</span>Dirty <span class="token operator">|</span> LViewFlags<span class="token punctuation">.</span>FirstLViewPass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>lView<span class="token punctuation">[</span><span class="token constant">FLAGS</span><span class="token punctuation">]</span> <span class="token operator">&amp;</span> LViewFlags<span class="token punctuation">.</span>RefreshTransplantedView<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      lView<span class="token punctuation">[</span><span class="token constant">FLAGS</span><span class="token punctuation">]</span> <span class="token operator">&amp;=</span> <span class="token operator">~</span>LViewFlags<span class="token punctuation">.</span>RefreshTransplantedView<span class="token punctuation">;</span>
      <span class="token function">updateTransplantedViewCount</span><span class="token punctuation">(</span>lView<span class="token punctuation">[</span><span class="token constant">PARENT</span><span class="token punctuation">]</span> <span class="token keyword">as</span> LContainer<span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
    <span class="token function">leaveView</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，<code v-pre>refreshView()</code>的处理包括按特定顺序执行的多个步骤：</p>
<ol>
<li>在更新模式下，执行<code v-pre>template</code>模板函数。</li>
<li>执行钩子。</li>
<li>刷新 Query 查询。</li>
<li>设置 host 绑定。</li>
<li>刷新子（嵌入式和组件）视图。</li>
</ol>
<p>除此之外，在变更检测的最开始执行了<code v-pre>enterView()</code>，此时 Angular 会用新的<code v-pre>LView</code>交换当前的<code v-pre>LView</code>。这样的处理主要出于性能原因，通过将<code v-pre>LView</code>存储在模块的顶层，最大限度地减少了要读取的属性数量。</p>
<p><code v-pre>LView</code>用于存储从模板调用指令时处理指令所需的所有信息，在<a href="">《Angular框架解读--Ivy编译器的视图数据和依赖解析》</a>中有介绍。</p>
<p>每个嵌入视图和组件视图都有自己的<code v-pre>LView</code>。在处理特定视图时，我们将<code v-pre>viewData</code>设置为该<code v-pre>LView</code>。当该视图完成处理后，<code v-pre>viewData</code>被设置回原始<code v-pre>viewData</code>之前的任何内容（父<code v-pre>LView</code>）。</p>
<p>在<code v-pre>refreshView()</code>处理中，每当进入新视图时会存储<code v-pre>LView</code>以备后用。我们也可以看到当退出视图时，通过执行<code v-pre>leaveView()</code>离开当前的<code v-pre>LView</code>，恢复原来的状态。</p>
<p>以上便是变更检测过程中的视图处理逻辑。</p>
<h3 id="创建与更新视图的处理" tabindex="-1"><a class="header-anchor" href="#创建与更新视图的处理" aria-hidden="true">#</a> 创建与更新视图的处理</h3>
<p>我们可以对比下创建视图的过程，处理视图创建的过程在<code v-pre>renderView()</code>中实现。</p>
<p><code v-pre>renderView()</code>用于在创建模式下处理视图，该过程包括按特定顺序执行的多个步骤：</p>
<ol>
<li>创建视图查询函数（如果有）。</li>
<li>在创建模式下，执行<code v-pre>template()</code>模板函数。</li>
<li>更新静态 Query 查询（如果有）。</li>
<li>创建在给定视图中定义的子组件。</li>
</ol>
<p>在上一篇文章中，我们介绍了这样一个组件：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> Input <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/core"</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">"greet"</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token string">"&lt;div> Hello, {{name}}! &lt;/div>"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">GreetComponent</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Input</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经<code v-pre>ngtsc</code>编译后，产物会大概长这个样子：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>GreetComponent<span class="token punctuation">.</span>ɵcmp <span class="token operator">=</span> i0<span class="token punctuation">.</span><span class="token function">ɵɵdefineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> GreetComponent<span class="token punctuation">,</span>
  <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">"greet"</span><span class="token punctuation">,</span>
  <span class="token function-variable function">factory</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">GreetComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token function-variable function">template</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">rf<span class="token punctuation">,</span> ctx</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 创建模式下</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rf <span class="token operator">&amp;</span> RenderFlags<span class="token punctuation">.</span>Create<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵelementStart</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token string">"div"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵtext</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵelementEnd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 更新模式下</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rf <span class="token operator">&amp;</span> RenderFlags<span class="token punctuation">.</span>Update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵadvance</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵtextInterpolate1</span><span class="token punctuation">(</span><span class="token string">"Hello "</span><span class="token punctuation">,</span> ctx<span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token string">"!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，创建模式下的模板函数逻辑，与更新视图模式下的模板函数逻辑是有区别的。在创建模式下，<code v-pre>elementStart</code>、<code v-pre>elementEnd</code>我们在上一篇文章中有详细地介绍了。而在更新模式下，<code v-pre>textInterpolate1</code>表示当文本节点有 1 个内插值时，使用由其他文本包围的单个绑定值更新文本内容：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">interpolation1</span><span class="token punctuation">(</span>lView<span class="token operator">:</span> LView<span class="token punctuation">,</span> prefix<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> v0<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">,</span> suffix<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token operator">|</span>
    <span class="token constant">NO_CHANGE</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> different <span class="token operator">=</span> <span class="token function">bindingUpdated</span><span class="token punctuation">(</span>lView<span class="token punctuation">,</span> <span class="token function">nextBindingIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> v0<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> different <span class="token operator">?</span> prefix <span class="token operator">+</span> <span class="token function">renderStringify</span><span class="token punctuation">(</span>v0<span class="token punctuation">)</span> <span class="token operator">+</span> suffix <span class="token operator">:</span> <span class="token constant">NO_CHANGE</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以见到，在具体的模板函数指令中，会自行进行变更的检查，如果有发生了变化，则进行更新。<code v-pre>bindingUpdated()</code>方法会在需要更改时更新绑定，然后返回是否已更新。</p>
<p>而对于视图更新时，除了<code v-pre>textInterpolate1</code>这种比较简单的场景下的模板更新，子组件通过<code v-pre>refreshComponent</code>来处理：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">refreshComponent</span><span class="token punctuation">(</span>hostLView<span class="token operator">:</span> LView<span class="token punctuation">,</span> componentHostIdx<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  ngDevMode <span class="token operator">&amp;&amp;</span> <span class="token function">assertEqual</span><span class="token punctuation">(</span><span class="token function">isCreationMode</span><span class="token punctuation">(</span>hostLView<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token string">'Should be run in update mode'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> componentView <span class="token operator">=</span> <span class="token function">getComponentLViewByIndex</span><span class="token punctuation">(</span>componentHostIdx<span class="token punctuation">,</span> hostLView<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 仅应刷新 CheckAlways 或 OnPush 且 Dirty 的附加组件</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">viewAttachedToChangeDetector</span><span class="token punctuation">(</span>componentView<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> tView <span class="token operator">=</span> componentView<span class="token punctuation">[</span><span class="token constant">TVIEW</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>componentView<span class="token punctuation">[</span><span class="token constant">FLAGS</span><span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token punctuation">(</span>LViewFlags<span class="token punctuation">.</span>CheckAlways <span class="token operator">|</span> LViewFlags<span class="token punctuation">.</span>Dirty<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 此处检测组件是否被标记为 CheckAlways 或者 Dirty，此时才进行该组件的视图更新</span>
      <span class="token function">refreshView</span><span class="token punctuation">(</span>tView<span class="token punctuation">,</span> componentView<span class="token punctuation">,</span> tView<span class="token punctuation">.</span>template<span class="token punctuation">,</span> componentView<span class="token punctuation">[</span><span class="token constant">CONTEXT</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>componentView<span class="token punctuation">[</span><span class="token constant">TRANSPLANTED_VIEWS_TO_REFRESH</span><span class="token punctuation">]</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 仅应刷新 CheckAlways 或 OnPush 且脏的附加组件</span>
      <span class="token function">refreshContainsDirtyView</span><span class="token punctuation">(</span>componentView<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样的，在处理子组件的时候，需要检查子组件是否被标记为 CheckAlways 或者 Dirty，才进入组件视图并处理其绑定、查询等来刷新组件。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>以上，便是 Angular Ivy 中的变更检测了。</p>
<p>可以看到，在 Angular 中将被标记为 CheckAlways 或者 Dirty 的组件进行视图刷新，在每个变更周期中，会执行<code v-pre>template()</code>模板函数中的更新模式下逻辑。而在<code v-pre>template()</code>模板函数中的具体指令逻辑中，还会根据原来的值和新的值进行比较，有差异的时候才会进行更新。</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://indepth.dev/posts/1271/angular-ivy-change-detection-execution-are-you-prepared" target="_blank" rel="noopener noreferrer">Angular Ivy change detection execution: are you prepared?<ExternalLinkIcon/></a></li>
<li><a href="https://indepth.dev/posts/1062/ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection" target="_blank" rel="noopener noreferrer">Ivy engine in Angular: first in-depth look at compilation, runtime and change detection<ExternalLinkIcon/></a></li>
<li><a href="https://indepth.dev/posts/1053/everything-you-need-to-know-about-change-detection-in-angular" target="_blank" rel="noopener noreferrer">Everything you need to know about change detection in Angular<ExternalLinkIcon/></a></li>
</ul>
</div></template>


