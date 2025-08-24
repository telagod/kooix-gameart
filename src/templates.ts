import { AssetType, AssetStyle, AssetSize, ColorScheme, AnimationType } from './types.js';

// 颜色方案映射
const COLOR_SCHEMES = {
  warm: ['#FF6B35', '#F7931E', '#FFD23F', '#EE964B', '#C73E1D'],
  cool: ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#0081AF'],
  monochrome: ['#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF'],
  retro: ['#8B4513', '#FFD700', '#FF4500', '#228B22', '#4169E1'],
  neon: ['#FF1493', '#00FFFF', '#ADFF2F', '#FF69B4', '#1E90FF']
} as const;

// 像素风格SVG生成的核心提示词模板
export class PromptTemplates {
  
  // 基础提示词前缀
  private static readonly BASE_PREFIX = `Create a pixel-perfect SVG icon in pure SVG format. 
CRITICAL REQUIREMENTS:
- Output ONLY the SVG code, no explanations
- Use only simple geometric shapes (rect, circle, polygon)
- Sharp edges, no curves or gradients for pixel style
- Minimal detail, bold simple forms
- Clean readable design at small sizes
- Use fill colors only, no stroke outlines`;

  // 根据资源类型生成专门的提示词
  static getAssetTypePrompt(assetType: AssetType): string {
    const typePrompts = {
      ui_button: "Design a game UI button with clear visual hierarchy. Should look clickable with proper states (normal, hover, pressed). Include subtle depth or shadow.",
      icon: "Create a simple, instantly recognizable icon. Should be clear and readable even at 16x16 pixels. Use bold, simple shapes.",
      character: "Design a simple character or creature. Use basic geometric forms. Should have personality but remain very simple for pixel games.",
      item: "Create a game item or tool. Should be immediately identifiable. Think RPG inventory items - clear silhouette and purpose.",
      background_element: "Design a simple background element like trees, rocks, or decorative patterns. Should tile well or work as accent elements."
    };
    
    return typePrompts[assetType];
  }

  // 根据风格生成样式约束
  static getStyleConstraints(style: AssetStyle): string {
    const styleConstraints = {
      pixel: "PIXEL ART STYLE: Use only rectangles and squares. No anti-aliasing. Sharp, blocky edges. Limit to 8-16 colors maximum. Think 8-bit game graphics.",
      flat: "FLAT DESIGN STYLE: Use simple geometric shapes with solid colors. No shadows or depth effects. Clean, minimal, modern look.",
      outline: "OUTLINE STYLE: Use thick black outlines (stroke-width='2') with simple fill colors. Bold, cartoon-like appearance."
    };
    
    return styleConstraints[style];
  }

  // 生成尺寸约束
  static getSizeConstraints(size: AssetSize): string {
    const [width, height] = size.split('x').map(n => parseInt(n));
    return `SVG viewBox must be exactly "0 0 ${width} ${height}". Design should be optimized for this resolution. Keep details appropriate for this size.`;
  }

  // 生成颜色约束
  static getColorConstraints(colorScheme: ColorScheme): string {
    if (colorScheme in COLOR_SCHEMES) {
      const colors = COLOR_SCHEMES[colorScheme as keyof typeof COLOR_SCHEMES];
      return `Use only these colors: ${colors.join(', ')}. Select 2-4 colors from this palette for the design.`;
    }
    return `Use colors that match the theme: ${colorScheme}. Limit to 2-4 main colors.`;
  }

  // 生成动画约束
  static getAnimationConstraints(animationType: AnimationType): string {
    if (animationType === 'none') return '';
    
    const animationPrompts = {
      pulse: "Add a subtle pulse animation using <animateTransform> with scale transform. Duration 2s, repeat indefinitely.",
      rotate: "Add a rotation animation using <animateTransform> with rotate transform. Duration 3s, repeat indefinitely.",
      float: "Add a floating animation using <animateTransform> with translate transform. Subtle up-down movement.",
      glow: "Add a glow effect using <animate> on fill opacity. Subtle brightness change every 2 seconds.",
      none: ""
    };
    
    return animationPrompts[animationType] || '';
  }

  // 组合完整的生成提示词
  static generatePrompt(
    assetType: AssetType,
    description: string,
    style: AssetStyle = 'pixel',
    size: AssetSize = '32x32',
    colorScheme: ColorScheme = 'warm',
    animationType: AnimationType = 'none'
  ): string {
    const parts = [
      this.BASE_PREFIX,
      this.getAssetTypePrompt(assetType),
      `DESCRIPTION: ${description}`,
      this.getStyleConstraints(style),
      this.getSizeConstraints(size),
      this.getColorConstraints(colorScheme),
      this.getAnimationConstraints(animationType),
      "Remember: Output ONLY the SVG code starting with <svg> and ending with </svg>"
    ].filter(part => part.length > 0);

    return parts.join('\n\n');
  }

  // 批量生成的变体提示词
  static getBatchVariations(template: string, baseDescription: string): string[] {
    const templates = {
      ui_set: [
        `${baseDescription} - normal state`,
        `${baseDescription} - hover state (slightly brighter)`,
        `${baseDescription} - pressed state (slightly darker)`,
        `${baseDescription} - disabled state (grayed out)`
      ],
      item_series: [
        `${baseDescription} - level 1 (basic)`,
        `${baseDescription} - level 2 (improved)`,
        `${baseDescription} - level 3 (advanced)`,
        `${baseDescription} - legendary variant`
      ],
      character_states: [
        `${baseDescription} - idle pose`,
        `${baseDescription} - action pose`,
        `${baseDescription} - hurt state`,
        `${baseDescription} - victory pose`
      ]
    };

    return templates[template as keyof typeof templates] || [baseDescription];
  }
}

// 导出颜色方案用于其他模块
export { COLOR_SCHEMES };