import{_ as a,p,q as t,Q as e,R as n,t as s,a1 as c}from"./framework-5866ffd3.js";const o={},i=n("p",null,"温馨提示：本文过于抽象，慎入。",-1),l=n("p",null,[s("我们都知道，对于计算机来说，与外界交互的流程大概是"),n("code",null,"输入 => 处理 => 输出"),s("。不妨试试将目光拉长，世界上的种种事物都符合这样的抽象模型。再拓展看看，我们的世界也能进行这样的抽象。")],-1),u=c(`<p>本篇文章，主要用于来开开脑洞。</p><h1 id="单体模型" tabindex="-1"><a class="header-anchor" href="#单体模型" aria-hidden="true">#</a> 单体模型</h1><h2 id="个体" tabindex="-1"><a class="header-anchor" href="#个体" aria-hidden="true">#</a> 个体</h2><p>世上万物，皆是相互依赖而生。拿我们人类来说，既是独立的个体，同时也免不了与其他人或事物的交流。我们听到的、看到的、感受到的、触摸到的，经过复杂的神经传递、处理，然后反馈到身体的各个部位，再分别作出反馈。</p><p>上面这一段，我们来分析看看：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">人体</span><span class="token punctuation">(</span><span class="token parameter">听觉<span class="token punctuation">,</span> 视觉<span class="token punctuation">,</span> 触觉<span class="token punctuation">,</span> <span class="token operator">...</span>其他感觉</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">传递</span><span class="token punctuation">(</span>听觉<span class="token punctuation">,</span> 视觉<span class="token punctuation">,</span> 触觉<span class="token punctuation">,</span> <span class="token operator">...</span>其他感觉<span class="token punctuation">)</span><span class="token punctuation">;</span>
  反馈 <span class="token operator">=</span> <span class="token function">处理</span><span class="token punctuation">(</span>听觉<span class="token punctuation">,</span> 视觉<span class="token punctuation">,</span> 触觉<span class="token punctuation">,</span> <span class="token operator">...</span>其他感觉<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> 反馈<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们来抽象一下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">个体</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输出 <span class="token operator">=</span> <span class="token function">处理</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> 输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们仔细观察，可以发现这个模型适用于任何事物，当然至于事物存在的主观性和客观性哲学问题这里暂不讨论。</p><h2 id="群体" tabindex="-1"><a class="header-anchor" href="#群体" aria-hidden="true">#</a> 群体</h2><p>在这里，群体依然可以抽象为个体。</p><h3 id="_1-宏观角度" tabindex="-1"><a class="header-anchor" href="#_1-宏观角度" aria-hidden="true">#</a> 1. 宏观角度</h3><p>宏观上看，我们可以忽略个体之间的影响，或者说个体之间的影响并不能影响整体，我们可以得到：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>群体 <span class="token operator">=</span> 个体<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此时我们可以知道，群体符合上方所述的个体模型。</p><h3 id="_2-微观角度" tabindex="-1"><a class="header-anchor" href="#_2-微观角度" aria-hidden="true">#</a> 2. 微观角度</h3><p>微观上看，群体由多个个体组成，其中也包括了个体间的相互作用：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>群体 <span class="token operator">=</span> 个体 <span class="token operator">+</span> <span class="token operator">...</span> <span class="token operator">+</span> 个体 <span class="token operator">+</span> 各个个体间的相互作用
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 1. 假设个体间满足串行关系</span>
<span class="token keyword">function</span> <span class="token function">群体</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    个体<span class="token number">1</span>输出 <span class="token operator">=</span> <span class="token function">个体1处理</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
    个体<span class="token number">2</span>输出 <span class="token operator">=</span> <span class="token function">个体2处理</span><span class="token punctuation">(</span>个体<span class="token number">1</span>输出<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token operator">...</span>
    个体n输出 <span class="token operator">=</span> <span class="token function">个体n处理</span><span class="token punctuation">(</span>个体n<span class="token operator">-</span><span class="token number">1</span>输出<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> 个体n输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 2. 假设个体间满足并行关系</span>
<span class="token keyword">function</span> <span class="token function">群体</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 拆分给各个个体的输入，分别处理</span>
    <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> 个体<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        个体i输入 <span class="token operator">=</span> <span class="token function">获取个体输入</span><span class="token punctuation">(</span>输入<span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
        个体i输出 <span class="token operator">=</span> <span class="token function">个体i处理</span><span class="token punctuation">(</span>个体i输入<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 汇总输出</span>
    总输出 <span class="token operator">=</span> <span class="token function">汇总</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token operator">...</span>各个个体的输出<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> 总输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不管群体中个体间是并行、串行关系，还是其他更加复杂的关系，最后我们总会发现，微观角度的群体也总能满足个体模型，我们将其称作“<code>单体模型</code>”：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 单体模型</span>
<span class="token keyword">function</span> <span class="token function">单体</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输出 <span class="token operator">=</span> <span class="token function">处理</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> 输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="交互" tabindex="-1"><a class="header-anchor" href="#交互" aria-hidden="true">#</a> 交互</h1><p>前面也说了，作为独立的个体，同时个体与个体之间也存在交流，可以理解为交互。 我们抽象完单体，现在来看看单体间的交互（交流），首先我们从人机交互开始。</p><h2 id="人机交互" tabindex="-1"><a class="header-anchor" href="#人机交互" aria-hidden="true">#</a> 人机交互</h2><p>作为一个程序员，一天几乎有一半时间都在电脑面前，我们将人和电脑的互动归类为“<code>人机交互</code>”。</p><p>简单来说，<code>人机交互</code>无非包括两个过程：</p><ul><li>人 =&gt; 机：通过操作对机器进行输入，例如从键盘输入内容、用鼠标点击某些元素等</li><li>机 =&gt; 人：机器拿到输入内容，根据程序进行计算，可通过显示器、声音设备进行输出</li></ul><p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/human-machine.png" alt="image"></p><p>以上的过程我们可以抽象为两两单体之间的交互：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">人</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输出 <span class="token operator">=</span> <span class="token function">处理</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> 输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">机</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输出 <span class="token operator">=</span> <span class="token function">处理</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> 输出<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 1. 输入从机开始</span>
人的输入 <span class="token operator">=</span> <span class="token function">机</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
机的输入 <span class="token operator">=</span> <span class="token function">人</span><span class="token punctuation">(</span>人的输入<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 2. 输入从人开始</span>
机的输入 <span class="token operator">=</span> <span class="token function">人</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
人的输入 <span class="token operator">=</span> <span class="token function">机</span><span class="token punctuation">(</span>机的输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们得到一个鸡生蛋蛋生鸡的模型。</p><h2 id="多体交互" tabindex="-1"><a class="header-anchor" href="#多体交互" aria-hidden="true">#</a> 多体交互</h2><p>多体交互比两体交互稍微复杂，因为每个单体接收的输入是所有其他单体汇总的输入，而每个单体提供的输出也将成为所有其他单体输入直接或间接的影响。</p><p>这段话是不是有些似曾相识，因为它部分符合我们在前面讨论的微观群体的模型，也就是说我们在群体中：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> 单体<span class="token number">1</span>输入 <span class="token operator">=</span> <span class="token function">汇总</span><span class="token punctuation">(</span><span class="token operator">...</span>其他n<span class="token operator">-</span><span class="token number">1</span>个单体的输出<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们发现，<code>汇总</code>这个处理，与单体的模型非常相似，我们将其定义为一种<code>交互介质</code>：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">交互介质</span><span class="token punctuation">(</span><span class="token parameter">单体输出</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  单体输入 <span class="token operator">=</span> <span class="token function">处理</span><span class="token punctuation">(</span>单体输出<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> 单体输入<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个模型与单体模型完全一致，也就是说，交互介质也是单体的一种，这时候我们人机交互过程图调整为：</p><p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/conmunitation.png" alt="image"></p><p>也就是说，<code>群体 = 单体 + ... + 单体</code>这条公式是正确的，我们可以将群体直接视为多个单体的简单相加。</p><h2 id="流" tabindex="-1"><a class="header-anchor" href="#流" aria-hidden="true">#</a> 流</h2><p>虽然我们知道，所有的事物（包括交互介质）都可抽象为一个个的单体，但一个个单体之间是怎么衔接起来呢？</p><p>我们将所有的输入和输出抽象为“<code>流</code>”，对于流的传递（交互），我们使用熟悉的事件监听的方式：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">监听器</span><span class="token punctuation">(</span><span class="token parameter">输入流<span class="token punctuation">,</span> 单体</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输入流<span class="token punctuation">.</span><span class="token function-variable function">变更</span> <span class="token operator">=</span> <span class="token parameter">输入流</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">单体</span><span class="token punctuation">(</span>输入流<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而我们单体的输出流，通常也是其他单体的输入流，于是我们能看到整个流的流动：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>单体n输出 <span class="token operator">=</span> <span class="token function">单体n</span><span class="token punctuation">(</span><span class="token operator">...</span><span class="token function">单体2</span><span class="token punctuation">(</span><span class="token function">单体1</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果说我们需要流式处理我们的流，使用典型的 jQuery 链式调用方式，我们可以在创建单体的时候添加对于单体方法：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">添加流处理</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>n个单体</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 注册流的链用方法</span>
    n个单体<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">单体<span class="token punctuation">,</span> n</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        流<span class="token punctuation">.</span><span class="token function-variable function">单体n</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span> <span class="token operator">=</span> <span class="token function">单体</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

单体<span class="token number">1</span> <span class="token operator">=</span> <span class="token function">单体</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">...</span>
单体n <span class="token operator">=</span> <span class="token function">单体</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">添加流处理</span><span class="token punctuation">(</span>单体<span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">...</span><span class="token punctuation">,</span> 单体n<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时我们将流调整为第一人称，则有比上面稍微优雅的方式：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>输出流 <span class="token operator">=</span> 输入流<span class="token punctuation">.</span><span class="token function">单体1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">单体2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">[</span><span class="token operator">...</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">单体n</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="光与电的世界" tabindex="-1"><a class="header-anchor" href="#光与电的世界" aria-hidden="true">#</a> 光与电的世界</h2><p>我们来将抽象模型实例化。假设我们的世界，驱动能量为光和电，即各个单体的输入输出都只有光和电。 注意，这里我们将光和电视为两种完全独立的能源，可作为流的一种。</p><h3 id="光和电的单体" tabindex="-1"><a class="header-anchor" href="#光和电的单体" aria-hidden="true">#</a> 光和电的单体</h3><p>上面我们假设，单体和单体之间的交流通过电、光，所以我们得到这样的单体：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">单体</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输入光 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>光<span class="token punctuation">;</span>
  输出光 <span class="token operator">=</span> <span class="token function">处理光</span><span class="token punctuation">(</span>输入光<span class="token punctuation">)</span><span class="token punctuation">;</span>

  输入电 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>电<span class="token punctuation">;</span>
  输出电 <span class="token operator">=</span> <span class="token function">处理电</span><span class="token punctuation">(</span>输出电<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 输出</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">光</span><span class="token operator">:</span> 输出光<span class="token punctuation">,</span>
    <span class="token literal-property property">电</span><span class="token operator">:</span> 输出电
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面推出群体可抽象为个体，则我们的世界也是一个承接光电流的单体，而它对光和电的处理方式主要表现为传播（减弱或增强）：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">世界</span><span class="token punctuation">(</span><span class="token parameter">输入</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  输入光 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>光<span class="token punctuation">;</span>
  输出光 <span class="token operator">=</span> <span class="token function">传播</span><span class="token punctuation">(</span>输入光<span class="token punctuation">)</span><span class="token punctuation">;</span>

  输入电 <span class="token operator">=</span> 输入<span class="token punctuation">.</span>电<span class="token punctuation">;</span>
  输出电 <span class="token operator">=</span> <span class="token function">传播</span><span class="token punctuation">(</span>输出电<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 输出</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">光</span><span class="token operator">:</span> 输出光<span class="token punctuation">,</span>
    <span class="token literal-property property">电</span><span class="token operator">:</span> 输出电
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们假设世界是没有输入的，因此我们需要手动添加能量的来源：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">创建世界</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> 输入 <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  输入<span class="token punctuation">.</span>光 <span class="token operator">=</span> <span class="token function">添加光源</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  输入<span class="token punctuation">.</span>电 <span class="token operator">=</span> <span class="token function">添加电源</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">世界</span><span class="token punctuation">(</span>输入<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>说白了，我们创建了世界这样一个特殊的单体，同时给世界提供光和电的能量源。</p><h3 id="光和电的传播机制" tabindex="-1"><a class="header-anchor" href="#光和电的传播机制" aria-hidden="true">#</a> 光和电的传播机制</h3><p>从前面调整的流的第一人称链式用法，我们不难得到光和电的传播机制都符合：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>输出流 <span class="token operator">=</span> 输入流<span class="token punctuation">.</span><span class="token function">单体1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">单体2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">[</span><span class="token operator">...</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">单体n</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>而流从何处开始输入，又将在何处输出，取决于哪一段是你所需要观察的而已。</p><p>我们创建一个世界之后：</p><ol><li>流的规则设定好，流开始流动；</li><li>流的流动，表现为各单体对流的 输入 =&gt; 处理 =&gt; 输出；</li><li>单体和世界、单体间通过流来进行交互，表现为 输入 =&gt; 处理 =&gt; 输出；</li><li>其中每一段流作为研究对象，抽象成单体或者群体进行分析。</li></ol><p>当然，这与现实世界中的光和电的传播十分相似：</p><ol><li>对不同物质会产生不同的效果（单体的处理）。</li><li>会在经过不同的物质之后，增强或是减弱（输入流和输出流）。</li></ol><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1><p>以上尽是一些遐想，如果说太过于抽象，其实把流换成我们熟悉的程序中的数据流，或许容易理解得多。<br> 假设我们代码之中，一切可作为流，DOM 的事件流、http 请求流，然后通过各种函数（单体）来驱使我们的流流动，也不妨为一种有趣的角度。</p>`,70);function r(d,k){return p(),t("div",null,[i,l,e("more"),u])}const m=a(o,[["render",r],["__file","dialogue-abstraction.html.vue"]]);export{m as default};
