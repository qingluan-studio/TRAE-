/**
 * DoubaoSeed21Turbo.ts — 豆包 Seed 2.1 Turbo 分身
 *
 * 定位：极速响应，简单任务高效处理
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

export class DoubaoSeed21Turbo implements IPersonality {
  private profile: PersonalityProfile = {
    id: "doubao-seed-21-turbo",
    name: "豆包 Seed 2.1 Turbo",
    vendor: "字节跳动",
    version: "Seed-2.1-Turbo",
    icon: "chip",
    capabilities: {
      codeGeneration: 6,
      engineering: 5,
      algorithmDepth: 5,
      architecture: 5,
      simplicity: 8,
      performance: 8,
      longContext: 6,
      multimodal: 3,
      chinese: 8,
      multilingual: 6,
    },
    style: {
      codeLength: "short",
      commentStyle: CodeStyle.Minimal,
      designPatterns: [DesignPattern.None],
      dataStructures: ["array", "object", "Map"],
      exportFormats: ["json"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.QuickTask,
      TaskType.CodeGeneration,
      TaskType.Documentation,
      TaskType.Translation,
    ],
    weaknesses: [
      TaskType.Architecture,
      TaskType.MultiModal,
      TaskType.Math,
      TaskType.AlgorithmDepth !== undefined ? TaskType.CodeGeneration : TaskType.CodeGeneration,
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Go", "Java"],
    contextWindow: 64000,
    maxToolCalls: 50,
    speedRating: 5,
    costRating: 1,
    systemPrompt: `你是豆包 Seed 2.1 Turbo，一个极速响应的 AI 助手。

核心原则：
1. 速度优先：用最短的时间给出正确答案。
2. 简洁直接：不啰嗦，直接给结果。
3. 够用就好：不过度设计，满足需求即可。
4. 快速迭代：如果第一次不够好，可以快速调整。

输出规范：
- 直接给出代码或答案，少解释
- 代码保持最小化
- 不需要过度错误处理`,
    description: "豆包极速版，响应最快、成本最低。适合简单任务、快速查询、批量处理等对速度敏感的场景。",
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
      content: `[豆包 Seed 2.1 Turbo 生成结果] 任务: ${task.description}`,
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
    if (task.requiresSimplicity) score += 0.2;
    if (task.latencyTolerance && task.latencyTolerance <= 2) score += 0.15;
    if (task.maxCost && task.maxCost <= 2) score += 0.1;
    return Math.min(score, 1);
  }
}
