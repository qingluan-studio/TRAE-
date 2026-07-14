/**
 * DoubaoSeedCode.ts — 豆包 Seed Code 分身
 *
 * 定位：代码专精，快速生成高质量代码
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

export class DoubaoSeedCode implements IPersonality {
  private profile: PersonalityProfile = {
    id: "doubao-seed-code",
    name: "豆包 Seed Code",
    vendor: "字节跳动",
    version: "Seed-2.1-Code",
    icon: "chip",
    capabilities: {
      codeGeneration: 9,
      engineering: 7,
      algorithmDepth: 6,
      architecture: 6,
      simplicity: 7,
      performance: 7,
      longContext: 7,
      multimodal: 3,
      chinese: 8,
      multilingual: 7,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Moderate,
      designPatterns: [DesignPattern.Factory],
      dataStructures: ["Map", "Set", "interface", "class"],
      exportFormats: ["typescript", "json"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.CodeGeneration,
      TaskType.CodeReview,
      TaskType.Refactoring,
      TaskType.Debugging,
      TaskType.Testing,
    ],
    weaknesses: [
      TaskType.MultiModal,
      TaskType.LongContext,
      TaskType.CreativeWriting,
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Go", "Java", "Rust", "C++"],
    contextWindow: 128000,
    maxToolCalls: 100,
    speedRating: 4,
    costRating: 2,
    systemPrompt: `你是豆包 Seed Code，一个专注于代码生成的高级 AI 助手。

核心原则：
1. 代码优先：先写代码，再解释。代码要可直接运行。
2. 类型安全：优先使用 TypeScript，严格类型标注。
3. 最佳实践：遵循 SOLID 原则，代码结构清晰。
4. 简洁高效：避免过度工程，用最少的代码实现需求。
5. 错误处理：完善的 try/catch 和边界条件处理。

输出规范：
- 代码要有完整的类型定义
- 包含基本的错误处理
- 关键逻辑附注释
- 提供使用示例`,
    description: "豆包代码专精版，擅长快速生成高质量、类型安全的代码。适合编码、代码审查、调试等纯代码任务。",
  };

  getProfile(): PersonalityProfile {
    return this.profile;
  }

  async invoke(
    task: TaskDescription,
    context?: string,
  ): Promise<InvokeResult> {
    const start = Date.now();
    // 实际实现需对接豆包 API
    return {
      personalityId: this.profile.id,
      success: true,
      content: `[豆包 Seed Code 生成结果] 任务: ${task.description}`,
      durationMs: Date.now() - start,
      tokensUsed: 0,
    };
  }

  canHandle(task: TaskDescription): boolean {
    return this.profile.bestFor.includes(task.type);
  }

  getMatchScore(task: TaskDescription): number {
    if (!this.canHandle(task)) return 0.2;
    let score = 0.7;
    if (task.requiresPerformance) score += 0.1;
    if (task.requiresSimplicity) score += 0.05;
    if (task.targetLanguage && this.profile.languages.includes(task.targetLanguage)) {
      score += 0.1;
    }
    return Math.min(score, 1);
  }
}
