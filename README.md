# Kooix GameArt MCP

[![Release](https://img.shields.io/github/v/release/telagod/kooix-gameart)](https://github.com/telagod/kooix-gameart/releases)
[![CI](https://github.com/telagod/kooix-gameart/actions/workflows/ci.yml/badge.svg)](https://github.com/telagod/kooix-gameart/actions/workflows/ci.yml)

轻量化游戏资源生成MCP工具，专门用于像素游戏和文字游戏的简单SVG资源生成。

## ✨ 特性

- 🎮 **专门优化**：针对像素游戏精心设计的提示词模板
- 🚀 **超轻量**：启动 < 1秒，内存占用 < 50MB
- 🎨 **多风格**：支持像素、扁平、描边等风格
- ✨ **动画支持**：简单动画效果（脉冲、旋转、浮动等）
- 📦 **批量生成**：一键生成成套资源系列
- 🎯 **Godot集成**：直接导出到Godot项目格式
- 🗂️ **资源管理**：本地资源库管理和标签系统

## 🚀 快速开始

### 🎯 可执行文件（推荐，无需Node.js）
1. 前往 [Releases](https://github.com/telagod/kooix-gameart/releases) 页面
2. 下载对应平台的可执行文件：
   - Windows: `kooix-gameart-mcp-win-x64.exe`
   - Linux: `kooix-gameart-mcp-linux-x64` 
   - macOS: `kooix-gameart-mcp-macos-x64`
3. 直接运行即可启动MCP服务器

### 📦 从GitHub直接安装
```bash
# 安装最新版本
npm install https://github.com/telagod/kooix-gameart/tarball/main

# 安装特定版本
npm install https://github.com/telagod/kooix-gameart/tarball/v1.0.0
```

### 🔧 从GitHub Packages安装
```bash
# 配置GitHub Packages（一次性设置）
echo "@telagod:registry=https://npm.pkg.github.com" >> ~/.npmrc

# 安装包
npm install @telagod/kooix-gameart-mcp
```

### 💻 本地开发
```bash
git clone https://github.com/telagod/kooix-gameart.git
cd kooix-gameart
npm install
npm run dev
```

## 🛠️ MCP工具

### 1. generate_asset - 生成单个资源
```javascript
{
  "asset_type": "icon",           // ui_button | icon | character | item | background_element
  "description": "红色血瓶",       // 资源描述
  "size": "32x32",               // 16x16 | 32x32 | 64x64 | 128x128
  "style": "pixel",              // pixel | flat | outline  
  "animated": false,             // 是否添加动画
  "color_scheme": "warm"         // warm | cool | monochrome | 自定义
}
```

### 2. batch_generate - 批量生成
```javascript
{
  "template": "ui_set",          // ui_set | item_series | character_states
  "base_description": "攻击按钮",
  "variations": [],              // 留空使用预设模板
  "shared_config": {
    "asset_type": "ui_button",
    "style": "pixel", 
    "size": "64x64"
  }
}
```

### 3. manage_library - 资源管理
```javascript
{
  "action": "list",              // list | search | delete | tag
  "query": "按钮",               // 搜索关键词
  "asset_id": "uuid-here",       // 资源ID
  "tags": ["ui", "button"]       // 标签列表
}
```

### 4. export_godot - Godot导出
```javascript
{
  "asset_ids": ["id1", "id2"],
  "output_path": "/path/to/godot/project",
  "create_import_config": true,
  "texture_settings": {
    "filter": false,
    "mipmaps": false
  }
}
```

## 🎨 资源类型示例

### UI按钮
- 正常/悬停/按下/禁用状态
- 圆角矩形，清晰视觉层次
- 适合游戏界面

### 游戏图标
- 血瓶、魔法瓶、金币
- 武器、装备、道具
- 16x16 像素完美

### 角色元素
- 简单几何形状
- 不同状态和姿态
- 适合像素游戏

### 背景元素  
- 装饰图案、树木、石头
- 可平铺的纹理
- 环境装饰

## 🎮 使用场景

- **独立游戏开发**：快速生成游戏资源原型
- **像素游戏**：专门优化的像素风格生成
- **文字游戏**：简单UI图标和装饰元素
- **原型设计**：快速迭代游戏界面
- **教育项目**：学习游戏开发的资源生成

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建项目
npm run build

# 运行构建版本
npm start
```

## 📝 技术栈

- **MCP协议**：Model Context Protocol 标准
- **TypeScript**：类型安全的开发体验
- **Node.js**：轻量级运行时
- **本地存储**：JSON文件管理，无数据库依赖

## 📊 项目结构

```
kooix-gameart/
├── src/
│   ├── index.ts      # MCP服务器入口
│   ├── tools.ts      # 4个核心工具实现
│   ├── templates.ts  # 精心设计的提示词模板
│   └── types.ts      # TypeScript类型定义
├── assets/
│   ├── library.json  # 资源库索引
│   └── generated/    # 生成的SVG文件
└── .github/
    └── workflows/    # CI/CD自动化
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [GitHub仓库](https://github.com/telagod/kooix-gameart)
- [GitHub Releases](https://github.com/telagod/kooix-gameart/releases)
- [GitHub Packages](https://github.com/telagod/kooix-gameart/packages)
- [问题反馈](https://github.com/telagod/kooix-gameart/issues)
- [MCP官方文档](https://modelcontextprotocol.io/)

---

**由 ❤️ 和 AI 驱动，为游戏开发者打造**