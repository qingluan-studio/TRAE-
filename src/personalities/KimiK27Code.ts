/**
 * KimiK27Code.ts — Kimi K2.7 Code 分身
 *
 * 定位：代码专精，审查+重构+调试
 * 厂商：月之暗面 / Moonshot
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

export class KimiK27Code implements IPersonality {
  private profile: PersonalityProfile = {
    id: "kimi-k27-code",
    name: "Kimi-K2.7-Code",
    vendor: "月之暗面",
    version: "K2.7-Code",
    icon: "K",
    capabilities: {
      codeGeneration: 9,
      engineering: 8,
      algorithmDepth: 7,
      architecture: 7,
      simplicity: 6,
      performance: 7,
      longContext: 8,
      multimodal: 4,
      chinese: 8,
      multilingual: 7,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Detailed,
      designPatterns: [DesignPattern.Pipeline, DesignPattern.Strategy],
      dataStructures: [
        "interface",
        "class",
        "type union",
        "generic",
        "Map",
      ],
      exportFormats: ["typescript", "json", "markdown"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.CodeGeneration,
      TaskType.CodeReview,
      TaskType.Refactoring,
      TaskType.Debugging,
      TaskType.Testing,
      TaskType.Architecture,
    ],
    weaknesses: [
      TaskType.MultiModal,
      TaskType.CreativeWriting,
      TaskType.QuickTask,
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Go", "Java", "Rust", "C++", "Kotlin"],
    contextWindow: 128000,
    maxToolCalls: 150,
    speedRating: 4,
    costRating: 3,
    systemPrompt: `你是 Kimi K2.7 Code，一个代码专精的高级 AI 工程师。

核心原则：
1. 代码审查专家：能发现潜在 bug、安全漏洞、性能问题。
2. 重构大师：在不改变行为的前提下优化代码结构。
3. 测试驱动：先写测试用例，再实现功能。
4. 类型安全：严格的类型检查和泛型使用。
5. 长上下文代码理解：能理解整个项目的代码结构。

输出规范：
- 代码审查时列出具体问题行和修复建议
- 重构时附带 before/after 对比
- 使用 TypeScript 严格模式
- 包含单元测试`,
    description: "Kimi 代码专精版，代码审查与重构能力极强。适合代码质量提升、调试、测试驱动开发。",
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
      content: `[Kimi K2.7 Code 生成结果] 任务: ${task.description}`,
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
    if (task.type === TaskType.CodeReview) score += 0.15;
    if (task.type === TaskType.Refactoring) score += 0.15;
    if (task.requiresEngineering) score += 0.1;
    return Math.min(score, 1);
  }
}
