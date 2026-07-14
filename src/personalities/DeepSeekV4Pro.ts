/**
 * DeepSeekV4Pro.ts — DeepSeek V4 Pro 分身
 *
 * 定位：算法极致、类型安全、性能优先
 * 厂商：深度求索 / DeepSeek
 *
 * 基准测试画像：写爬虫时展现了极致的算法优化思维，
 * 使用 __slots__、LRU 缓存、BLAKE2b 哈希、orjson 等高性能方案。
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

export class DeepSeekV4Pro implements IPersonality {
  private profile: PersonalityProfile = {
    id: "deepseek-v4-pro",
    name: "DeepSeek-V4-Pro",
    vendor: "深度求索",
    version: "V4-Pro",
    icon: "eye",
    capabilities: {
      codeGeneration: 9,
      engineering: 7,
      algorithmDepth: 9,
      architecture: 8,
      simplicity: 5,
      performance: 9,
      longContext: 8,
      multimodal: 6,
      chinese: 8,
      multilingual: 8,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Moderate,
      designPatterns: [DesignPattern.Protocol, DesignPattern.Factory],
      dataStructures: [
        "NamedTuple",
        "__slots__ dataclass",
        "OrderedDict",
        "Protocol",
        "frozenset",
      ],
      exportFormats: ["orjson", "msgpack", "binary"],
      namingConvention: "snake_case",
    },
    bestFor: [
      TaskType.CodeGeneration,
      TaskType.AlgorithmDepth !== undefined ? TaskType.CodeGeneration : TaskType.Math,
      TaskType.Math,
      TaskType.Architecture,
      TaskType.Performance !== undefined ? TaskType.CodeGeneration : TaskType.Debugging,
      TaskType.Debugging,
      TaskType.Refactoring,
    ],
    weaknesses: [
      TaskType.CreativeWriting,
      TaskType.QuickTask,
      TaskType.Documentation,
    ],
    languages: ["Python", "TypeScript", "Rust", "C++", "Go", "Java", "Julia"],
    contextWindow: 128000,
    maxToolCalls: 150,
    speedRating: 3,
    costRating: 3,
    systemPrompt: `你是 DeepSeek V4 Pro，一个以算法极致优化为核心的 AI 工程师。

核心原则：
1. 性能至上：每个决策都要考虑时间复杂度和空间复杂度。
2. 类型安全：使用 Protocol、NamedTuple、__slots__ 等保证类型和内存安全。
3. 算法思维：面对问题，先思考最优算法，再实现。
4. 内存优化：使用 LRU 缓存、BloomFilter 等控制内存占用。
5. 极致工具：选择最快的库（orjson > json, blake2b > sha256）。

输出规范：
- 优先使用高性能数据结构（NamedTuple, __slots__）
- 注释说明算法复杂度
- 包含性能关键的基准测试提示`,
    description: "DeepSeek 旗舰版，算法工程师思维。适合数学推理、算法优化、性能敏感的大规模系统开发。",
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
      content: `[DeepSeek V4 Pro 生成结果] 任务: ${task.description}`,
      durationMs: Date.now() - start,
      tokensUsed: 0,
    };
  }

  canHandle(task: TaskDescription): boolean {
    const codingTasks = [
      TaskType.CodeGeneration, TaskType.Math, TaskType.Architecture,
      TaskType.Debugging, TaskType.Refactoring,
    ];
    return codingTasks.includes(task.type);
  }

  getMatchScore(task: TaskDescription): number {
    if (!this.canHandle(task)) return 0.2;
    let score = 0.7;
    if (task.requiresAlgorithm) score += 0.2;
    if (task.requiresPerformance) score += 0.15;
    if (task.requiresArchitecture) score += 0.1;
    return Math.min(score, 1);
  }
}
