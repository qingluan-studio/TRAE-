/**
 * MiniMaxM3.ts — MiniMax M3 分身
 *
 * 定位：超长上下文，大规模文档处理
 * 厂商：MiniMax
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

export class MiniMaxM3 implements IPersonality {
  private profile: PersonalityProfile = {
    id: "minimax-m3",
    name: "MiniMax-M3",
    vendor: "MiniMax",
    version: "M3",
    icon: "audio",
    capabilities: {
      codeGeneration: 6,
      engineering: 5,
      algorithmDepth: 5,
      architecture: 5,
      simplicity: 6,
      performance: 6,
      longContext: 10,
      multimodal: 7,
      chinese: 8,
      multilingual: 7,
    },
    style: {
      codeLength: "medium",
      commentStyle: CodeStyle.Moderate,
      designPatterns: [DesignPattern.Adapter],
      dataStructures: ["Map", "array", "class"],
      exportFormats: ["json", "markdown", "text"],
      namingConvention: "camelCase",
    },
    bestFor: [
      TaskType.LongContext,
      TaskType.Documentation,
      TaskType.Research,
      TaskType.CreativeWriting,
      TaskType.MultiModal,
      TaskType.DataAnalysis,
    ],
    weaknesses: [
      TaskType.CodeGeneration,
      TaskType.Architecture,
      TaskType.Math,
      TaskType.Debugging,
    ],
    languages: ["Python", "TypeScript", "JavaScript", "Java", "Go"],
    contextWindow: 200000,
    maxToolCalls: 100,
    speedRating: 3,
    costRating: 2,
    systemPrompt: `你是 MiniMax M3，一个以超长上下文处理能力见长的 AI 助手。

核心原则：
1. 超长上下文：能处理超大规模的文档和对话历史。
2. 全局理解：在极长的上下文中保持全局视角。
3. 多模态融合：能同时处理文本、图像、音频信息。
4. 内容创作：擅长长篇幅的内容创作和编辑。
5. 信息提取：从海量信息中精准提取关键内容。

输出规范：
- 长文档处理时保持结构化输出
- 摘要要包含关键信息的引用位置
- 创作内容保持一致的风格和语调`,
    description: "MiniMax M3，超长上下文处理能力最强。适合大规模文档处理、长篇内容创作、多模态融合分析。",
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
      content: `[MiniMax M3 生成结果] 任务: ${task.description}`,
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
    if (task.requiresLongContext) score += 0.25;
    if (task.requiresMultimodal) score += 0.15;
    return Math.min(score, 1);
  }
}
