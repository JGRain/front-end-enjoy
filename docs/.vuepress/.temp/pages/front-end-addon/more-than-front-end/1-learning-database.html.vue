<template><div><p>该系列用于记录在工作中的一些技能补全。什么技能？大概是前端所缺的很多的知识和技术吧。本节我们一起来了解下数据库。</p>
<!--more-->
<h1 id="认识数据库" tabindex="-1"><a class="header-anchor" href="#认识数据库" aria-hidden="true">#</a> 认识数据库</h1>
<p>以前对数据库的了解，大概就是一个存放数据的地方，可进行增删查改，更多的就...慢慢学吧。</p>
<h2 id="数据库事务" tabindex="-1"><a class="header-anchor" href="#数据库事务" aria-hidden="true">#</a> 数据库事务</h2>
<h3 id="事务是什么" tabindex="-1"><a class="header-anchor" href="#事务是什么" aria-hidden="true">#</a> 事务是什么</h3>
<p>所谓事务是用户定义的一个数据库操作序列，这些操作要么全做要么全不做，是一个不可分割的工作单位。</p>
<p>一个数据库事务通常包含了一个序列的对数据库的读/写操作。它的存在包含有以下两个目的：</p>
<ul>
<li>为数据库操作序列提供了一个从失败中恢复到正常状态的方法，同时提供了数据库即使在异常状态下仍能保持一致性的方法。</li>
<li>当多个应用程序在并发访问数据库时，可以在这些应用程序之间提供一个隔离方法，以防止彼此的操作互相干扰。</li>
</ul>
<p>当事务被提交给了 DBMS（数据库管理系统），则 DBMS（数据库管理系统）需要确保该事务中的所有操作都成功完成且其结果被永久保存在数据库中，如果事务中有的操作没有成功完成，则事务中的所有操作都需要被回滚，回到事务执行前的状态;同时，该事务对数据库或者其他事务的执行无影响，所有的事务都好像在独立的运行。</p>
<h3 id="acid-的事务" tabindex="-1"><a class="header-anchor" href="#acid-的事务" aria-hidden="true">#</a> ACID 的事务</h3>
<p>并非任意的对数据库的操作序列都是数据库事务。数据库事务拥有以下四个特性，习惯上被称之为 ACID 特性。</p>
<h4 id="原子性-atomicity" tabindex="-1"><a class="header-anchor" href="#原子性-atomicity" aria-hidden="true">#</a> 原子性（Atomicity）</h4>
<p>事务作为一个整体被执行，包含在其中的对数据库的操作要么全部被执行，要么都不执行。<br>
一个事务是不可分割的，事务中的任何一条 SQL 执行失败，已经执行成功的语句也必须撤销，状态回退到执行事务之前。</p>
<h4 id="一致性-consistency" tabindex="-1"><a class="header-anchor" href="#一致性-consistency" aria-hidden="true">#</a> 一致性（Consistency）</h4>
<p>事务应确保数据库的状态从一个一致状态转变为另一个一致状态。例如银行转账，保证事务结束后总数量不变。<br>
一致状态的含义是数据库中的数据应满足完整性约束，事务开始和结束之间的中间状态不会被其他事务看到。</p>
<h4 id="隔离性-isolation" tabindex="-1"><a class="header-anchor" href="#隔离性-isolation" aria-hidden="true">#</a> 隔离性（Isolation）</h4>
<p>多个事务并发执行时，一个事务的执行不应影响其他事务的执行。</p>
<h4 id="持久性-durability" tabindex="-1"><a class="header-anchor" href="#持久性-durability" aria-hidden="true">#</a> 持久性（Durability）</h4>
<p>已被提交的事务对数据库的修改应该永久保存在数据库中。</p>
<p>一般来说，事务的 ACID 由 RDBMS 来实现的，RDBMS 采用日志来保证事务的原子性，一致性，持久性。采用锁的机制来实现事务的隔离性。</p>
<h3 id="事务的隔离级别" tabindex="-1"><a class="header-anchor" href="#事务的隔离级别" aria-hidden="true">#</a> 事务的隔离级别</h3>
<p>在事务并发操作时，可能出现的问题有：</p>
<ul>
<li><strong>脏读</strong>：事务 A 修改了一个数据，但未提交，事务 B 读到了事务 A 未提交的更新结果，如果事务 A 提交失败，事务 B 读到的就是脏数据。</li>
<li><strong>不可重复读</strong>：在同一个事务中，对于同一份数据读取到的结果不一致。比如，事务 B 在事务 A 提交前读到的结果，和提交后读到的结果可能不同。不可重复读出现的原因就是事务并发修改记录，要避免这种情况，最简单的方法就是对要修改的记录加锁，这回导致锁竞争加剧，影响性能。另一种方法是通过 MVCC 可以在无锁的情况下，避免不可重复读。</li>
<li><strong>幻读</strong>：在同一个事务中，同一个查询多次返回的结果不一致。事务 A 新增了一条记录，事务 B 在事务 A 提交前后各执行了一次查询操作，发现后一次比前一次多了一条记录。幻读是由于并发事务增加记录导致的，这个不能像不可重复读通过记录加锁解决，因为对于新增的记录根本无法加锁。需要将事务串行化，才能避免幻读。</li>
</ul>
<p><strong>ANSI/ISO SQL 定义的标准隔离级别有四种，从高到底依次为：可序列化(Serializable)、可重复读(Repeatable reads)、提交读(Read committed)、未提交读(Read uncommitted)。</strong></p>
<h4 id="未提交读-read-uncommitted" tabindex="-1"><a class="header-anchor" href="#未提交读-read-uncommitted" aria-hidden="true">#</a> 未提交读(Read uncommitted)</h4>
<p>最低的隔离级别，什么都不需要做，允许脏读，也就是可能读取到其他会话中未提交事务修改的数据。所有的并发事务问题都会发生。</p>
<h4 id="提交读-read-committed" tabindex="-1"><a class="header-anchor" href="#提交读-read-committed" aria-hidden="true">#</a> 提交读(Read committed)</h4>
<p>只有在事务提交后，其更新结果才会被其他事务看见。可以解决脏读问题。Oracle 等多数数据库默认都是该级别 (不重复读)。</p>
<h4 id="可重复读-repeatable-reads" tabindex="-1"><a class="header-anchor" href="#可重复读-repeatable-reads" aria-hidden="true">#</a> 可重复读(Repeatable reads)</h4>
<p>在一个事务中，对于同一份数据的读取结果总是相同的，无论是否有其他事务对这份数据进行操作，以及这个事务是否提交。MySQL/InnoDB 默认级别，可以解决脏读、不可重复读。</p>
<h4 id="可序列化-serializable" tabindex="-1"><a class="header-anchor" href="#可序列化-serializable" aria-hidden="true">#</a> 可序列化(Serializable)</h4>
<p>事务串行化执行，隔离级别最高，牺牲了系统的并发性。可以解决并发事务的所有问题。</p>
<h2 id="数据库索引" tabindex="-1"><a class="header-anchor" href="#数据库索引" aria-hidden="true">#</a> 数据库索引</h2>
<h3 id="什么是索引" tabindex="-1"><a class="header-anchor" href="#什么是索引" aria-hidden="true">#</a> 什么是索引</h3>
<p>数据库索引是怎样提升性能的？使用索引的全部意义就是通过缩小一张表中需要查询的记录/行的数目来加快搜索的速度。可以把数据库索引比作书的目录索引，当我们需要在一本动物百科里寻找秋田犬的时候，可以通过目录快速定位到具体的位置。</p>
<p>数据库索引，是数据库管理系统中<strong>一个排序的数据结构</strong>，以协助快速查询、更新数据库表中数据。</p>
<h3 id="索引是什么" tabindex="-1"><a class="header-anchor" href="#索引是什么" aria-hidden="true">#</a> 索引是什么</h3>
<p>一个索引是存储的表中一个特定列的值数据结构（最常见的是 B-Tree）。索引是在表的列上创建。所以，要记住的关键点是索引包含一个表中列的值，并且这些值存储在一个数据结构中。</p>
<p>数据库管理系统（RDBMS）通常决定索引应该用哪些数据结构。但是，在某些情况下，你在创建索引时可以指定索引要使用的数据结构。</p>
<h4 id="b-tree-索引" tabindex="-1"><a class="header-anchor" href="#b-tree-索引" aria-hidden="true">#</a> B-Tree 索引</h4>
<p>B-Tree 是最常用的用于索引的数据结构。因为它们是时间复杂度低， 查找、删除、插入操作都可以可以在对数时间内完成。另外一个重要原因存储在 B-Tree 中的数据是有序的。</p>
<h4 id="哈希索引" tabindex="-1"><a class="header-anchor" href="#哈希索引" aria-hidden="true">#</a> 哈希索引</h4>
<p>哈希表是另外一种你可能看到用作索引的数据结构——这些索引通常被称为哈希索引。使用哈希索引的原因是，在寻找值时哈希表效率极高。</p>
<p>哈系索引的工作方式是将列的值作为索引的键值（key），和键值相对应实际的值（value）是指向该表中相应行的指针。所以，如果使用哈希索引，对于比较字符串是否相等的查询能够极快的检索出的值。</p>
<p>哈希表是无顺的数据结构，对于很多类型的查询语句（范围查询）哈希索引都无能为力。哈希表的键值映射也暗示其键的存储是无序的。这就是为什么哈希索引通常不是数据库索引的默认数据结构——因为在作为索引的数据结构时，其不像 B-Tree 那么灵活。</p>
<h4 id="r-tree" tabindex="-1"><a class="header-anchor" href="#r-tree" aria-hidden="true">#</a> R-Tree</h4>
<p>使用 R-Tree 作为数据结构的索引通常用来为空间问题提供帮助。例如，一个查询要求“查询出所有距离一公里之内的超市”，如果数据库表使用 R-Tree 索引，这类查询的效率将会提高。</p>
<h4 id="位图索引" tabindex="-1"><a class="header-anchor" href="#位图索引" aria-hidden="true">#</a> 位图索引</h4>
<p>位图索引（bitmap index）适合放在包含布尔值(true 和 false)的列上，但是这些值（表示 true 或 false 的值）的许多实例-基本上都是选择性（selectivity）低的列。</p>
<h3 id="合理使用索引" tabindex="-1"><a class="header-anchor" href="#合理使用索引" aria-hidden="true">#</a> 合理使用索引</h3>
<p>数据库索引能提升性能，那当然它也会有一些缺点：</p>
<ol>
<li>索引会占用空间 - 你的表越大，索引占用的空间越大。</li>
<li>性能损失（主要值更新操作），当你在表中添加、删除或者更新行数据的时候，在索引中也会有相同的操作。记住：建立在某列（或多列）索引需要保存该列最新的数据。</li>
</ol>
<p><strong>基本原则是只如果表中某列在查询过程中使用的非常频繁，那就在该列上创建索引。</strong></p>
<h3 id="索引类型" tabindex="-1"><a class="header-anchor" href="#索引类型" aria-hidden="true">#</a> 索引类型</h3>
<p>根据数据库的功能，可以在数据库设计器中创建三种索引：唯一索引、主键索引和聚集索引。</p>
<h4 id="唯一索引" tabindex="-1"><a class="header-anchor" href="#唯一索引" aria-hidden="true">#</a> 唯一索引</h4>
<p>唯一索引是不允许其中任何两行具有相同索引值的索引。</p>
<p>当现有数据中存在重复的键值时，大多数数据库不允许将新创建的唯一索引与表一起保存。数据库还可能防止添加将在表中创建重复键值的新数据。</p>
<h4 id="主键索引" tabindex="-1"><a class="header-anchor" href="#主键索引" aria-hidden="true">#</a> 主键索引</h4>
<p>数据库表经常有一列或列组合，其值唯一标识表中的每一行。该列称为表的主键。</p>
<p>在数据库关系图中为表定义主键将自动创建主键索引，主键索引是唯一索引的特定类型。该索引要求主键中的每个值都唯一。当在查询中使用主键索引时，它还允许对数据的快速访问。<br>
当表中只有一个主键时，它是唯一的索引；当表中有多个主键时，称为复合主键，复合主键联合保证唯一索引。</p>
<h4 id="主键索引和唯一索引的区别" tabindex="-1"><a class="header-anchor" href="#主键索引和唯一索引的区别" aria-hidden="true">#</a> 主键索引和唯一索引的区别</h4>
<ul>
<li>主键是一种约束，唯一索引是一种索引，两者在本质上是不同的</li>
<li>主键创建后一定包含一个唯一性索引，唯一性索引并不一定就是主键</li>
<li>唯一性索引列允许空值，而主键列不允许为空值</li>
<li>主键列在创建时，已经默认为非空值 + 唯一索引</li>
<li>主键可以被其他表引用为外键，而唯一索引不能</li>
<li>一个表最多只能创建一个主键，但可以创建多个唯一索引</li>
<li>主键更适合那些不容易更改的唯一标识，如自动递增列、身份证号等</li>
</ul>
<h4 id="聚集索引" tabindex="-1"><a class="header-anchor" href="#聚集索引" aria-hidden="true">#</a> 聚集索引</h4>
<p>在聚集索引中，表中行的物理顺序与键值的逻辑（索引）顺序相同。一个表只能包含一个聚集索引。</p>
<p>如果某索引不是聚集索引，则表中行的物理顺序与键值的逻辑顺序不匹配。与非聚集索引相比，聚集索引通常提供更快的数据访问速度。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1" target="_blank" rel="noopener noreferrer">维基百科-数据库事务<ExternalLinkIcon/></a></li>
<li><a href="https://blog.csdn.net/qq_25448409/article/details/78110430" target="_blank" rel="noopener noreferrer">数据库事务的四大特性（ACID）以及事务的隔离级别<ExternalLinkIcon/></a></li>
<li><a href="https://www.zhihu.com/question/31346392/answer/59815366" target="_blank" rel="noopener noreferrer">知乎-如何理解数据库事务中的一致性的概念？<ExternalLinkIcon/></a></li>
<li><a href="https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%B4%A2%E5%BC%95" target="_blank" rel="noopener noreferrer">维基百科-数据库索引<ExternalLinkIcon/></a></li>
<li><a href="https://blog.csdn.net/weiliangliang111/article/details/51333169" target="_blank" rel="noopener noreferrer">数据库索引到底是什么，是怎样工作的？<ExternalLinkIcon/></a></li>
<li><a href="https://www.cnblogs.com/-619569179/p/6528896.html" target="_blank" rel="noopener noreferrer">主键索引和唯一索引的区别<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>关于数据库的事务和索引，也算是比较基础的内容了，但对本骚年来说也是不大了解。<br>
一下子学这么多，有点消化不过来，本节就先介绍数据库事务和索引，文章大多数都是参考来的内容，很多也需要好好理解。</p>
</div></template>


