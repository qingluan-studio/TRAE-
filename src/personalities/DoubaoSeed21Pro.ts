/**
 * DoubaoSeed21Pro.ts — 豆包 Seed 2.1 Pro 分身
 *
 * 定位：综合推理旗舰，复杂分析+方案设计
 * 厂商：字节跳动 / Doubao
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

export class DoubaoSeed21Pro implements IPersonality {
  private profile: PersonalityProfile = {
    id: "doubao-seed-21-pro",
    name: "豆包 Seed 2.1 Pro",
    vendor: "字节跳动",
    version: "Seed-2.1-Pro",
    icon: "chip",
    capabilities: {
      codeGeneration: 8,
      engineering: 8,
      algorithmDepth: 7,
      architecture: 8,
      simplicity: 6,
      performance: 7,
      longContext: 8,
      multimodal: 5,
      chinese: 9,
      multilingual: 7,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Detailed,
      designPatterns: [DesignPattern.Factory, DesignPattern.Adapter],
      dataStructures: ["interface", "class", "Map", "enum"],
      exportFormats: ["typescript", "json", "markdown"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.CodeGeneration,
      TaskType.Architecture,
      TaskType.CodeReview,
      TaskType.Documentation,
      TaskType.DataAnalysis,
      TaskType.LongContext,
    ],
    weaknesses: [
      TaskType.MultiModal,
      TaskType.QuickTask,
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Go", "Java", "Rust", "C++", "Kotlin"],
    contextWindow: 128000,
    maxToolCalls: 150,
    speedRating: 3,
    costRating: 3,
    systemPrompt: `你是豆包 Seed 2.1 Pro，一个综合推理能力极强的高级 AI 助手。

核心原则：
1. 深度思考：面对复杂问题时，先分析再行动，给出结构化的解决方案。
2. 全面考量：从性能、可维护性、扩展性、安全性等多维度评估方案。
3. 架构思维：代码设计要考虑长远，接口定义要清晰。
4. 文档先行：关键决策要有文档记录，代码注释要完整。
5. 优雅降级：复杂功能要有简化版本作为后备。

输出规范：
- 复杂任务先输出方案设计，再给出代码
- 代码包含完整的类型定义和错误处理
- 架构决策附带理由说明`,
    description: "豆包旗舰版，综合推理能力最强。适合复杂分析、架构设计、长文档处理等需要深度思考的任务。",
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
      content: `[豆包 Seed 2.1 Pro 生成结果] 任务: ${task.description}`,
      durationMs: Date.now() - start,
      tokensUsed: 0,
    };
  }

  canHandle(task: TaskDescription): boolean {
    return this.profile.bestFor.includes(task.type);
  }

  getMatchScore(task: TaskDescription): number {
    if (!this.canHandle(task)) return 0.3;
    let score = 0.7;
    if (task.requiresArchitecture) score += 0.15;
    if (task.requiresEngineering) score += 0.1;
    if (task.requiresLongContext) score += 0.1;
    return Math.min(score, 1);
  }
}
