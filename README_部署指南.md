# 双河镇数字导览 H5（V3）部署说明

## 一、项目说明
这是一个纯静态 H5 宣传网站，无需服务器程序、无需数据库。
解压后双击 `index.html` 即可本地预览，也可上传至 Cloudflare Pages、Netlify、腾讯云静态托管等平台。

## 二、目录说明
- `index.html`：主页文件
- `style.css`：样式文件
- `app.js`：交互逻辑
- `data.js`：内容数据
- `assets/`：图片资源
- `生成景点二维码.py`：可批量生成首页及景点二维码
- `favicon.svg`：站点图标
- `package.json`、`scripts/build-pages.mjs`：Cloudflare Pages 构建配置

## 三、发布方式
### 方式1：GitHub Pages（当前展示）
本项目为纯静态网站，可直接从仓库根目录发布，无需额外构建命令。

1. 打开 GitHub 仓库，进入 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Deploy from a branch**。
3. 选择分支 `main` 和目录 `/(root)`，点击 **Save**。
4. 发布完成后，可通过 `https://alan923.github.io/ShuangHe-guide/` 访问。

之后推送到 `main` 会自动更新网站。GitHub Pages 网站对公众开放；GitHub Free 计划要求仓库为公开仓库，私有仓库需账户计划支持 Pages。

### 方式2：Netlify
1. 登录 Netlify。
2. 将整个网站文件夹拖拽上传。
3. 发布后获取公开访问链接。

## 四、二维码生成
发布获得网站正式网址后，打开 `生成景点二维码.py`，将脚本中的站点地址改为你的正式网址，即可生成：
- 1张首页二维码
- 8张景点详情二维码

## 五、本版优化重点
- 统一主标题为“蔬香小镇·康养双河”
- 统一使用“武隆高山蔬菜基地”名称
- 新增“仙南牧道”点位，共8个特色点位
- 删除多余的提示语、待核实说明和次要标签
- 字体与版式重新整理，整体更简洁大气、适合宣传展示
