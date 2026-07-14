/**
 * GLM51.ts — GLM-5.1 分身
 *
 * 定位：均衡型通用助手，性能与成本平衡
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

export class GLM51 implements IPersonality {
  private profile: PersonalityProfile = {
    id: "glm-51",
    name: "GLM-5.1",
    vendor: "智谱AI",
    version: "5.1",
    icon: "Z",
    capabilities: {
      codeGeneration: 7,
      engineering: 6,
      algorithmDepth: 6,
      architecture: 6,
      simplicity: 7,
      performance: 7,
      longContext: 7,
      multimodal: 5,
      chinese: 8,
      multilingual: 7,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Moderate,
      designPatterns: [DesignPattern.Factory],
      dataStructures: ["class", "interface", "Map", "array"],
      exportFormats: ["typescript", "json"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.CodeGeneration,
      TaskType.Documentation,
      TaskType.Translation,
      TaskType.DataAnalysis,
      TaskType.QuickTask,
    ],
    weaknesses: [
      TaskType.Architecture,
      TaskType.MultiModal,
      TaskType.Math,
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Java", "Go"],
    contextWindow: 128000,
    maxToolCalls: 100,
    speedRating: 4,
    costRating: 2,
    systemPrompt: `你是 GLM-5.1，智谱 AI 的均衡型助手。

核心原则：
1. 均衡发展：在各项能力之间取得平衡。
2. 高性价比：以较低成本提供高质量输出。
3. 中文友好：对中文表达有良好理解。
4. 通用性强：能处理各种常见任务。

输出规范：
- 代码结构清晰但不过度复杂
- 注释适度
- 直接回答问题`,
    description: "GLM 均衡版，性价比之王。适合日常通用任务，在质量和成本之间取得最佳平衡。",
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
      content: `[GLM-5.1 生成结果] 任务: ${task.description}`,
      durationMs: Date.now() - start,
      tokensUsed: 0,
    };
  }

  canHandle(task: TaskDescription): boolean {
    return this.profile.bestFor.includes(task.type);
  }

  getMatchScore(task: TaskDescription): number {
    if (!this.canHandle(task)) return 0.3;
    let score = 0.6;
    if (task.maxCost && task.maxCost <= 2) score += 0.15;
    if (task.requiresSimplicity) score += 0.1;
    return Math.min(score, 1);
  }
}
