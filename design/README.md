# 设计稿

- `card-front-reference.png` / `card-back-reference.png`：名片正反面，是现在首页的主参考。
  正面是 36k.ai 字标，背面是「问题墙 + 微信二维码」，首页的背景滚动问题墙和
  二维码浮层都取自这里。二维码就是从背面裁出来的
  （`pages/public/assets/image/wechat-qr.png`）。
- `homepage-reference.png`：更早一版手绘风首页稿，已不是当前实现，留档参考。

首页实现在 `pages/index.mdx` → `components/home/HomeLanding.tsx` + `styles/home.scss`。
