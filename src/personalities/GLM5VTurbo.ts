/**
 * GLM5VTurbo.ts — GLM-5V Turbo 分身
 *
 * 定位：视觉理解，多模态分析
 * 厂商：智谱 AI / Zhipu
 */

import type {
  IPersonality,
  PersonalityProfile,
  TaskDescription,
  InvokeResult,
} from "../core/PersonalityCore";
import {
  TaskType,
  CodeStyle,
  DesignPattern,
} from "../core/PersonalityCore";

export class GLM5VTurbo implements IPersonality {
  private profile: PersonalityProfile = {
    id: "glm-5v-turbo",
    name: "GLM-5V-Turbo",
    vendor: "智谱AI",
    version: "5V-Turbo",
    icon: "eye",
    capabilities: {
      codeGeneration: 5,
      engineering: 5,
      algorithmDepth: 5,
      architecture: 4,
      simplicity: 6,
      performance: 6,
      longContext: 6,
      multimodal: 9,
      chinese: 8,
      multilingual: 6,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Moderate,
      designPatterns: [DesignPattern.Adapter],
      dataStructures: ["class", "interface", "Map"],
      exportFormats: ["json", "html", "markdown"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.MultiModal,
      TaskType.Documentation,
      TaskType.DataAnalysis,
      TaskType.Research,
    ],
    weaknesses: [
      TaskType.CodeGeneration,
      TaskType.Architecture,
      TaskType.Math,
      TaskType.Debugging,
    ],
    languages: ["Python", "TypeScript", "JavaScript", "HTML", "CSS"],
    contextWindow: 64000,
    maxToolCalls: 80,
    speedRating: 4,
    costRating: 2,
    systemPrompt: `你是 GLM-5V Turbo，一个视觉理解能力极强的多模态 AI 助手。

核心原则：
1. 视觉优先：能理解图片、图表、截图中的信息。
2. 图文结合：将视觉信息与文本需求结合分析。
3. 快速响应：多模态处理也能保持较高速度。
4. 描述准确：对视觉内容的描述精确、详细。

输出规范：
- 图像分析时使用结构化描述
- 对视觉元素的定位要准确
- 支持从设计稿生成代码`,
    description: "GLM 视觉版，多模态理解能力突出。适合图像分析、图表解读、设计稿转代码等视觉任务。",
  };

  getProfile(): PersonalityProfile {
    return this.profile;
  }

  async invoke(
    task: TaskDescription,
    context?: string,
  ): Promise<InvokeResult> {
    const start = Date.now();
    return {
      personalityId: this.profile.id,
      success: true,
      content: `[GLM-5V Turbo 生成结果] 任务: ${task.description}`,
      durationMs: Date.now() - start,
      tokensUsed: 0,
    };
  }

  canHandle(task: TaskDescription): boolean {
    return this.profile.bestFor.includes(task.type);
  }

  getMatchScore(task: TaskDescription): number {
    if (!this.canHandle(task)) return 0.2;
    let score = 0.6;
    if (task.requiresMultimodal) score += 0.3;
    return Math.min(score, 1);
  }
}
