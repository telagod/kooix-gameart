# NPM 发布指南

## 自动发布流程

### 1. 通过Git Tag发布
```bash
git tag v1.0.1
git push origin v1.0.1
```

### 2. 通过GitHub Actions手动发布
1. 访问 Actions 页面
2. 选择 "Publish to npm" 工作流
3. 点击 "Run workflow"
4. 输入版本号（如 1.0.1）

## 发布前检查清单

- [ ] 代码已测试通过
- [ ] 版本号已更新
- [ ] README.md 已更新
- [ ] CHANGELOG.md 已添加新版本说明
- [ ] 确保 NPM_TOKEN 密钥已配置

## NPM Token 配置

1. 登录 npmjs.com
2. 生成 Access Token (Automation)
3. 在 GitHub Settings > Secrets 中添加 `NPM_TOKEN`

## 本地测试

```bash
# 构建项目
npm run build

# 本地测试安装
npm pack
npm install -g kooix-gameart-mcp-1.0.0.tgz

# 测试命令
kooix-gameart-mcp
```