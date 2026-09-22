# 林牧 · 高原纪实摄影作品集

离线可用的摄影师个人站点。React + TypeScript + Vite，无后端，所有内容与字体均为本地资源。

## 运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 生产构建（含 TypeScript 检查）
npm run preview  # 预览构建产物
```

## 页面

| 路由 | 内容 |
|---|---|
| `/` | Hero 简介 + 三个系列（凝视 / 无人之境 / 高原牧歌）精选入口 |
| `/work` | 全部 14 张作品，瀑布流网格 + 分类筛选（全部/肖像/风光/牧野） |
| `/work/:seriesId` | 系列长页：叙事式图文交替排版、斜体引言、按 `order` 排序 |
| `/about` | 摄影师简介 + 经历时间线 |
| `/contact` | 约拍表单：行内校验、禁用态、发送中与成功反馈 |

全局共享灯箱：任意页面点击照片即打开，上一张/下一张只在当前这组照片内循环。

## 关键设计

- **单一数据源**：`src/data/photos.json` 为 `mock-data/photos.json` 的原样拷贝，所有页面（网格 / 系列长页 / 首页卡片 / 灯箱）都从它派生，无重复硬编码。
- **筛选状态保持**：分类筛选存放在路由之外的 `WorkFilterProvider`（`src/state/workFilter.tsx`），进入系列页再返回 `/work` 不会重置。
- **灯箱范围限定**：`useLightbox()` 的 `open(photos, index)` 每次只接收调用方当前可见的那组照片（如筛选后的 4 张牧野），导航在该组内取模循环，不会越界。
- **CLS 防护**：图片容器按 `photos.json` 的 `width`/`height` 以内联 `aspect-ratio` 提前占位（`.ratio-box`），加载前后布局不跳动。
- **响应式**：≤767px 时瀑布流转单列、照片说明从图片浮层移到图下、灯箱说明落为底部信息条、导航切换为汉堡菜单。
- **离线字体**：`public/fonts/` 下三个本地 woff2 经 `@font-face` 引入（Inter 400–600 / Playfair Display 600 / Playfair Display Italic 400），无任何外部字体 CDN 请求。
