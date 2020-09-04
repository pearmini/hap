# Prim

“穷国王”如何修建铁路？

## 引言
现在A王国的国王遇见一个很棘手的问题。

他希望在A国的城市间修建铁路，使得任意两个城市之间都可以通过铁路直接到达。

不同城市之间修建铁路的成本不同，同时因为他的王国才成立，预算不足，所以他希望话尽量少的钱在修建铁路上，请问他该怎么办？

聪明的大臣是一个学习过计算机算法的人，他很快就用Prim算法得到了答案，下面我们就来一起看看他是如何做到的。

## 介绍

普里姆算法（Prim算法），图论中的一种算法，可在加权图里搜索最小生成树。

图论就是研究图的，在计算机中图是由点和连接点的边（弧）构成的集合。比如A王国由a, b, c, d, e, f, g, h, i九个城市构成，那么用图来表示就是如下图。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/1.png?sign=59daed4c5367ba60574cd141f4029a76&t=1566215678)

加权图就是图中的每一条边都有一个权重，A王国这张图上每一条边的权重代表：边所连接两个城市间修建铁路的成本。比如在上图中连接a, b边的权重为4，说明在城市a和城市b修建一条铁路的成本为4。

最小生成树就是最后需要修建的成本最小、能连通整个国家的铁路网。

另一方面，Prim是一种贪心算法。

贪心算法是计算机算法中的一类。这类算法的特点，顾名思义，就是贪心。

该类算法往往只考虑当前的最优解，不去考虑长远的最优解，所以贪心算法获得的结果不一定是最优解。但好处是这类算法很简单，能很自然地想到。

## 大概思路

Prim算法将图中所有的点分成两类：第一类是已经在最小生成树里的点，第二类不是不在最小生成树里的点。

算法在执行过程中不断将第二类中和第一类中的点有边相连，同时边的权重最小的点加入第一类点。直到所有的点都变成第一类点时算法结束。

接下来我们来看看具体的操作。

我们首先把点a加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/1.png?sign=59daed4c5367ba60574cd141f4029a76&t=1566215678)

当前第二类点和第一类点相连的是b、h，因为a、b间的权重是4，a、h间的权重是8，所以把b加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/2.png?sign=5d420faa98e048be307689745efdec37&t=1566215700)

当前第二类点和第一类点相连的是h、c，因为a、h间的权重是8，b、h间的权重是11，b、c间的权重是8，所以把c加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/3.png?sign=3bc764ff73e5849907898d4161bff6bb&t=1566216255)

当前第二类点和第一类点相连的是h、i、d、f，因为c、i间的权重最小为2，所以把i加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/4.png?sign=505cfaf8b2e35039c50889086bad41b4&t=1566216268)

就一直这样持续下去，最后一张图就是最后的结果。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/5.png?sign=42854cf3be5459c8d3a9d532c1e53ee1&t=1566215722)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/6.png?sign=f51a84cc6358ebcf9af54db85325da9b&t=1566215729)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/7.png?sign=9b7c1f3fdfa1dce99f3fbbfbe7068202&t=1566216278)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/8.png?sign=c9df79d6c8b9eef186e85823705db1b7&t=1566215743)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/9.png?sign=dd714bc4d66dc4ec1b51b3e2ee3ac075&t=1566216290)

## 可视化

可视化这个算法的思路也非常的简单，我们首先将图片分成一个个的小格子，格子间由边相连，然后给这些边一些随机的权重。
这之后随机选择一个格子作为起始点，然后用Prim算法将格子一个一个加入最小生成树，同时对加入的格子染色（染的颜色由图片决定，染的风格由绘画风格确定）。下面就是用“印象 日出”绘制的效果。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/Prim/example.gif?sign=f6566399287bf7fd64e5727872ca6da0&t=1566215758)

## 参考资料

- 图片来自于《算法导论》
