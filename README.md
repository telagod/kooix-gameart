# Kooix GameArt MCP

[![Release](https://img.shields.io/github/v/release/telagod/kooix-gameart)](https://github.com/telagod/kooix-gameart/releases)
[![CI](https://github.com/telagod/kooix-gameart/actions/workflows/ci.yml/badge.svg)](https://github.com/telagod/kooix-gameart/actions/workflows/ci.yml)

轻量化游戏资源生成MCP工具，专门用于像素游戏和文字游戏的简单SVG资源生成。

## 📑 目录
- [✨ 特性](#-特性)
- [🚀 快速开始](#-快速开始)
- [⚙️ MCP 配置指南](#️-mcp-配置指南)
- [🛠️ MCP工具参考](#️-mcp工具参考)
- [🎨 资源类型示例](#-资源类型示例)
- [🎮 使用场景](#-使用场景)
- [🛠️ 开发](#️-开发)

## ✨ 特性

- 🎮 **专门优化**：针对像素游戏精心设计的提示词模板
- 🚀 **超轻量**：启动 < 1秒，内存占用 < 50MB
- 🎨 **多风格**：支持像素、扁平、描边等风格
- ✨ **动画支持**：简单动画效果（脉冲、旋转、浮动等）
- 📦 **批量生成**：一键生成成套资源系列
- 🎯 **Godot集成**：直接导出到Godot项目格式
- 🗂️ **资源管理**：本地资源库管理和标签系统

## 🚀 快速开始

### 📋 系统要求
- **Node.js**: >= 18.0.0
- **兼容工具**: Claude Desktop, Cursor, VS Code Copilot, Windsurf, Zed 等

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

## ⚙️ MCP 配置指南

### 🔧 主流AI工具配置

<details>
<summary><strong>🔧 Claude Desktop</strong></summary>

**配置位置**: `~/AppData/Roaming/Claude/claude_desktop_config.json` (Windows) 或 `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

**从源码运行**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "node",
      "args": ["/path/to/kooix-gameart/dist/index.js"]
    }
  }
}
```

**使用可执行文件**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "/path/to/kooix-gameart-mcp-win-x64.exe",
      "args": []
    }
  }
}
```

**从GitHub直接安装**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "npx",
      "args": ["https://github.com/telagod/kooix-gameart/tarball/v1.0.2"]
    }
  }
}
```

**从GitHub Packages安装**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "npx",
      "args": ["-y", "@telagod/kooix-gameart-mcp"]
    }
  }
}
```

</details>

<details>
<summary><strong>💻 Claude Code</strong></summary>

**推荐方式 - 使用命令行配置**:

**从GitHub Packages安装**:
```bash
claude mcp add kooix-gameart -- npx -y @telagod/kooix-gameart-mcp
```

**从GitHub直接安装**:
```bash
claude mcp add kooix-gameart -- npx https://github.com/telagod/kooix-gameart/tarball/v1.0.2
```

**使用可执行文件**:
```bash
claude mcp add kooix-gameart -- /path/to/kooix-gameart-mcp-linux-x64
```

**手动配置 - .claude/settings.json**:

**本地安装配置**:
```json
{
  "mcp": {
    "servers": {
      "kooix-gameart": {
        "command": "node",
        "args": ["/path/to/kooix-gameart/dist/index.js"]
      }
    }
  }
}
```

**从GitHub安装**:
```json
{
  "mcp": {
    "servers": {
      "kooix-gameart": {
        "command": "npx",
        "args": ["-y", "@telagod/kooix-gameart-mcp"]
      }
    }
  }
}
```

参考 [Claude Code MCP文档](https://docs.anthropic.com/en/docs/claude-code/mcp) 获取更多信息。

</details>

<details>
<summary><strong>🎯 Cursor</strong></summary>

**配置位置**: `.cursorrules` 或 Cursor 设置中的 MCP 配置

```json
{
  "mcp": {
    "servers": {
      "kooix-gameart": {
        "command": "npx",
        "args": ["-y", "@telagod/kooix-gameart-mcp"]
      }
    }
  }
}
```

**使用本地安装**:
```json
{
  "mcp": {
    "servers": {
      "kooix-gameart": {
        "command": "node",
        "args": ["./node_modules/@telagod/kooix-gameart-mcp/dist/index.js"]
      }
    }
  }
}
```

</details>

<details>
<summary><strong>💻 VS Code + Continue</strong></summary>

**配置位置**: `~/.continue/config.json`

```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "npx",
      "args": ["-y", "@telagod/kooix-gameart-mcp"]
    }
  }
}
```

**本地开发配置**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "node",
      "args": ["/workspace/kooix-gameart/dist/index.js"]
    }
  }
}
```

</details>

<details>
<summary><strong>🌊 Windsurf</strong></summary>

**配置位置**: Windsurf MCP 设置

```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "npx",
      "args": ["-y", "@telagod/kooix-gameart-mcp"]
    }
  }
}
```

**可执行文件配置**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "/path/to/kooix-gameart-mcp",
      "args": []
    }
  }
}
```

</details>

<details>
<summary><strong>⚡ Zed</strong></summary>

**配置位置**: `~/.config/zed/settings.json`

```json
{
  "experimental": {
    "mcp": {
      "servers": {
        "kooix-gameart": {
          "command": "npx",
          "args": ["-y", "@telagod/kooix-gameart-mcp"]
        }
      }
    }
  }
}
```

</details>

<details>
<summary><strong>🧠 JetBrains AI Assistant</strong></summary>

**配置位置**: IDE Settings > AI Assistant > Model Context Protocol

```xml
<server name="kooix-gameart">
  <command>npx</command>
  <args>
    <arg>-y</arg>
    <arg>@telagod/kooix-gameart-mcp</arg>
  </args>
</server>
```

**IntelliJ IDEA 配置文件**:
```json
{
  "mcp": {
    "servers": [
      {
        "name": "kooix-gameart",
        "command": "npx",
        "args": ["-y", "@telagod/kooix-gameart-mcp"]
      }
    ]
  }
}
```

</details>

<details>
<summary><strong>🚀 其他AI工具</strong></summary>

**Augment Code**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "npx",
      "args": ["-y", "@telagod/kooix-gameart-mcp"]
    }
  }
}
```

**Copilot Chat**:
```json
{
  "mcp": {
    "servers": {
      "kooix-gameart": {
        "command": "npx",
        "args": ["-y", "@telagod/kooix-gameart-mcp"]
      }
    }
  }
}
```

**Tabnine**:
```json
{
  "mcpServers": {
    "kooix-gameart": {
      "command": "npx",
      "args": ["-y", "@telagod/kooix-gameart-mcp"]
    }
  }
}
```

</details>

### 🐳 容器化部署

<details>
<summary><strong>🐳 Docker 配置</strong></summary>

**Dockerfile**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g @telagod/kooix-gameart-mcp
EXPOSE 3000
CMD ["kooix-gameart-mcp"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  kooix-gameart-mcp:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./assets:/app/assets
```

**使用预构建镜像**:
```bash
docker run -p 3000:3000 -v ./assets:/app/assets kooix-gameart-mcp
```

</details>

### ✅ 验证安装

配置完成后，验证MCP服务器是否正常工作：

**Claude Code 验证**:
```bash
# 检查已安装的MCP服务器
claude mcp list

# 测试服务器连接
claude mcp test kooix-gameart
```

**在AI工具中测试**:

1. **生成游戏图标**:
   ```
   使用 kooix-gameart 生成一个红色血瓶图标
   ```

2. **批量生成UI元素**:
   ```
   生成一套攻击、防御、治疗按钮
   ```

3. **管理资源库**:
   ```
   列出我的所有游戏资源
   ```

4. **检查MCP工具可用性**:
   ```
   显示 kooix-gameart 的所有可用工具
   ```

## 🛠️ MCP工具参考

### 📝 工具概览
本MCP服务器提供4个核心工具，用于游戏资源的生成和管理：

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