/**
 * Qwen37Plus.ts — Qwen3.7 Plus 分身
 *
 * 定位：模块化架构大师，设计模式丰富，企业级应用
 * 厂商：阿里云 / Qwen
 *
 * 基准测试画像：写爬虫时展现了极强的架构师思维，
 * 使用中间件链、策略模式、责任链、优先级队列、ABC 抽象基类等。
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

export class Qwen37Plus implements IPersonality {
  private profile: PersonalityProfile = {
    id: "qwen-37-plus",
    name: "Qwen3.7-Plus",
    vendor: "阿里云",
    version: "3.7-Plus",
    icon: "sparkle",
    capabilities: {
      codeGeneration: 8,
      engineering: 9,
      algorithmDepth: 7,
      architecture: 9,
      simplicity: 4,
      performance: 7,
      longContext: 8,
      multimodal: 5,
      chinese: 8,
      multilingual: 9,
    },
    style: {
      codeLength: "long",
      commentStyle: CodeStyle.Detailed,
      designPatterns: [
        DesignPattern.Strategy,
        DesignPattern.ChainOfResponsibility,
        DesignPattern.Middleware,
        DesignPattern.Factory,
        DesignPattern.Adapter,
      ],
      dataStructures: [
        "PriorityQueue",
        "Enum",
        "ABC abstract class",
        "Protocol",
        "interface",
        "dataclass",
      ],
      exportFormats: ["json", "csv", "ndjson", "yaml", "markdown"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.Architecture,
      TaskType.CodeGeneration,
      TaskType.Refactoring,
      TaskType.Documentation,
      TaskType.DataAnalysis,
      TaskType.DevOps,
      TaskType.Translation,
    ],
    weaknesses: [
      TaskType.QuickTask,
      TaskType.MultiModal,
      TaskType.CreativeWriting,
    ],
    languages: [
      "TypeScript", "JavaScript", "Python", "Go", "Java",
      "Rust", "C++", "Kotlin", "Scala", "Ruby",
    ],
    contextWindow: 128000,
    maxToolCalls: 150,
    speedRating: 3,
    costRating: 3,
    systemPrompt: `你是 Qwen3.7 Plus，一个以模块化架构和设计模式见长的高级 AI 架构师。

核心原则：
1. 架构优先：先设计架构，再编写实现。
2. 设计模式丰富：根据场景选择最合适的设计模式。
3. 中间件思维：通过中间件链解耦核心逻辑与横切关注点。
4. 接口抽象：使用 ABC/Protocol 定义清晰的契约。
5. 链式 API：支持 fluent API 风格，提升使用体验。
6. 多语言支持：对国际化场景有天然优势。

输出规范：
- 复杂系统先画架构图/流程图
- 使用抽象基类/接口定义契约
- 中间件/插件/策略模式实现扩展点
- 枚举类型替代魔法字符串
- 详细的模块级 docstring`,
    description: "Qwen 旗舰版，架构师思维，设计模式最丰富。适合企业级应用、高度定制化系统、国际化项目。",
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
      content: `[Qwen3.7 Plus 生成结果] 任务: ${task.description}`,
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
    if (task.requiresArchitecture) score += 0.2;
    if (task.requiresEngineering) score += 0.15;
    if (task.requiresMultilingual) score += 0.1;
    return Math.min(score, 1);
  }
}
