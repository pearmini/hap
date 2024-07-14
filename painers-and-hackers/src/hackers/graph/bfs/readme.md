# BFS

来一场说走就走的旅行吧～

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/bfs/1.png?sign=712be72b9ea9c31d72f98c49f8ec1073&t=1599377568)

## 引言

之前一个女教师的辞职信火遍网络“这个世界这么大，我想去看看”，但去看世界之前我们不如先去周游一下中国的大好河山。
这样有一个问题就是我们不得不考虑的，那就是按怎样的顺序能方便地、一个不漏的将中国的城市都旅游一次。这就可以用到BFS算法了。

## 介绍

BFS（Breadth First Search），宽度优先搜索算法，是计算机图论中一种基础的遍历算法。

图论就是研究图的，在计算机中图是由点和连接点的边（弧）构成的集合。如果把中国的城市都看做一个点，城市之间的道路看成边，那么中国地图就是一张大的图，如下图所示（一部分）。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/bfs/2.png?sign=9b804944c2874c3783536ed7549d19f1&t=1599377742)

而遍历的意思就是把图中的点都访问一次，也就是把中国地图上的所有城市都旅游一次。

## 大概思路

BFS的核心就是尽可能“广”地访问与当前点直接相连的点。
比如我们从北京出发，下一步我们依此去呼和浩特、石家庄、济南、天津、沈阳这与北京直接相连的城市，接下来再去与石家庄直接相连的城市（太原、郑州）旅游，然后再是直接和济南相连的城市（南京、青岛、烟台），按照这种策略旅游，最后得到下面这张图。图中的数字是旅游的顺序。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/bfs/3.png?sign=9c5553f1717f004ce29f9da075f9373b&t=1599377754)

可以发现，我们首先是去离北京相距一条边的城市旅游（呼和浩特、石家庄、济南、天津、沈阳），然后再去离北京两条边的城市旅游（太原、郑州、南京、青岛、烟台、北戴河、秦皇岛），就好像一层层的旅游，一层层的深入。

## 可视化

可视化这个算法的思路也非常的简单，我们首先将图片分成一个个的小格子，随机选择一个格子作为起始点，然后用BFS策略一层层的访问所有的格子，每访问到一个格子就对该格子染色（染的颜色由图片决定，染的风格由绘画风格确定）。下面可以看到染色是向四周蔓延，就是一层层的感觉。

![alt text](https://7765-wechatcloud-79m2p-1259642785.tcb.qcloud.la/algorithms/graph/bfs/1.gif?sign=002262ff12701c15c47e383fafb4526e&t=1599377576)

## 参考资料

- 《数学之美》吴军