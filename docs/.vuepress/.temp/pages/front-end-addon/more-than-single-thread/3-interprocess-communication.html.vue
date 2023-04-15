<template><div><p>该系列主要作为曾经的纯前端，对后台和底层的一些弥补，涉及进程、网络通信，以及对 node.js 和相关框架的学习。本节主要围绕进程间通信、进程间同步等内容。</p>
<!--more-->
<h1 id="进程间通信-ipc" tabindex="-1"><a class="header-anchor" href="#进程间通信-ipc" aria-hidden="true">#</a> 进程间通信（IPC）</h1>
<h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h2>
<p>进程间通信（IPC，Inter-Process Communication），指至少两个进程或线程间传送数据或信号的一些技术或方法。比如 shell 中的管道命令：<code v-pre>ps -ef | grep nginx</code>，一个命令的输出，作为另一个进程的输入，这就是进程间通信。</p>
<h3 id="使用进程间通信的理由" tabindex="-1"><a class="header-anchor" href="#使用进程间通信的理由" aria-hidden="true">#</a> 使用进程间通信的理由</h3>
<ul>
<li>信息共享：Web 服务器，通过网页浏览器使用进程间通信来共享 web 文件（网页等）和多媒体</li>
<li>加速：维基百科使用通过进程间通信进行交流的多服务器来满足用户的请求</li>
<li>模块化</li>
<li>私有权分离</li>
</ul>
<h3 id="与直接共享内存地址空间的多线程编程相比-进程间通信的缺点" tabindex="-1"><a class="header-anchor" href="#与直接共享内存地址空间的多线程编程相比-进程间通信的缺点" aria-hidden="true">#</a> 与直接共享内存地址空间的多线程编程相比，进程间通信的缺点</h3>
<ul>
<li>采用了某种形式的内核开销，降低了性能</li>
<li>几乎大部分 IPC 都不是程序设计的自然扩展，往往会大大地增加程序的复杂度</li>
</ul>
<h3 id="进程间通信主要需要解决三个问题-线程间通信需要解决后两个问题" tabindex="-1"><a class="header-anchor" href="#进程间通信主要需要解决三个问题-线程间通信需要解决后两个问题" aria-hidden="true">#</a> 进程间通信主要需要解决三个问题（线程间通信需要解决后两个问题）</h3>
<ol>
<li>一个进程如何给另一个进程传递信息。</li>
<li>如何确保进程之间不互相干扰、妨碍。</li>
<li>当进程间出现依赖关系时，该如何处理。</li>
</ol>
<h3 id="本地的进程间通信-ipc-可以总结为下面-4-类技术" tabindex="-1"><a class="header-anchor" href="#本地的进程间通信-ipc-可以总结为下面-4-类技术" aria-hidden="true">#</a> 本地的进程间通信（IPC）可以总结为下面 4 类技术</h3>
<ol>
<li><strong>消息传递（管道、FIFO、消息队列）</strong></li>
<li><strong>同步（互斥量、条件变量、读写锁、文件和写记录锁、信号量）</strong></li>
<li><strong>共享内存（匿名的和具名的）</strong></li>
<li><strong>远程过程调用（Solaris 门和 Sun RPC）</strong></li>
</ol>
<h2 id="进程间通信方式" tabindex="-1"><a class="header-anchor" href="#进程间通信方式" aria-hidden="true">#</a> 进程间通信方式</h2>
<ul>
<li>
<p><strong>管道/匿名管道(pipe)</strong>：</p>
<blockquote>
<p>管道是一种半双工的通信方式，数据只能单向流动，而且只能在具有亲缘关系的进程间使用。
进程的亲缘关系通常是指父子进程关系。</p>
</blockquote>
</li>
<li>
<p><strong>有名管道(named pipe)</strong>：</p>
<blockquote>
<p>有名管道也是半双工的通信方式，有名管道克服了管道没有名字的限制。
因此，除具有管道所具有的功能外，它还允许无亲缘关系进程间的通信。</p>
</blockquote>
</li>
<li>
<p><strong>信号量(semophore)</strong>：</p>
<blockquote>
<p>信号量是一个计数器，可以用来控制多个进程对共享资源的访问。
常作为一种锁机制，防止某进程正在访问共享资源时，其他进程也访问该资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。</p>
</blockquote>
</li>
<li>
<p><strong>消息队列(message queue)</strong>：</p>
<blockquote>
<p>消息队列是由消息的链表，存放在内核中并由消息队列标识符标识。
有足够权限的进程可以向队列中添加消息，被赋予读权限的进程则可以读走队列中的消息。消息队列克服了信号承载信息量少，管道只能承载无格式字节流以及缓冲区大小受限等缺点。</p>
</blockquote>
</li>
<li>
<p><strong>信号 (sinal)</strong>：</p>
<blockquote>
<p>信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生。
除了用于进程间通信外，进程还可以发送信号给进程本身。</p>
</blockquote>
</li>
<li>
<p><strong>共享内存(shared memory)</strong>：</p>
<blockquote>
<p>共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。
共享内存是最快的 IPC 方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往与其他通信机制，如信号两，配合使用，来实现进程间的同步和通信。</p>
</blockquote>
</li>
<li>
<p><strong>套接字(socket)</strong>：</p>
<blockquote>
<p>套解口也是一种进程间通信机制，与其他通信机制不同的是，它可用于不同机器之间的进程通信。</p>
</blockquote>
</li>
<li>
<p>在 Windows OS 上进程间通信：</p>
<ul>
<li>文件映射、共享内存、匿名管道、命名管道、动态连接库、远程过程调用、Sockets、WM_COPYDATA 消息</li>
</ul>
</li>
<li>
<p>linux 下进程间通信：</p>
<ul>
<li>管道（Pipe）及有名管道（named pipe）、信号（Signal）、报文（Message）队列（消息队列）、共享内存、信号量（semaphore）、套接口（Socket）</li>
</ul>
</li>
</ul>
<h2 id="进程间同步机制" tabindex="-1"><a class="header-anchor" href="#进程间同步机制" aria-hidden="true">#</a> 进程间同步机制</h2>
<p><strong>进程同步</strong><br>
进程同步也是进程之间直接的制约关系，是为完成某种任务而建立的两个或多个线程，这个线程需要在某些位置上协调他们的工作次序而等待、传递信息所产生的制约关系。进程间的直接制约关系来源于他们之间的合作。</p>
<p><strong>进程互斥</strong><br>
进程互斥是进程之间的间接制约关系。当一个进程进入临界区使用临界资源时，另一个进程必须等待。只有当使用临界资源的进程退出临界区后，这个进程才会解除阻塞状态。</p>
<p><strong>进程间同步机制包括临界区、互斥区、事件、信号量四种方式。</strong></p>
<h3 id="_1-临界区" tabindex="-1"><a class="header-anchor" href="#_1-临界区" aria-hidden="true">#</a> 1. 临界区</h3>
<p>通过对多线程的串行化来访问公共资源或一段代码，速度快，适合控制数据访问。<br>
在任意时刻只允许一个线程对共享资源进行访问，如果有多个线程试图访问公共资源，那么在有一个线程进入后，其他试图访问公共资源的线程将被挂起，并一直等到进入临界区的线程离开，临界区在被释放后，其他线程才可以抢占。</p>
<h3 id="_2-互斥量" tabindex="-1"><a class="header-anchor" href="#_2-互斥量" aria-hidden="true">#</a> 2. 互斥量</h3>
<p>采用互斥对象机制。<br>
只有拥有互斥对象的线程才有访问公共资源的权限，因为互斥对象只有一个，所以能保证公共资源不会同时被多个线程访问。<br>
互斥不仅能实现同一应用程序的公共资源安全共享，还能实现不同应用程序的公共资源安全共享。<br>
互斥量比临界区复杂。因为使用互斥不仅仅能够在同一应用程序不同线程中实现资源的安全共享，而且可以在不同应用程序的线程之间实现对资源的安全共享。</p>
<p><strong>实现临界区互斥的基本方法：硬件实现、信号量实现。</strong></p>
<h3 id="_3-信号量" tabindex="-1"><a class="header-anchor" href="#_3-信号量" aria-hidden="true">#</a> 3. 信号量</h3>
<p>它允许多个线程在同一时刻访问同一资源，但是需要限制在同一时刻访问此资源的最大线程数目。<br>
信号量对象对线程的同步方式与前面几种方法不同，信号允许多个线程同时使用共享资源，这与操作系统中的 PV 操作相同。它指出了同时访问共享资源的线程最大数目。它允许多个线程在同一时刻访问同一资源，但是需要限制在同一时刻访问此资源的最大线程数目。<br>
简单来说，例如多个线程同时读取共享资源，但有写操作的时候则锁定。</p>
<h3 id="_4-事件" tabindex="-1"><a class="header-anchor" href="#_4-事件" aria-hidden="true">#</a> 4. 事件</h3>
<p>通过通知操作的方式来保持线程的同步，还可以方便实现对多个线程的优先级比较的操作。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.cnblogs.com/wawlian/archive/2012/02/18/2356865.html" target="_blank" rel="noopener noreferrer">《现代操作系统》读书笔记之——进程间通信<ExternalLinkIcon/></a></li>
<li><a href="http://blog.csdn.net/coolmeme/article/details/6053418" target="_blank" rel="noopener noreferrer">《进程间通信（IPC）》<ExternalLinkIcon/></a></li>
<li><a href="http://www.jianshu.com/p/c1015f5ffa74" target="_blank" rel="noopener noreferrer">《进程间通信 IPC (InterProcess Communication)》<ExternalLinkIcon/></a></li>
<li><a href="http://www.cnblogs.com/memewry/archive/2012/08/22/2651696.html" target="_blank" rel="noopener noreferrer">《进程/线程同步的方式和机制，进程间通信》<ExternalLinkIcon/></a></li>
<li><a href="http://www.cnblogs.com/CareySon/archive/2012/04/14/Process-SynAndmutex.html" target="_blank" rel="noopener noreferrer">《浅谈进程同步和互斥的概念》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>以上内容其实主要是操作系统的设计相关，这里其实不涉及很多，作为课外知识补充一下就好。<br>
如果是强迫症或者求知欲比较强烈的孩子，可以深入研究一下进程、队列、锁等等等等。感兴趣的也可以去看看操作系统设计相关的书籍。</p>
</div></template>


