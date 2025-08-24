import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PromptTemplates } from './templates.js';
import type {
  AssetConfig,
  AssetRecord, 
  AssetLibrary,
  BatchConfig,
  LibraryConfig,
  GodotExportConfig,
  ToolResponse
} from './types.js';

export class GameAssetTools {
  private readonly assetsPath: string;
  private readonly libraryPath: string;
  private readonly generatedPath: string;

  constructor() {
    this.assetsPath = join(process.cwd(), 'assets');
    this.libraryPath = join(this.assetsPath, 'library.json');
    this.generatedPath = join(this.assetsPath, 'generated');
    
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    if (!existsSync(this.assetsPath)) mkdirSync(this.assetsPath, { recursive: true });
    if (!existsSync(this.generatedPath)) mkdirSync(this.generatedPath, { recursive: true });
    
    if (!existsSync(this.libraryPath)) {
      this.initializeLibrary();
    }
  }

  private initializeLibrary(): void {
    const initialLibrary: AssetLibrary = {
      version: '1.0.0',
      created_at: new Date().toISOString(),
      assets: {},
      tags: [],
      stats: {
        total_assets: 0,
        by_type: {
          ui_button: 0,
          icon: 0,
          character: 0,
          item: 0,
          background_element: 0
        },
        by_style: {
          pixel: 0,
          flat: 0,
          outline: 0
        }
      }
    };
    
    writeFileSync(this.libraryPath, JSON.stringify(initialLibrary, null, 2));
  }

  private loadLibrary(): AssetLibrary {
    try {
      return JSON.parse(readFileSync(this.libraryPath, 'utf-8'));
    } catch (error) {
      this.initializeLibrary();
      return this.loadLibrary();
    }
  }

  private saveLibrary(library: AssetLibrary): void {
    library.stats.total_assets = Object.keys(library.assets).length;
    writeFileSync(this.libraryPath, JSON.stringify(library, null, 2));
  }

  private updateStats(library: AssetLibrary, config: AssetConfig, increment: boolean = true): void {
    const delta = increment ? 1 : -1;
    library.stats.by_type[config.asset_type] += delta;
    library.stats.by_style[config.style || 'pixel'] += delta;
  }

  // 工具1: 生成单个资源
  async generateAsset(config: AssetConfig): Promise<ToolResponse> {
    try {
      const startTime = Date.now();
      
      // 生成提示词
      const prompt = PromptTemplates.generatePrompt(
        config.asset_type,
        config.description,
        config.style || 'pixel',
        config.size || '32x32',
        config.color_scheme || 'warm',
        config.animated ? 'pulse' : 'none'
      );

      // 这里应该调用LLM API生成SVG，现在用示例SVG代替
      const svgContent = this.generatePlaceholderSVG(config);
      
      // 创建资源记录
      const assetId = uuidv4();
      const fileName = `${config.asset_type}_${assetId.slice(0, 8)}.svg`;
      const filePath = join(this.generatedPath, fileName);
      
      // 保存SVG文件
      writeFileSync(filePath, svgContent);
      
      // 更新资源库
      const library = this.loadLibrary();
      const assetRecord: AssetRecord = {
        id: assetId,
        config,
        svg_content: svgContent,
        file_path: filePath,
        created_at: new Date().toISOString(),
        tags: [config.asset_type, config.style || 'pixel'],
        metadata: {
          prompt_used: prompt,
          generation_time: Date.now() - startTime,
          file_size: Buffer.byteLength(svgContent, 'utf-8')
        }
      };
      
      library.assets[assetId] = assetRecord;
      this.updateStats(library, config);
      this.saveLibrary(library);
      
      return {
        success: true,
        message: `生成资源成功: ${fileName}`,
        data: {
          asset_id: assetId,
          file_path: filePath,
          preview_url: `file://${filePath}`
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '生成资源失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 工具2: 批量生成资源
  async batchGenerate(batchConfig: BatchConfig): Promise<ToolResponse> {
    try {
      const variations = batchConfig.variations.length > 0 
        ? batchConfig.variations 
        : PromptTemplates.getBatchVariations(batchConfig.template, batchConfig.base_description);

      const results = [];
      
      for (const variation of variations) {
        const config: AssetConfig = {
          ...batchConfig.shared_config,
          asset_type: batchConfig.shared_config?.asset_type || 'icon',
          description: variation
        };
        
        const result = await this.generateAsset(config);
        results.push({ variation, result });
      }

      const successful = results.filter(r => r.result.success).length;
      
      return {
        success: successful > 0,
        message: `批量生成完成: ${successful}/${results.length} 成功`,
        data: {
          total: results.length,
          successful,
          results: results.map(r => ({
            variation: r.variation,
            asset_id: r.result.data?.asset_id,
            success: r.result.success
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '批量生成失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 工具3: 资源库管理
  async manageLibrary(config: LibraryConfig): Promise<ToolResponse> {
    try {
      const library = this.loadLibrary();
      
      switch (config.action) {
        case 'list':
          const assets = Object.values(library.assets).slice(0, 20); // 限制返回数量
          return {
            success: true,
            message: `找到 ${library.stats.total_assets} 个资源`,
            data: {
              assets: assets.map(asset => ({
                id: asset.id,
                type: asset.config.asset_type,
                description: asset.config.description,
                created_at: asset.created_at,
                tags: asset.tags
              })),
              stats: library.stats
            }
          };

        case 'search':
          if (!config.query) {
            return { success: false, message: '搜索查询不能为空', error: 'Query required' };
          }
          
          const searchResults = Object.values(library.assets).filter(asset =>
            asset.config.description.toLowerCase().includes(config.query!.toLowerCase()) ||
            asset.tags.some(tag => tag.toLowerCase().includes(config.query!.toLowerCase()))
          );
          
          return {
            success: true,
            message: `找到 ${searchResults.length} 个匹配资源`,
            data: { assets: searchResults.map(asset => ({
              id: asset.id,
              description: asset.config.description,
              tags: asset.tags,
              file_path: asset.file_path
            }))}
          };

        case 'delete':
          if (!config.asset_id) {
            return { success: false, message: '资源ID不能为空', error: 'Asset ID required' };
          }
          
          const assetToDelete = library.assets[config.asset_id];
          if (!assetToDelete) {
            return { success: false, message: '资源不存在', error: 'Asset not found' };
          }
          
          // 删除文件和记录
          if (existsSync(assetToDelete.file_path)) {
            require('fs').unlinkSync(assetToDelete.file_path);
          }
          
          this.updateStats(library, assetToDelete.config, false);
          delete library.assets[config.asset_id];
          this.saveLibrary(library);
          
          return {
            success: true,
            message: '资源删除成功',
            data: { deleted_id: config.asset_id }
          };

        case 'tag':
          if (!config.asset_id || !config.tags) {
            return { success: false, message: '资源ID和标签不能为空', error: 'Asset ID and tags required' };
          }
          
          const assetToTag = library.assets[config.asset_id];
          if (!assetToTag) {
            return { success: false, message: '资源不存在', error: 'Asset not found' };
          }
          
          assetToTag.tags = [...new Set([...assetToTag.tags, ...config.tags])];
          library.tags = [...new Set([...library.tags, ...config.tags])];
          this.saveLibrary(library);
          
          return {
            success: true,
            message: '标签添加成功',
            data: { asset_id: config.asset_id, tags: assetToTag.tags }
          };

        default:
          return { success: false, message: '不支持的操作', error: 'Unsupported action' };
      }
    } catch (error) {
      return {
        success: false,
        message: '资源库操作失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 工具4: Godot导出
  async exportToGodot(config: GodotExportConfig): Promise<ToolResponse> {
    try {
      const library = this.loadLibrary();
      const exportedFiles = [];
      
      for (const assetId of config.asset_ids) {
        const asset = library.assets[assetId];
        if (!asset) continue;
        
        // 复制SVG文件到目标目录
        const targetPath = join(config.output_path, `${asset.config.asset_type}_${assetId.slice(0, 8)}.svg`);
        const targetDir = dirname(targetPath);
        
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }
        
        writeFileSync(targetPath, asset.svg_content);
        exportedFiles.push(targetPath);
        
        // 创建Godot导入配置文件
        if (config.create_import_config) {
          const importConfig = this.generateGodotImportConfig(asset, config);
          writeFileSync(`${targetPath}.import`, importConfig);
        }
      }
      
      return {
        success: true,
        message: `成功导出 ${exportedFiles.length} 个资源到Godot项目`,
        data: {
          exported_files: exportedFiles,
          godot_project_path: config.output_path
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Godot导出失败',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 生成占位符SVG（实际使用时应替换为LLM调用）
  private generatePlaceholderSVG(config: AssetConfig): string {
    const [width, height] = (config.size || '32x32').split('x').map(n => parseInt(n));
    const color = config.color_scheme === 'cool' ? '#2E86AB' : '#FF6B35';
    
    return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${color}" rx="2"/>
  <rect x="4" y="4" width="${width-8}" height="${height-8}" fill="#FFFFFF" opacity="0.8"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#000000" font-size="8" font-family="monospace">${config.asset_type.slice(0, 3).toUpperCase()}</text>
</svg>`;
  }

  // 生成Godot导入配置
  private generateGodotImportConfig(asset: AssetRecord, config: GodotExportConfig): string {
    const filter = config.texture_settings?.filter ?? false;
    const mipmaps = config.texture_settings?.mipmaps ?? false;
    
    return `[remap]

importer="texture"
type="StreamTexture"
path="res://.import/${asset.config.asset_type}_${asset.id.slice(0, 8)}.svg-${asset.id}.stex"
metadata={
"vram_texture": false
}

[deps]

source_file="res://${asset.config.asset_type}_${asset.id.slice(0, 8)}.svg"
dest_files=[ "res://.import/${asset.config.asset_type}_${asset.id.slice(0, 8)}.svg-${asset.id}.stex" ]

[params]

compress/mode=0
compress/lossy_quality=0.7
compress/hdr_mode=0
compress/bptc_ldr=0
compress/normal_map=0
flags/repeat=0
flags/filter=${filter}
flags/mipmaps=${mipmaps}
flags/anisotropic=false
flags/srgb=2
process/fix_alpha_border=true
process/premult_alpha=false
process/HDR_as_SRGB=false
process/invert_color=false
stream=false
size_limit=0
detect_3d=true
svg/scale=1.0
`;
  }
}