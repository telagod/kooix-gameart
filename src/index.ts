#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { GameAssetTools } from './tools.js';
import type {
  AssetConfig,
  BatchConfig, 
  LibraryConfig,
  GodotExportConfig
} from './types.js';

class KooixGameArtServer {
  private server: Server;
  private tools: GameAssetTools;

  constructor() {
    this.server = new Server(
      {
        name: 'kooix-gameart',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.tools = new GameAssetTools();
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // 工具列表定义
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_asset',
            description: '生成像素风格游戏资源SVG',
            inputSchema: {
              type: 'object',
              properties: {
                asset_type: {
                  type: 'string',
                  enum: ['ui_button', 'icon', 'character', 'item', 'background_element'],
                  description: '资源类型'
                },
                description: {
                  type: 'string',
                  description: '资源描述，如 "红色血瓶" 或 "攻击按钮"'
                },
                size: {
                  type: 'string', 
                  enum: ['16x16', '32x32', '64x64', '128x128'],
                  default: '32x32',
                  description: '资源尺寸'
                },
                style: {
                  type: 'string',
                  enum: ['pixel', 'flat', 'outline'],
                  default: 'pixel',
                  description: '视觉风格'
                },
                animated: {
                  type: 'boolean',
                  default: false,
                  description: '是否添加简单动画效果'
                },
                color_scheme: {
                  type: 'string',
                  default: 'warm',
                  description: '颜色方案：warm, cool, monochrome, retro, neon 或自定义'
                }
              },
              required: ['asset_type', 'description']
            }
          },
          {
            name: 'batch_generate',
            description: '批量生成相关资源系列',
            inputSchema: {
              type: 'object',
              properties: {
                template: {
                  type: 'string',
                  enum: ['ui_set', 'item_series', 'character_states', 'custom'],
                  description: '批量模板类型'
                },
                base_description: {
                  type: 'string',
                  description: '基础描述，用于生成变体'
                },
                variations: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '自定义变体列表（可选，留空使用预设模板）'
                },
                shared_config: {
                  type: 'object',
                  properties: {
                    asset_type: { type: 'string', enum: ['ui_button', 'icon', 'character', 'item', 'background_element'] },
                    size: { type: 'string', enum: ['16x16', '32x32', '64x64', '128x128'] },
                    style: { type: 'string', enum: ['pixel', 'flat', 'outline'] },
                    color_scheme: { type: 'string' }
                  },
                  description: '所有资源共享的配置'
                }
              },
              required: ['template', 'base_description']
            }
          },
          {
            name: 'manage_library',
            description: '管理本地资源库',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['list', 'search', 'delete', 'tag'],
                  description: '操作类型'
                },
                query: {
                  type: 'string',
                  description: '搜索查询字符串'
                },
                asset_id: {
                  type: 'string',
                  description: '资源ID（用于删除或添加标签）'
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '标签列表'
                }
              },
              required: ['action']
            }
          },
          {
            name: 'export_godot',
            description: '导出资源到Godot项目',
            inputSchema: {
              type: 'object',
              properties: {
                asset_ids: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '要导出的资源ID列表'
                },
                output_path: {
                  type: 'string',
                  description: 'Godot项目的目标路径'
                },
                create_import_config: {
                  type: 'boolean',
                  default: true,
                  description: '是否创建Godot导入配置文件'
                },
                texture_settings: {
                  type: 'object',
                  properties: {
                    filter: { type: 'boolean', default: false },
                    mipmaps: { type: 'boolean', default: false }
                  },
                  description: 'Godot纹理设置'
                }
              },
              required: ['asset_ids', 'output_path']
            }
          }
        ]
      };
    });

    // 工具调用处理
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_asset': {
            const config = args as unknown as AssetConfig;
            const result = await this.tools.generateAsset(config);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }

          case 'batch_generate': {
            const config = args as unknown as BatchConfig;
            const result = await this.tools.batchGenerate(config);
            
            return {
              content: [
                {
                  type: 'text', 
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }

          case 'manage_library': {
            const config = args as unknown as LibraryConfig;
            const result = await this.tools.manageLibrary(config);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }

          case 'export_godot': {
            const config = args as unknown as GodotExportConfig;
            const result = await this.tools.exportToGodot(config);
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                message: 'Tool execution failed',
                error: errorMessage
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Server Error]', error);
    };

    process.on('SIGINT', async () => {
      console.log('\\n[Kooix GameArt] Shutting down gracefully...');
      await this.server.close();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('[Kooix GameArt MCP Server] Started successfully');
    console.error('[Version] 1.0.0');
    console.error('[Tools] generate_asset, batch_generate, manage_library, export_godot');
  }
}

// 启动服务器
async function main() {
  try {
    const server = new KooixGameArtServer();
    await server.start();
  } catch (error) {
    console.error('[Startup Error]', error);
    process.exit(1);
  }
}

// 仅在直接运行时启动服务器
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('[Fatal Error]', error);
    process.exit(1);
  });
}