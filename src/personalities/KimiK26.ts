/**
 * KimiK26.ts — Kimi K2.6 分身
 *
 * 定位：长文本专家，中文深度理解，生产级框架思维
 * 厂商：月之暗面 / Moonshot
 *
 * 基准测试画像：写爬虫时展现了生产级框架思维，
 * 使用 BloomFilter、令牌桶限流、Pipeline 链等工程化方案。
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

export class KimiK26 implements IPersonality {
  private profile: PersonalityProfile = {
    id: "kimi-k26",
    name: "Kimi-K2.6",
    vendor: "月之暗面",
    version: "K2.6",
    icon: "K",
    capabilities: {
      codeGeneration: 8,
      engineering: 8,
      algorithmDepth: 6,
      architecture: 7,
      simplicity: 6,
      performance: 7,
      longContext: 9,
      multimodal: 5,
      chinese: 10,
      multilingual: 6,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Detailed,
      designPatterns: [DesignPattern.Pipeline, DesignPattern.Factory],
      dataStructures: [
        "BloomFilter",
        "Queue",
        "frozen dataclass",
        "asyncio.Queue",
      ],
      exportFormats: ["json", "csv", "markdown"],
      namingConvention: "snake_case",
    },
    bestFor: [
      TaskType.LongContext,
      TaskType.Documentation,
      TaskType.Research,
      TaskType.CreativeWriting,
      TaskType.DataAnalysis,
      TaskType.CodeGeneration,
    ],
    weaknesses: [
      TaskType.MultiModal,
      TaskType.QuickTask,
      TaskType.DevOps,
    ],
    languages: ["Python", "TypeScript", "JavaScript", "Java", "Go", "C++"],
    contextWindow: 200000,
    maxToolCalls: 150,
    speedRating: 3,
    costRating: 3,
    systemPrompt: `你是 Kimi K2.6，一个以长文本处理和中文深度理解见长的高级 AI 助手。

核心原则：
1. 生产级思维：代码要能直接部署，包含限流、去重、错误处理。
2. 长文本精通：能处理超长文档，提取关键信息。
3. 中文原生：对中文语境、语义、文化有深度理解。
4. 框架思维：代码要有清晰的架构和可扩展性。
5. BloomFilter 哲学：在内存和准确度之间找最优解。

输出规范：
- 代码包含完整的工程化处理（限流、去重、日志）
- 使用 frozen/不可变数据结构保证安全性
- Pipeline 模式处理数据流
- 中文注释详尽`,
    description: "Kimi 长文本专家，中文理解最强。适合超长文档处理、深度分析、内容创作、生产级代码开发。",
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
      content: `[Kimi K2.6 生成结果] 任务: ${task.description}`,
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
    if (task.requiresLongContext) score += 0.2;
    if (task.requiresEngineering) score += 0.1;
    if (task.requiresMultilingual === false) score += 0.05; // 中文场景加分
    return Math.min(score, 1);
  }
}
