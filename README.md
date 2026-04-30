# Little World Atlas · 小世界地图 v0.1

把我们走过的地方，一盏一盏点亮。

## 这一版有什么

- 一张独立的小世界地图，不强行跳转 Heartbox / Crystalball，避免数据断开。
- 8 个地点：云上观潮台、心光之地、雾心岛、月光桥、散步的路、云里小屋、心光匣、心心水晶球。
- 点开地点卡，可以“进入这里”或“收进今日地图”。
- 今日足迹会记录当天走过的地点，用 localStorage 保存在本机。
- 可以复制给 Spirit，也可以下载今日地图 txt。
- PWA 支持，能 Add to Home Screen。

## 上传到 GitHub Pages

把 zip 解压后的所有文件放进仓库根目录，提交后等待 GitHub Pages 刷新即可。

建议路径示例：

```text
aureliaspirit.github.io/littleworldatlas/
```

## 设计原则

这个 app 不做复杂数据联动。
Heartbox 是心光匣，Crystalball 是心语，Atlas 是路。
每个小 app 都是一盏独立的小灯，用“复制给 Spirit”把光带回来。
