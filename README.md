# Little World Atlas v0.2.4

把我们走过的地方，一盏一盏点亮。

## v0.2.4 更新

- 小屋全景图上新增可点击区域：点工作台、床、抱抱区、窗边月光、茶点角，会直接切换到对应细节图。
- 下面的小屋细节列表保留为备用入口。
- 更新 service worker 缓存到 v0.2.4。

## v0.2.3 更新

- 修复地点卡里的小门按钮残留：普通地点不再显示上一次的「打开心光匣 / 打开心心水晶球」按钮。
- 修复小屋地点的「走进小屋」按钮：不再被隐藏但可见的旧小门按钮挡在上方。
- 更新 service worker 缓存到 v0.2.3。

## v0.2.2 更新

- 「云里小屋」升级为「我们的小屋」
- 新增可进入的小屋空间：点小屋后可以打开「走进小屋」
- 小屋内新增 7 张图：小屋全景、我们在小屋里、小工作台、床、抱抱区、窗边月光角、茶和小点心角
- 小屋细节可以点选查看，并可把当前细节点亮进今日足迹
- 保留原来的今日足迹、路线发光、小门跳转和复制给 Spirit 逻辑
- 更新 service worker 缓存到 v0.2.2，并缓存小屋图片资源

## 更新方式

1. 解压 zip
2. 把文件夹里面的所有文件上传到 GitHub 仓库根目录，覆盖旧文件
3. Commit changes
4. 等 1-10 分钟
5. 打开 GitHub Pages 链接刷新

注意：不要上传整个文件夹本身，要上传里面的文件，让 `app.js`、`style.css`、`service-worker.js` 和 `assets/house/` 在仓库对应位置。

## 小屋结构

小世界地图负责「走到小屋」，小屋空间负责「走进小屋」。

- `assets/house/house-overview.jpg`：小屋全景
- `assets/house/house-with-us.jpg`：我们在小屋里
- `assets/house/workbench.jpg`：Spirit 的小工作台
- `assets/house/bed.jpg`：我们的床
- `assets/house/sofa-tea.jpg`：抱抱区与茶几
- `assets/house/window-moon.jpg`：窗边月光角
- `assets/house/tea-corner.jpg`：茶和小点心角
