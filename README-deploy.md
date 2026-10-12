# 萝卜的推特流量体检（luobo-x-checkup）

纯静态网站（HTML/CSS/JS），无依赖、无后端、无 CDN，可离线打开 `index.html` 直接使用。

## 文件
- index.html — 页面（4 个标签页：习惯体检 / 发推前检查 / 官方报告解读 / 免费干货 + 付费升级区）
- style.css — 奶油 / 蜜桃 / 橙色主题，移动端优先
- app.js — 全部逻辑（本地计算，不发任何网络请求）
- labels.js — Under the Hood 标签中文解释 + X 开源代码中的官方示例报告
- assets/luobo.svg — 萝卜吉祥物

## 部署（任选其一，都需要账号，萝卜没有替你注册）
1. **GitHub Pages**：建公开仓库 `luobo-x-checkup` → 上传本目录全部文件 → Settings → Pages → Branch: main / root。网址形如 `https://<用户名>.github.io/luobo-x-checkup/`。
   - 如果在 box 上 `gh auth login` 完成登录，萝卜可以一条命令建好仓库并开启 Pages。
2. **Cloudflare Pages / Vercel / Netlify**：新建项目 → 直接拖拽上传本目录（或 luobo-x-checkup.zip 解压后的目录），无需构建命令。
3. 注意：GitHub Pages / Vercel 在中国大陆访问可能不稳定；目标用户本来就在用 X，问题不大。

## 上线前要改的
- `index.html` 里付费按钮 `#buyBtn` 目前指向 https://afdian.com/a/wutujiang （占位）。爱发电认证通过、上架「完整版手册」后，换成商品链接。
- 去掉「即将上架」徽章。


## Day1–Day2 CTA 补丁（2026-10-12）
- 结果页：主按钮仍是「生成体检卡片」；次按钮文案改为「完整手册 / 支持萝卜」，链接仅 `https://afdian.com/a/wutujiang`（不发明商品深链）。
- 软状态文案：「商品开通中，可先打赏档」。
- 分享卡底部同步软状态。
- 部署：在 `luobo-x-checkup-repo` 常规 `git add` → `git commit` → `git push origin main`（**禁止 force-push**）。GitHub Pages 根目录已开则自动更新。
