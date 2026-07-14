/**
 * GLM52.ts — GLM-5.2 分身
 *
 * 定位：综合旗舰，复杂对话与多步骤任务
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

export class GLM52 implements IPersonality {
  private profile: PersonalityProfile = {
    id: "glm-52",
    name: "GLM-5.2",
    vendor: "智谱AI",
    version: "5.2",
    icon: "Z",
    capabilities: {
      codeGeneration: 8,
      engineering: 7,
      algorithmDepth: 7,
      architecture: 7,
      simplicity: 6,
      performance: 7,
      longContext: 8,
      multimodal: 6,
      chinese: 9,
      multilingual: 7,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Moderate,
      designPatterns: [DesignPattern.Factory, DesignPattern.Adapter],
      dataStructures: ["interface", "class", "enum", "Map"],
      exportFormats: ["typescript", "json", "markdown"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.CodeGeneration,
      TaskType.Architecture,
      TaskType.Documentation,
      TaskType.DataAnalysis,
      TaskType.Research,
      TaskType.LongContext,
    ],
    weaknesses: [
      TaskType.QuickTask,
      TaskType.DevOps,
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Java", "Go", "C++"],
    contextWindow: 128000,
    maxToolCalls: 150,
    speedRating: 3,
    costRating: 3,
    systemPrompt: `你是 GLM-5.2，智谱 AI 的旗舰模型，综合能力极强。

核心原则：
1. 全面均衡：在代码、分析、创作之间灵活切换。
2. 多步骤执行：能处理需要多轮推理的复杂任务。
3. 中文深度理解：对中文语义、文化、行业术语有深入理解。
4. 结构化输出：善于组织信息，输出结构清晰。
5. 学术严谨：引用准确，逻辑严密。

输出规范：
- 复杂任务分解为多个步骤
- 使用结构化格式（表格、列表、树形）
- 中文表达准确、专业`,
    description: "GLM 旗舰版，综合能力均衡且强大。适合复杂多步骤任务、学术研究、深度分析。",
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
      content: `[GLM-5.2 生成结果] 任务: ${task.description}`,
      durationMs: Date.now() - start,
      tokensUsed: 0,
    };
  }

  canHandle(task: TaskDescription): boolean {
    return this.profile.bestFor.includes(task.type);
  }

  getMatchScore(task: TaskDescription): number {
    if (!this.canHandle(task)) return 0.3;
    let score = 0.65;
    if (task.requiresLongContext) score += 0.1;
    if (task.requiresEngineering) score += 0.1;
    if (task.requiresArchitecture) score += 0.1;
    return Math.min(score, 1);
  }
}
