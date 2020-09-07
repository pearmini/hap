# 画家与黑客

这是《画家与黑客》的 SDK，这里会集成人像分割、风格迁移以及数据结构和算法可视化的能力，同时有艺术品、数据结构和算法可视化的对应的介绍文章。

## 画家

目前一共有23件艺术品的文章介绍。

1. [马拉之死](./src/painters/01_马拉之死)
2. [巴黎圣母院](./src/painters/02_巴黎圣母院)
3. [星月夜](./src/painters/03_星月夜)
4. [思考者](./src/painters/04_思考者)
5. [泉](./src/painters/05_泉)
6. [野牛图](./src/painters/06_野牛图)
7. [内巴蒙墓葬图](./src/painters/07_内巴蒙墓葬图)
8. [帕台农神庙](./src/painters/08_帕台农神庙)
9. [掷饼者](./src/painters/09_掷饼者)
10. [奥古斯都像](./src/painters/10_奥古斯都像)
11. [古罗马斗兽场](./src/painters/11_古罗马斗兽场)
12. [马赛克镶嵌画](./src/painters/12_马赛克镶嵌画)
13. [哀悼耶稣](./src/painters/13_哀悼耶稣)
14. [维纳斯的诞生](./src/painters/14_维纳斯的诞生)
15. [阿诺芬尼夫妇像](./src/painters/15_阿诺芬尼夫妇像)
16. [人间乐园](./src/painters/16_人间乐园)
17. [蒙拉丽莎](./src/painters/17_蒙拉丽莎)
18. [大卫](./src/painters/18_大卫)
19. [雅典学院](./src/painters/19_雅典学院)
20. [长颈圣母](./src/painters/20_长颈圣母)
21. [圣马太蒙召](./src/painters/21_圣马太蒙召)
22. [圣·特蕾莎的狂喜](./src/painters/22_圣·特蕾莎的狂喜)
23. [阿尔卡迪的牧人](./src/painters/23_阿尔卡迪的牧人)

## 骇客

数据结构和算法可视化能力使用方法如下：

```js
import ph from 'painters-and-hackers.js';

const hacker = ph
  .hackers()
  .canvas(/* canvas */)
  .size([400, 300])
  .imageData(/* contentImageData */)
  .style(/* styleName */)
  .end(() => {
      console.log('end');
  });

hacker.start();
```

目前支持的数据结构和算法如下。

- 数据结构
  - [向量](./src/hackers/data-structures/vector)
- 减而治之
  - [二分查找](./src/hackers/decrease-and-conquer/binary-search)
- 排序
  - [插入排序](./src/hackers/sorting/insertion-sort)
  - [归并排序](./src/hackers/sorting/merge-sort)
- 图
  - [宽度优先搜索](./src/hackers/graph/bfs)
  - [深度优先搜索](./src/hackers/graph/dfs)
  - [普里姆算法](./src/hackers/graph/prim)

## 未来工作

- 集成 body-pix 能力
- 集成 style-transfer 能力
  