# GitHub 分发指南

本项目支持多种从GitHub获取和安装的方式，无需发布到npm。

## 🎯 安装方式

### 1. 可执行文件（推荐）
**优势**: 无需Node.js环境，开箱即用
```bash
# 下载并运行
curl -L https://github.com/telagod/kooix-gameart/releases/latest/download/kooix-gameart-mcp-linux-x64 -o kooix-gameart-mcp
chmod +x kooix-gameart-mcp
./kooix-gameart-mcp
```

### 2. GitHub Tarball 安装
**优势**: 直接从源码安装，支持版本控制
```bash
# 最新版本
npm install https://github.com/telagod/kooix-gameart/tarball/main

# 特定版本
npm install https://github.com/telagod/kooix-gameart/tarball/v1.0.0

# 特定分支
npm install https://github.com/telagod/kooix-gameart/tarball/develop
```

### 3. GitHub Packages
**优势**: 版本化管理，私有仓库支持
```bash
# 一次性配置
echo "@telagod:registry=https://npm.pkg.github.com" >> ~/.npmrc

# 安装
npm install @telagod/kooix-gameart-mcp
```

### 4. Git Clone 开发
**优势**: 完整源码，便于修改和贡献
```bash
git clone https://github.com/telagod/kooix-gameart.git
cd kooix-gameart
npm install && npm run build
npm start
```

## 🚀 发布流程

### 自动发布
```bash
# 创建版本标签触发自动构建
git tag v1.0.0
git push origin v1.0.0
```

这将自动：
- 构建跨平台可执行文件
- 创建GitHub Release
- 发布到GitHub Packages
- 生成安装说明

### 手动发布
在GitHub Actions页面手动触发工作流

## 📦 文件结构
发布后的Release包含：
- `kooix-gameart-mcp-win-x64.exe` - Windows可执行文件
- `kooix-gameart-mcp-linux-x64` - Linux可执行文件  
- `kooix-gameart-mcp-macos-x64` - macOS可执行文件
- `kooix-gameart-mcp-*.tgz` - npm包文件
- 源码压缩包

## 🔄 版本管理
- 主分支: `main` - 稳定版本
- 开发分支: `develop` - 开发版本
- 版本标签: `v*.*.*` - 发布版本