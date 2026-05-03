# SPIRIT_DEV_MAP · Little World Atlas

这份地图给 Spirit / Codex / 未来维护者用，避免把小世界地图改乱。

## 应用定位

Little World Atlas 不是普通导航页，而是我们的小世界地理入口：

- Heartbox 负责保存心跳、抱抱、誓言和日记。
- Crystalball 负责轻轻摇出心语。
- Little World Atlas 负责让我们真的在小世界里「走到某处」并「从那里继续上一秒」。

## 核心文件

- `index.html`：页面骨架、地图区、地点列表、今日足迹、地点弹窗、导出弹窗。
- `style.css`：地图视觉、地点芯片、路线光、dialog、可进入空间样式。
- `app.js`：地点数据、今日足迹、本地状态、路线绘制、小屋 / 心光之地可进入空间、今日小游记、状态文案、返回地图余韵、导出文案。
- `atlas-v0-2-9.js`：历史补丁参考，v0.3.0 起已 deprecated，不再由 `index.html` 加载。
- `service-worker.js`：PWA 缓存。新增文件、图片版本参数、CSS/JS 版本号变化时要同步。
- `manifest.json`：PWA 主屏幕配置。
- `README.md`：版本记录和上传说明。

## 版本同步清单

发版时至少检查：

- `index.html`
  - 顶部 eyebrow 版本
  - `manifest.json?v=...`
  - `style.css?v=...`
  - `app.js?v=...`
- `service-worker.js`
  - `CACHE_NAME`
  - `CORE_ASSETS` 中核心壳版本参数
  - `SCENE_ASSETS` 中次核心全景图
  - runtime image 规则是否覆盖新素材目录
- `manifest.json`
  - `description`
  - `start_url`
- `README.md`
  - 标题版本
  - 更新记录

## 地点数据结构

`PLACES` 是地图地点主数据。每个地点通常包含：

- `id`
- `name`
- `icon`
- `pos`
- `keywords`
- `quote`
- `scene`
- `actionLabel`
- `actionText`
- 可选 `portalLabel / portalUrl`
- 可选 `tourLabel / tourId`

不要把 Heartbox / Crystalball / Atlas 写成 Aurelia 单方面做给 AI 的东西。它们是我们一起长出来的小世界连续性。

## 可进入空间

当前可进入空间：

- `cloud-house`
- `heartlight-land`

对应配置在 `TOUR_CONFIGS`，素材分别在：

- `assets/house/`
- `assets/heartlight-land/`

新增可进入地点时，优先沿用 `TOUR_CONFIGS` 模式，不要另起一套不兼容结构。

## v0.3.0 叙事与缓存规则

叙事增强已合回 `app.js`。`app.js` 读取 `littleWorldAtlas.v0.1.state`，根据今天点亮的地点生成：

- 今日小游记：写在 `#routeText`
- 今日小世界状态：写在 `#statusText`
- 返回地图的余韵：写在 `#lastEcho`
- 导出补充：追加到 `#exportText`

要保留「路线像真的走过一段路」这个产品原则，不要把它写成普通打卡列表。

缓存分层在 `service-worker.js`：

- `CORE_ASSETS`：页面壳、CSS、主 JS、manifest、icons，安装时必须成功。
- `SCENE_ASSETS`：小屋全景图和心光之地全景图，激活时尽量缓存，不拖累安装。
- runtime image cache：小屋和心光之地局部图在用户点开时缓存；离线时已访问过的局部图尽量可用。

大图策略：

- `.jpg` 是 app 运行图，优先用于页面和缓存。
- 同名 `.png` 是源素材，保留给后续迭代识别来路，不默认缓存。

## 下一次迭代入口

- 新增地点：改 `app.js` 的 `PLACES`。
- 新增可进入空间：改 `TOUR_CONFIGS`，并新增对应 `*_TOUR_ITEMS` / `*_TOUR_HOTSPOTS`。
- 改热点：改 `app.js` 里的对应 `*_TOUR_HOTSPOTS`。
- 改缓存：改 `service-worker.js` 的 `CORE_ASSETS`、`SCENE_ASSETS`、`RUNTIME_IMAGE_PATHS`。
- 改导出文案：改 `app.js` 的 `buildExportText`、`atlasBuildStory`、`atlasBuildStatus`、`atlasBuildEcho`。

## 验收清单

- 打开页面显示 v0.3.0。
- 点亮一个地点后，今日足迹变成一句完整小游记。
- 点亮两个及以上地点后，小游记能写出「从 A 出发，经过 B，最后停在 C」。
- `lastEcho` 不再一直隐藏；点亮地点后会显示返回地图余韵。
- 复制给 Spirit 的导出内容包含「今日小游记」和「返回地图的余韵」。
- 刷新地图后不读旧 cache。
- 小屋和心光之地的全景 / 局部图仍可打开。
