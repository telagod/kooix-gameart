# 资源库目录

本目录包含：

- `library.json` - 资源索引和元数据
- `generated/` - 生成的SVG资源文件

## 目录结构

```
assets/
├── library.json      # 资源库索引
└── generated/        # SVG文件存储
    ├── ui_button_*.svg
    ├── icon_*.svg  
    ├── character_*.svg
    ├── item_*.svg
    └── background_element_*.svg
```

所有资源都会自动管理，请勿手动修改 `library.json` 文件。