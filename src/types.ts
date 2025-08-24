// 资源类型定义
export type AssetType = 'ui_button' | 'icon' | 'character' | 'item' | 'background_element';
export type AssetSize = '16x16' | '32x32' | '64x64' | '128x128';
export type AssetStyle = 'pixel' | 'flat' | 'outline';
export type ColorScheme = 'warm' | 'cool' | 'monochrome' | string;
export type AnimationType = 'none' | 'pulse' | 'rotate' | 'float' | 'glow';

// 批量生成模板类型
export type BatchTemplate = 'ui_set' | 'item_series' | 'character_states' | 'custom';

// 资源库操作类型
export type LibraryAction = 'list' | 'search' | 'delete' | 'tag' | 'export_metadata';

// 基础资源配置
export interface AssetConfig {
  asset_type: AssetType;
  description: string;
  size?: AssetSize;
  style?: AssetStyle;
  animated?: boolean;
  animation_type?: AnimationType;
  color_scheme?: ColorScheme;
}

// 批量生成配置
export interface BatchConfig {
  template: BatchTemplate;
  base_description: string;
  variations: string[];
  shared_config?: Partial<AssetConfig>;
}

// 资源库管理配置
export interface LibraryConfig {
  action: LibraryAction;
  query?: string;
  tags?: string[];
  asset_id?: string;
}

// Godot导出配置
export interface GodotExportConfig {
  asset_ids: string[];
  output_path: string;
  create_import_config?: boolean;
  texture_settings?: {
    filter?: boolean;
    mipmaps?: boolean;
  };
}

// 资源记录
export interface AssetRecord {
  id: string;
  config: AssetConfig;
  svg_content: string;
  file_path: string;
  created_at: string;
  tags: string[];
  metadata?: {
    prompt_used?: string;
    generation_time?: number;
    file_size?: number;
  };
}

// 资源库结构
export interface AssetLibrary {
  version: string;
  created_at: string;
  assets: Record<string, AssetRecord>;
  tags: string[];
  stats: {
    total_assets: number;
    by_type: Record<AssetType, number>;
    by_style: Record<AssetStyle, number>;
  };
}

// MCP工具响应类型
export interface ToolResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}