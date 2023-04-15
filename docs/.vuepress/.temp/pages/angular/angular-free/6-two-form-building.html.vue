<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文简单介绍模型驱动和模板驱动的表单，以及一些表单验证。</p>
<!--more-->
<h2 id="angular2-表单" tabindex="-1"><a class="header-anchor" href="#angular2-表单" aria-hidden="true">#</a> Angular2 表单</h2>
<h3 id="模板驱动" tabindex="-1"><a class="header-anchor" href="#模板驱动" aria-hidden="true">#</a> 模板驱动</h3>
<p>很多时候我们都会使用模板驱动的表单，因为很方便。
使用 Angular 模板语法编写模板，便是模板驱动的表单。</p>
<ol>
<li>FormModule</li>
</ol>
<p>使用模板驱动的一些模板语法，我们需要引入<code v-pre>FormModule</code>:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> FormsModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/forms"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这样，我们的<code v-pre>&lt;form&gt;</code>和<code v-pre>&lt;input&gt;</code>等表单元素便是 Angular 元素，拥有了像<code v-pre>ngModel</code>、<code v-pre>ngSubmit</code>等指令或属性。</p>
<ol start="2">
<li>模板驱动的表单</li>
</ol>
<p>这里我们使用最简单的<code v-pre>input</code>，需要输入一个 3-8 字符的名字。Component 中的 js 代码几乎没多少，而 html 模板如下：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-horizontal<span class="token punctuation">"</span></span> <span class="token attr-name">#form</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ngForm<span class="token punctuation">"</span></span> <span class="token attr-name">(ngSubmit)</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-2 control-label<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>name<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-6<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>
        <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-control<span class="token punctuation">"</span></span>
        <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span>
        <span class="token attr-name">[(ngModel)]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model.name<span class="token punctuation">"</span></span>
        <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>name<span class="token punctuation">"</span></span>
        <span class="token attr-name">required</span>
        <span class="token attr-name">maxlength</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>8<span class="token punctuation">"</span></span>
        <span class="token attr-name">minlength</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>3<span class="token punctuation">"</span></span>
        <span class="token attr-name">#name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ngModel<span class="token punctuation">"</span></span>
      <span class="token punctuation">/></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
    <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>alert alert-danger col-md-6 col-md-offset-2<span class="token punctuation">"</span></span>
    <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>name.errors &amp;&amp; (name.dirty || name.touched)<span class="token punctuation">"</span></span>
  <span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">[hidden]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!name.errors.required<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>必填<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">[hidden]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!name.errors.minlength<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>不小于3个字符<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">[hidden]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!name.errors.maxlength<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>不大于8个字符<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-sm-offset-2 col-sm-10<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">[disabled]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!form.valid<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>btn btn-info<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
        提交
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>通过<code v-pre>ngModel</code>跟踪修改状态与有效性验证</li>
</ul>
<p>在表单中使用<code v-pre>ngModel</code>可以获得比仅使用双向数据绑定更多的控制权，不仅仅跟踪状态。它还使用特定的 Angular CSS 类来更新控件，以反映当前状态。
可以利用这些 CSS 类来修改控件的外观，显示或隐藏消息。</p>
<ul>
<li><code v-pre>required</code>/<code v-pre>maxlength</code>/<code v-pre>minlength</code>: 用于表单校验
<ul>
<li><code v-pre>name.touched</code>: 控件被访问过</li>
<li><code v-pre>name.dirty</code>: 控件的值变化了</li>
<li><code v-pre>name.errors</code>: 控件校验错误</li>
</ul>
</li>
</ul>
<p>指向<code v-pre>input</code>控件的引用变量上的<code v-pre>valid</code>属性，可用于检查控件是否有效、是否显示/隐藏错误信息。</p>
<ul>
<li><code v-pre>#name=&quot;ngModel&quot;</code></li>
</ul>
<p><code v-pre>#name</code>是模板引用变量。使用井号(<code v-pre>#</code>)来声明引用变量。
模板引用变量通常用来引用模板中的某个 DOM 元素，它还可以引用 Angular 组件或指令或 Web Component。</p>
<p>指令的<code v-pre>exportAs</code>属性告诉 Angular 如何链接模板引用变量到指令。
这里把<code v-pre>name</code>设置为<code v-pre>ngModel</code>是因为<code v-pre>ngModel</code>指令的<code v-pre>exportAs</code>属性设置成了&quot;ngModel&quot;。
<code v-pre>name</code>属性的用途是有效性验证和对表单元素的变更进行追踪。</p>
<ul>
<li>使用<code v-pre>ngSubmit</code>提交该表单</li>
</ul>
<p>按钮位于表单的底部，它自己不做任何事，但因为有<code v-pre>type=&quot;submit&quot;</code>，所以会触发表单提交。
而要使得表单提交生效，需要把该表单的<code v-pre>ngSubmit</code>事件属性绑定到对应的提交事件。</p>
<p>如果需要校验，则需要添加<code v-pre>#form=&quot;ngForm&quot;</code>，将<code v-pre>form</code>变量<code v-pre>exportAs</code>属性设置成<code v-pre>ngForm</code>，可跟踪表单有效性验证：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-horizontal<span class="token punctuation">"</span></span> <span class="token attr-name">#form</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ngForm<span class="token punctuation">"</span></span> <span class="token attr-name">(ngSubmit)</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit()<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">[disabled]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!form.valid<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>btn btn-info<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    提交
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模型驱动" tabindex="-1"><a class="header-anchor" href="#模型驱动" aria-hidden="true">#</a> 模型驱动</h3>
<p>模型驱动表单又称为响应式表单，它将在 html 上的一些模板语法迁移到 js 中使用。
Angular 的响应式表单能让实现响应式编程风格更容易，这种编程风格更倾向于在非 UI 的数据模型（通常接收自服务器）之间显式的管理数据流，并且用一个 UI 导向的表单模型来保存屏幕上 HTML 控件的状态和值。响应式表单可以让使用响应式编程模式、测试和校验变得更容易。</p>
<p>简单地说，就是模型驱动表单更加灵活，值和状态的同步更新，以及测试性较好。</p>
<ol>
<li>异步 vs. 同步</li>
</ol>
<p>响应式表单是同步的。模板驱动表单是异步的。</p>
<p>模板驱动表单会委托指令来创建它们的表单控件。
使用响应式表单，我们会在代码中创建整个表单控件树。 我们可以立即更新一个值或者深入到表单中的任意节点，因为所有的控件都始终是可用的。</p>
<ol start="2">
<li>ReactiveFormsModule</li>
</ol>
<p>使用模型驱动的一些模板语法，我们需要引入<code v-pre>ReactiveFormsModule</code>:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> ReactiveFormsModule <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/forms"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="3">
<li>基础的表单类</li>
</ol>
<ul>
<li><code v-pre>AbstractControl</code>
<ul>
<li>是三个具体表单类的抽象基类</li>
<li>为它们提供了一些共同的行为和属性，其中有些是可观察对象（<code v-pre>Observable</code>）。</li>
</ul>
</li>
<li><code v-pre>FormControl</code>
<ul>
<li>用于跟踪一个单独的表单控件的值和有效性状态</li>
<li>它对应于一个 HTML 表单控件，比如输入框和下拉框</li>
</ul>
</li>
<li><code v-pre>FormGroup</code>
<ul>
<li>用于跟踪一组<code v-pre>AbstractControl</code>的实例的值和有效性状态</li>
<li>该组的属性中包含了它的子控件</li>
<li>组件中的顶级表单就是一个<code v-pre>FormGroup</code></li>
</ul>
</li>
<li><code v-pre>FormArray</code>
<ul>
<li>用于跟踪<code v-pre>AbstractControl</code>实例组成的有序数组的值和有效性状态</li>
</ul>
</li>
</ul>
<ol start="4">
<li><code v-pre>FormGroup</code></li>
</ol>
<p>有多个<code v-pre>FormControl</code>，把它们注册进一个父<code v-pre>FormGroup</code>中：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>reactiveForm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FormGroup</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">FormControl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">FormControl</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将<code v-pre>formGroup</code>关联到的是<code v-pre>form</code>元素上的<code v-pre>FormGroup</code>实例 reactiveForm：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span>
  <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-horizontal<span class="token punctuation">"</span></span>
  <span class="token attr-name">[formGroup]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>reactiveForm<span class="token punctuation">"</span></span>
  <span class="token attr-name">(ngSubmit)</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit()<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>formGroup</code>是一个响应式表单的指令，它拿到一个现有<code v-pre>FormGroup</code>实例，并把它关联到一个 HTML 元素上。</p>
<ol start="5">
<li>formControlName</li>
</ol>
<p>有了<code v-pre>FormGroup</code>，<code v-pre>name</code>输入框就需要再添加一个语法<code v-pre>formControlName=&quot;name&quot;</code>，以便让它关联到类中正确的<code v-pre>FormControl</code>上：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-2 control-label<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>name<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-6<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-control<span class="token punctuation">"</span></span> <span class="token attr-name">formControlName</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>name<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个语法告诉 Angular，查阅父<code v-pre>FormGroup</code>，然后在这个<code v-pre>FormGroup</code>中查阅一个名叫<code v-pre>name</code>的<code v-pre>FormControl</code>。</p>
<ol start="6">
<li>FormBuilder</li>
</ol>
<p><code v-pre>FormBuilder</code>类能通过处理控件创建的细节问题来帮我们减少重复劳动。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">private</span> <span class="token literal-property property">fb</span><span class="token operator">:</span> FormBuilder</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 注入FormBuilder</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createForm</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">createForm</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>reactiveForm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>fb<span class="token punctuation">.</span><span class="token function">group</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">''</span><span class="token punctuation">,</span> <span class="token punctuation">[</span>
                Validators<span class="token punctuation">.</span>required<span class="token punctuation">,</span>
                Validators<span class="token punctuation">.</span><span class="token function">minLength</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                Validators<span class="token punctuation">.</span><span class="token function">maxLength</span><span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span>
            <span class="token punctuation">]</span>
            <span class="token punctuation">]</span><span class="token punctuation">,</span>
            <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">''</span><span class="token punctuation">,</span>
                <span class="token punctuation">[</span>
                    Validators<span class="token punctuation">.</span>required<span class="token punctuation">,</span>
                    Validators<span class="token punctuation">.</span>email
                <span class="token punctuation">]</span>
            <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>FormBuilder.group</code>是一个用来创建<code v-pre>FormGroup</code>的工厂方法，它接受一个对象，对象的键和值分别是<code v-pre>FormControl</code>的名字和它的定义。
每个<code v-pre>FormControl</code>的设置都是<code v-pre>FormControl</code>名字和数组值。第一个数组元素是控件对应的当前值，第二个值（可选）是验证器函数或者验证器函数数组。</p>
<p>大多数验证器函数是 Angular 以<code v-pre>Validators</code>类的静态方法的形式提供的原装验证器。</p>
<ol start="7">
<li>valueChanges</li>
</ol>
<p>可以通过订阅表单控件的属性之一来了解表单控件变化。
<code v-pre>valueChanges</code>返回一个 RxJS 的 Observable 对象。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span>reactiveForm<span class="token punctuation">.</span>valueChanges<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">data</span> <span class="token operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onValueChanged</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里我们需要添加触发事件回调：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>    <span class="token comment">// 定义表单错误</span>
    formErrors <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">''</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token comment">// 对表单错误做说明映射</span>
    validationMessages <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token string">'名字必填'</span><span class="token punctuation">,</span>
            <span class="token literal-property property">minlength</span><span class="token operator">:</span> <span class="token string">'名字最少3个字符'</span><span class="token punctuation">,</span>
            <span class="token literal-property property">maxlength</span><span class="token operator">:</span> <span class="token string">'名字最多8个字符'</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token comment">// 表单更新触发回调</span>
    <span class="token function">onValueChanged</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token operator">?</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>reactiveForm<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">const</span> form <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reactiveForm<span class="token punctuation">;</span>
        <span class="token comment">// 遍历表单控件名字</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> field <span class="token keyword">in</span> <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">[</span>field<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">;</span> <span class="token comment">// 清除之前的错误信息</span>
            <span class="token keyword">const</span> control <span class="token operator">=</span> form<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>field<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 获取控件</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>control <span class="token operator">&amp;&amp;</span> control<span class="token punctuation">.</span>dirty <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>control<span class="token punctuation">.</span>valid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 遍历获取错误说明</span>
                <span class="token keyword">const</span> messages <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>validationMessages<span class="token punctuation">[</span>field<span class="token punctuation">]</span><span class="token punctuation">;</span>
                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> control<span class="token punctuation">.</span>errors<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">[</span>field<span class="token punctuation">]</span> <span class="token operator">+=</span> messages<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">' '</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终效果图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970774(1).png" alt="image"></p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>讲到这里，我们的两种 Angular 表单--模型驱动和模板驱动，它们的简单使用和校验已经完成。<br>
而需要更复杂一些的功能，像多级<code v-pre>FormGroup</code>、动态表单等，后面我们或许也会讲到。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/6-two-form-building" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/6-two-form-building/index.html#/home/page-setting" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


