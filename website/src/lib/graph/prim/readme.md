# Prim

“穷国王”如何修建铁路？

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/10.png?sign=9493d4e329f0576909fc6ee21fb391ad&t=1599378239)

## 引言

现在A王国的国王遇见一个很棘手的问题。

他希望在A国的城市间修建铁路，使得任意两个城市之间都可以通过铁路直接到达。

不同城市之间修建铁路的成本不同，同时因为他的王国才成立，预算不足，所以他希望话尽量少的钱在修建铁路上，请问他该怎么办？

聪明的大臣是一个学习过计算机算法的人，他很快就用Prim算法得到了答案，下面我们就来一起看看他是如何做到的。

## 介绍

普里姆算法（Prim算法），图论中的一种算法，可在加权图里搜索最小生成树。

图论就是研究图的，在计算机中图是由点和连接点的边（弧）构成的集合。比如A王国由a, b, c, d, e, f, g, h, i九个城市构成，那么用图来表示就是如下图。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/1.png?sign=105df167392a293ebdbf91dbd499e126&t=1599378266)

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

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/1.png?sign=105df167392a293ebdbf91dbd499e126&t=1599378266)

当前第二类点和第一类点相连的是b、h，因为a、b间的权重是4，a、h间的权重是8，所以把b加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/2.png?sign=34c61cdac70b860e40ae3a988f36dc1a&t=1599378281)

当前第二类点和第一类点相连的是h、c，因为a、h间的权重是8，b、h间的权重是11，b、c间的权重是8，所以把c加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/3.png?sign=4fcb940d591f18d12e4c19b9900ee46e&t=1599378289)

当前第二类点和第一类点相连的是h、i、d、f，因为c、i间的权重最小为2，所以把i加入第一类点。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/4.png?sign=8d55f5a9e0a08d38c5181804eb52bbe7&t=1599378299)

就一直这样持续下去，最后一张图就是最后的结果。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/5.png?sign=24b82fbb2e48e59d9d2aad20ee0b03c9&t=1599378322)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/6.png?sign=86e6246fd47d28ac3e2f710c982b29c1&t=1599378333)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/7.png?sign=d8a688466a9cd44974cb0bdd219850eb&t=1599378344)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/8.png?sign=1ac2b74660429850efb337c5fb5b070b&t=1599378354)

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/9.png?sign=689ee6566dbb1e456a3a11fab2401b3a&t=1599378361)

## 可视化

可视化这个算法的思路也非常的简单，我们首先将图片分成一个个的小格子，格子间由边相连，然后给这些边一些随机的权重。
这之后随机选择一个格子作为起始点，然后用Prim算法将格子一个一个加入最小生成树，同时对加入的格子染色（染的颜色由图片决定）。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/prim/1.gif?sign=c3149074a85f840faeb036bd93b453e8&t=1599378019)

## 参考资料

- 图片来自于《算法导论》
