# 设计稿

- `card-front-reference.png` / `card-back-reference.png`：名片正反面，是现在首页的主参考。
  正面是 36k.ai 字标，背面是「问题墙 + 微信二维码」，首页的背景滚动问题墙和
  二维码浮层都取自这里。二维码就是从背面裁出来的
  （`pages/public/assets/image/wechat-qr.png`）。
- `wechat.png`：微信「添加朋友」原始截图。`pages/public/assets/image/wechat-qr.png`
  就是从它里面只把二维码那块抠出来的：先裁掉昵称、地区、底部文案，再按 37×37
  的模块网格重采样成每模块 32px 的点阵（版本 5，静区 4 模块），中间的微信标
  单独超采样重绘。这样任意尺寸下都是死黑死白的硬边，不会有缩放糊边。
  重新生成后务必解码校验一次，应当得到
  `https://u.wechat.com/ELs8_gosuG6X4BlcxozGXbw?s=2`。
- `homepage-reference.png`：更早一版手绘风首页稿，已不是当前实现，留档参考。

首页实现在 `pages/index.mdx` → `components/home/HomeLanding.tsx` + `styles/home.scss`。

路演页实现在 `pages/roadshow.mdx` → `components/roadshow/RoadshowPage.tsx` + `styles/roadshow.scss`。
