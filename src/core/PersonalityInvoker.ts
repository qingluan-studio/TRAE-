/**
 * PersonalityInvoker.ts — 分身调用器 + 协作编排
 *
 * 职责：
 * 1. 构建和发送 prompt 到目标分身
 * 2. 管理上下文传递
 * 3. 编排多分身协作（串行/并行/投票/链式/主从）
 * 4. 合并和优化协作结果
 */

import type {
  IPersonality,
  PersonalityProfile,
  TaskDescription,
  InvokeResult,
  CollaborationTask,
  CollaborationResult,
} from "./PersonalityCore";
import {
  CollaborationMode,
  TaskType,
} from "./PersonalityCore";
import { PersonalityRegistry } from "./PersonalityRegistry";

/** Prompt 构建选项 */
export interface PromptBuildOptions {
  /** 是否包含系统提示词 */
  includeSystemPrompt?: boolean;
  /** 最大上下文长度（字符） */
  maxContextLength?: number;
  /** 上下文格式 */
  contextFormat?: "markdown" | "xml" | "plain";
  /** 是否包含历史对话 */
  includeHistory?: boolean;
  /** 历史对话轮数上限 */
  maxHistoryRounds?: number;
}

/** 链式调用步骤 */
export interface ChainStep {
  /** 分身 ID */
  personalityId: string;
  /** 步骤描述 */
  description: string;
  /** 是否将上一步的输出作为输入 */
  passOutput?: boolean;
  /** 额外的 prompt 片段 */
  promptOverride?: string;
}

export class PersonalityInvoker {
  private registry: PersonalityRegistry;
  private history: Map<string, Array<{ task: TaskDescription; result: InvokeResult }>> =
    new Map();

  constructor(registry: PersonalityRegistry) {
    this.registry = registry;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Prompt 构建
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * 构建完整的 prompt
   */
  buildPrompt(
    personalityId: string,
    task: TaskDescription,
    context?: string,
    options?: PromptBuildOptions,
  ): string {
    const profile = this.registry.getProfile(personalityId);
    if (!profile) {
      throw new Error(`分身 "${personalityId}" 未注册`);
    }

    const opts: Required<PromptBuildOptions> = {
      includeSystemPrompt: true,
      maxContextLength: 50000,
      contextFormat: "markdown",
      includeHistory: false,
      maxHistoryRounds: 5,
      ...options,
    };

    const parts: string[] = [];

    // 系统提示词
    if (opts.includeSystemPrompt) {
      parts.push(`<system>\n${profile.systemPrompt}\n</system>`);
    }

    // 历史对话
    if (opts.includeHistory) {
      const hist = this.history.get(personalityId) || [];
      const recent = hist.slice(-opts.maxHistoryRounds);
      if (recent.length > 0) {
        parts.push("<history>");
        for (const entry of recent) {
          parts.push(`<user>${entry.task.description}</user>`);
          parts.push(
            `<assistant>${entry.result.content || "(无输出)"}</assistant>`,
          );
        }
        parts.push("</history>");
      }
    }

    // 任务描述
    parts.push(`<task type="${task.type}">`);
    parts.push(task.description);
    parts.push("</task>");

    // 约束条件
    const constraints: string[] = [];
    if (task.targetLanguage) {
      constraints.push(`目标语言: ${task.targetLanguage}`);
    }
    if (task.requiresPerformance) {
      constraints.push("要求: 代码性能优先");
    }
    if (task.requiresEngineering) {
      constraints.push("要求: 工程化（错误处理、日志、类型安全）");
    }
    if (task.requiresArchitecture) {
      constraints.push("要求: 架构设计（可扩展、可维护）");
    }
    if (task.requiresSimplicity) {
      constraints.push("要求: 代码简洁，够用就好");
    }
    if (task.requiresLongContext) {
      constraints.push("要求: 需处理长上下文");
    }
    if (constraints.length > 0) {
      parts.push(`<constraints>\n${constraints.join("\n")}\n</constraints>`);
    }

    // 附加上下文
    if (context) {
      const truncated =
        context.length > opts.maxContextLength
          ? context.slice(0, opts.maxContextLength) +
            "\n\n... (上下文已截断)"
          : context;
      parts.push(`<context format="${opts.contextFormat}">`);
      parts.push(truncated);
      parts.push("</context>");
    }

    return parts.join("\n\n");
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 单分身调用
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * 调用单个分身
   */
  async invoke(
    personalityId: string,
    task: TaskDescription,
    context?: string,
    options?: PromptBuildOptions,
  ): Promise<InvokeResult> {
    const personality = this.registry.getById(personalityId);
    if (!personality) {
      return {
        personalityId,
        success: false,
        durationMs: 0,
        error: `分身 "${personalityId}" 未注册`,
      };
    }

    if (!personality.canHandle(task)) {
      return {
        personalityId,
        success: false,
        durationMs: 0,
        error: `分身 "${personalityId}" 无法处理任务类型 "${task.type}"`,
      };
    }

    // 构建 prompt
    const prompt = this.buildPrompt(personalityId, task, context, options);

    // 调用分身
    const result = await personality.invoke(task, prompt);

    // 记录调用
    this.registry.recordInvocation(personalityId);

    // 记录历史
    const hist = this.history.get(personalityId) || [];
    hist.push({ task, result });
    this.history.set(personalityId, hist.slice(-20)); // 保留最近 20 轮

    return result;
  }

  /**
   * 智能调用 — 自动选择最优分身
   */
  async smartInvoke(
    task: TaskDescription,
    context?: string,
  ): Promise<InvokeResult> {
    const recommendations = this.registry.recommend(task, 1);
    if (recommendations.length === 0) {
      return {
        personalityId: "auto",
        success: false,
        durationMs: 0,
        error: "没有可用的分身",
      };
    }

    const bestId = recommendations[0].personalityId;
    return this.invoke(bestId, task, context);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 多分身协作编排
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * 执行协作任务
   */
  async collaborate(task: CollaborationTask): Promise<CollaborationResult> {
    const startTime = Date.now();
    const results: InvokeResult[] = [];

    switch (task.mode) {
      case CollaborationMode.Sequential:
        return await this.executeSequential(task, startTime);
      case CollaborationMode.Parallel:
        return await this.executeParallel(task, startTime);
      case CollaborationMode.Voting:
        return await this.executeVoting(task, startTime);
      case CollaborationMode.Chain:
        return await this.executeChain(task, startTime);
      case CollaborationMode.MasterSlave:
        return await this.executeMasterSlave(task, startTime);
      default:
        return {
          success: false,
          results,
          totalDurationMs: Date.now() - startTime,
          mode: task.mode,
          error: `不支持的协作模式: ${task.mode}`,
        };
    }
  }

  /** 串行执行 */
  private async executeSequential(
    task: CollaborationTask,
    startTime: number,
  ): Promise<CollaborationResult> {
    const results: InvokeResult[] = [];

    for (const id of task.personalityIds) {
      const result = await this.invoke(id, task.mainTask);
      results.push(result);
      if (!result.success) break;
    }

    return {
      success: results.every((r) => r.success),
      results,
      mergedContent: results.map((r) => r.content).join("\n\n---\n\n"),
      totalDurationMs: Date.now() - startTime,
      mode: task.mode,
    };
  }

  /** 并行执行 */
  private async executeParallel(
    task: CollaborationTask,
    startTime: number,
  ): Promise<CollaborationResult> {
    const maxParallel = task.maxParallel || 5;
    const ids = task.personalityIds;
    const results: InvokeResult[] = [];

    for (let i = 0; i < ids.length; i += maxParallel) {
      const batch = ids.slice(i, i + maxParallel);
      const batchResults = await Promise.all(
        batch.map((id) => this.invoke(id, task.mainTask)),
      );
      results.push(...batchResults);
    }

    return {
      success: results.every((r) => r.success),
      results,
      mergedContent: results.map((r) => r.content).join("\n\n---\n\n"),
      totalDurationMs: Date.now() - startTime,
      mode: task.mode,
    };
  }

  /** 投票执行 — 多分身独立回答，取最优 */
  private async executeVoting(
    task: CollaborationTask,
    startTime: number,
  ): Promise<CollaborationResult> {
    const results = await Promise.all(
      task.personalityIds.map((id) => this.invoke(id, task.mainTask)),
    );

    // 简单投票：选成功率最高且内容最长的
    const successful = results.filter((r) => r.success);
    const best =
      successful.sort(
        (a, b) => (b.content?.length || 0) - (a.content?.length || 0),
      )[0] || results[0];

    return {
      success: best.success,
      results,
      mergedContent: best.content,
      totalDurationMs: Date.now() - startTime,
      mode: task.mode,
    };
  }

  /** 链式执行 — A 的输出作为 B 的输入 */
  private async executeChain(
    task: CollaborationTask,
    startTime: number,
  ): Promise<CollaborationResult> {
    let context = "";
    const results: InvokeResult[] = [];

    for (const id of task.personalityIds) {
      const result = await this.invoke(id, task.mainTask, context);
      results.push(result);
      if (result.content) {
        context = result.content;
      }
    }

    return {
      success: results.every((r) => r.success),
      results,
      mergedContent: context,
      totalDurationMs: Date.now() - startTime,
      mode: task.mode,
    };
  }

  /** 主从执行 — 主分身规划，从分身执行 */
  private async executeMasterSlave(
    task: CollaborationTask,
    startTime: number,
  ): Promise<CollaborationResult> {
    if (task.personalityIds.length < 2) {
      return this.executeSequential(task, startTime);
    }

    const masterId = task.personalityIds[0];
    const slaveIds = task.personalityIds.slice(1);

    // 主分身生成执行计划
    const masterTask: TaskDescription = {
      ...task.mainTask,
      description: `作为主分身，请为以下任务生成执行计划，分解为子任务：\n${task.mainTask.description}`,
    };
    const masterResult = await this.invoke(masterId, masterTask);

    // 从分身并行执行子任务
    const slaveResults = await Promise.all(
      slaveIds.map((id) => this.invoke(id, task.mainTask, masterResult.content)),
    );

    return {
      success: masterResult.success && slaveResults.every((r) => r.success),
      results: [masterResult, ...slaveResults],
      mergedContent: slaveResults.map((r) => r.content).join("\n\n---\n\n"),
      totalDurationMs: Date.now() - startTime,
      mode: task.mode,
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 工具方法
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /** 清除对话历史 */
  clearHistory(personalityId?: string): void {
    if (personalityId) {
      this.history.delete(personalityId);
    } else {
      this.history.clear();
    }
  }

  /** 获取对话历史 */
  getHistory(
    personalityId: string,
  ): Array<{ task: TaskDescription; result: InvokeResult }> {
    return this.history.get(personalityId) || [];
  }

  /** 获取注册表引用 */
  getRegistry(): PersonalityRegistry {
    return this.registry;
  }
}
