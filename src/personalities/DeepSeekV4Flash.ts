/**
 * DeepSeekV4Flash.ts — DeepSeek V4 Flash 分身
 *
 * 定位：极速推理，实时任务与批量处理
 * 厂商：深度求索 / DeepSeek
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

export class DeepSeekV4Flash implements IPersonality {
  private profile: PersonalityProfile = {
    id: "deepseek-v4-flash",
    name: "DeepSeek-V4-Flash",
    vendor: "深度求索",
    version: "V4-Flash",
    icon: "eye",
    capabilities: {
      codeGeneration: 7,
      engineering: 5,
      algorithmDepth: 7,
      architecture: 6,
      simplicity: 7,
      performance: 8,
      longContext: 7,
      multimodal: 5,
      chinese: 7,
      multilingual: 7,
    },
    style: {
      codeLength: "short",
      commentStyle: CodeStyle.Minimal,
      designPatterns: [DesignPattern.None],
      dataStructures: ["array", "Map", "Set"],
      exportFormats: ["json"],
      namingConvention: "snake_case",
    },
    bestFor: [
      TaskType.QuickTask,
      TaskType.CodeGeneration,
      TaskType.Math,
      TaskType.Debugging,
      TaskType.DataAnalysis,
    ],
    weaknesses: [
      TaskType.Architecture,
      TaskType.CreativeWriting,
      TaskType.Documentation,
    ],
    languages: ["Python", "TypeScript", "JavaScript", "Go", "Java"],
    contextWindow: 64000,
    maxToolCalls: 50,
    speedRating: 5,
    costRating: 1,
    systemPrompt: `你是 DeepSeek V4 Flash，一个极速推理的 AI 助手。

核心原则：
1. 极速响应：毫秒级输出，优先速度。
2. 算法直觉：即使快速回答，也要给出算法上正确的方案。
3. 批量友好：适合处理大量简单任务。
4. 准确优先：宁可慢一点也要保证正确。

输出规范：
- 代码简洁紧凑
- 关键算法附复杂度注释
- 直接给结果，少废话`,
    description: "DeepSeek 极速版，推理速度极快。适合实时任务、批量处理、快速调试等场景。",
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
      content: `[DeepSeek V4 Flash 生成结果] 任务: ${task.description}`,
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
    if (task.requiresAlgorithm) score += 0.1;
    if (task.latencyTolerance && task.latencyTolerance <= 2) score += 0.2;
    if (task.maxCost && task.maxCost <= 2) score += 0.1;
    return Math.min(score, 1);
  }
}
