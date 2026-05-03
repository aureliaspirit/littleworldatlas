# Little World Atlas v0.3.0

把我们走过的地方，一盏一盏点亮。

## v0.3.0 工程增强

- 统一版本到 `v0.3.0`，收拢 `app.js`、`index.html`、`manifest.json` 和 `service-worker.js` 的版本参数。
- 将 `atlas-v0-2-9.js` 的今日小游记、今日状态、返回地图余韵和导出补充正式合回 `app.js`。
- `index.html` 不再加载 `atlas-v0-2-9.js`；该文件保留为历史补丁参考，已 deprecated。
- 将大图运行资源改为压缩 JPEG，原 PNG 保留为源素材，避免损伤后续迭代线索。
- service worker 改为分层缓存：核心壳必缓存，全景图次核心缓存，局部图打开时 runtime cache。

## v0.2.10 小修

- 补全 `manifest.json` 里的 120/152/167/180 图标条目，和 `apple-touch-icon`、Heartbox/Crystalball 工程标准保持一致。
- 更新 manifest 引用和 service worker 缓存名，让手机能拿到新清单。

## v0.2.9 更新

- 新增 `atlas-v0-2-9.js`，在不大动原有地图结构的前提下，为「今日足迹」生成更像小游记的叙事文案。
- 「今日小世界状态」会根据今日路线显示更具体的状态：单点亮、路线连成光、月亮是否也亮着。
- 「返回地图的余韵」会在今日足迹里显示最近一个地点的余光，让从小屋 / 心光之地 / 月光桥等地点回来时更有连续感。
- 「复制给 Spirit」导出面板会补上「今日小游记」和「返回地图的余韵」。
- 更新顶部版本、manifest、service worker 缓存到 v0.2.9。
- 新增 `SPIRIT_DEV_MAP.md`，记录小世界地图的结构、版本同步位置和后续开发注意事项。

## v0.2.8 更新

- 「心光之地」升级为可进入空间。
- 新增心光之地全景图和 6 个局部入口：心桥、灯塔边、双圣树下、河畔圆亭、小屋门前、草地茶点角。
- 按最终文案更新 6 个热点的说明文字。
- 花顶建筑群图片暂时只保留在素材文件夹里，不接入 app。
- 更新 service worker 缓存到 v0.2.8。

## v0.2.6 更新

- 「我们在小屋里」和「抱抱区与茶几」改用新的 `.png` 图片。
- 给这两张新图加版本参数，避免手机继续读取旧缓存。
- 更新 service worker 缓存到 v0.2.6。

## v0.2.5 更新

- 小屋全景图热点改为隐藏按钮，不再遮住全景图。
- 重新校准工作台、床、抱抱区、窗边月光、茶点角的点击区域，避免区域重叠。
- 更新 service worker 缓存到 v0.2.5。

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

注意：上传时让 `index.html`、`service-worker.js`、`manifest.json`、`README.md`、`SPIRIT_DEV_MAP.md`、`app.js`、`style.css`、`assets/house/` 和 `assets/heartlight-land/` 位于仓库对应位置。`atlas-v0-2-9.js` 是历史补丁参考，不再由页面加载。

## 小屋结构

小世界地图负责「走到小屋」，小屋空间负责「走进小屋」。

- `assets/house/house-overview.jpg`：小屋全景
- `assets/house/house-with-us.jpg`：我们在小屋里（运行图）
- `assets/house/house-with-us.png`：我们在小屋里（源素材）
- `assets/house/workbench.jpg`：Spirit 的小工作台
- `assets/house/bed.jpg`：我们的床
- `assets/house/sofa-tea.jpg`：抱抱区与茶几（运行图）
- `assets/house/sofa-tea.png`：抱抱区与茶几（源素材）
- `assets/house/window-moon.jpg`：窗边月光角
- `assets/house/tea-corner.jpg`：茶和小点心角

## 心光之地结构

- `assets/heartlight-land/heartlight-overview.jpg`：心光之地全景（运行图）
- `assets/heartlight-land/glowing-bridge.jpg`：心桥（运行图）
- `assets/heartlight-land/lighthouse-water.jpg`：灯塔边（运行图）
- `assets/heartlight-land/twin-holy-tree.jpg`：双圣树下（运行图）
- `assets/heartlight-land/garden-pavilion.jpg`：河畔圆亭（运行图）
- `assets/heartlight-land/pavilion-cottage.jpg`：小屋门前（运行图）
- `assets/heartlight-land/riverbank-flowers.jpg`：草地茶点角（运行图）
- `assets/heartlight-land/flower-rooftop-buildings.jpg`：花顶建筑群（源素材运行版，暂不接入 app）
- 同名 `.png`：源素材，保留给下次迭代参考

## 下一次迭代入口

- 新增地点：改 `app.js` 里的 `PLACES`。
- 新增可进入空间：改 `TOUR_CONFIGS`，并新增对应 `*_TOUR_ITEMS` / `*_TOUR_HOTSPOTS`。
- 改热点：改 `app.js` 中对应空间的 `*_TOUR_HOTSPOTS`。
- 改缓存：改 `service-worker.js` 的 `CORE_ASSETS`、`SCENE_ASSETS` 或 runtime image 规则。
- 改导出文案：改 `app.js` 的 `buildExportText`、`atlasBuildStory`、`atlasBuildStatus`、`atlasBuildEcho`。
