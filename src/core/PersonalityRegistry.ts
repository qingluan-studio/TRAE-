/**
 * PersonalityRegistry.ts — 分身注册表 + 智能推荐算法
 *
 * 职责：
 * 1. 管理所有已注册的 AI 分身
 * 2. 根据任务描述智能推荐最优分身（或组合）
 * 3. 支持按能力、厂商、任务类型等维度查询
 * 4. 维护分身使用统计（用于推荐优化）
 */

import type {
  IPersonality,
  PersonalityProfile,
  TaskDescription,
} from "./PersonalityCore";
import {
  capabilitySimilarity,
  idealCapabilityForTask,
  CollaborationMode,
  TaskType,
} from "./PersonalityCore";

/** 推荐结果 */
export interface Recommendation {
  /** 推荐的分身 ID */
  personalityId: string;
  /** 匹配度评分（0-1） */
  score: number;
  /** 推荐理由 */
  reason: string;
}

/** 注册表统计 */
export interface RegistryStats {
  /** 已注册分身数 */
  totalPersonalities: number;
  /** 按厂商分组的分身数 */
  byVendor: Record<string, number>;
  /** 总调用次数 */
  totalInvocations: number;
  /** 按分身的调用次数 */
  invocationsById: Record<string, number>;
}

export class PersonalityRegistry {
  private personalities: Map<string, IPersonality> = new Map();
  private invocationCounts: Map<string, number> = new Map();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 注册管理
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /** 注册一个分身 */
  register(personality: IPersonality): void {
    const profile = personality.getProfile();
    if (this.personalities.has(profile.id)) {
      console.warn(`[Registry] 分身 "${profile.id}" 已存在，将被覆盖`);
    }
    this.personalities.set(profile.id, personality);
    if (!this.invocationCounts.has(profile.id)) {
      this.invocationCounts.set(profile.id, 0);
    }
  }

  /** 批量注册 */
  registerAll(personalities: IPersonality[]): void {
    for (const p of personalities) {
      this.register(p);
    }
  }

  /** 注销一个分身 */
  unregister(id: string): boolean {
    this.invocationCounts.delete(id);
    return this.personalities.delete(id);
  }

  /** 记录一次调用 */
  recordInvocation(id: string): void {
    const count = this.invocationCounts.get(id) || 0;
    this.invocationCounts.set(id, count + 1);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 查询
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /** 获取所有已注册分身 */
  getAll(): IPersonality[] {
    return Array.from(this.personalities.values());
  }

  /** 按 ID 获取分身 */
  getById(id: string): IPersonality | undefined {
    return this.personalities.get(id);
  }

  /** 获取分身画像 */
  getProfile(id: string): PersonalityProfile | undefined {
    return this.personalities.get(id)?.getProfile();
  }

  /** 按厂商获取分身 */
  getByVendor(vendor: string): IPersonality[] {
    return this.getAll().filter(
      (p) => p.getProfile().vendor === vendor,
    );
  }

  /** 按任务类型获取能处理的分身 */
  getByTaskType(type: TaskType): IPersonality[] {
    return this.getAll().filter((p) =>
      p.getProfile().bestFor.includes(type),
    );
  }

  /** 获取注册表统计 */
  getStats(): RegistryStats {
    const byVendor: Record<string, number> = {};
    for (const p of this.getAll()) {
      const vendor = p.getProfile().vendor;
      byVendor[vendor] = (byVendor[vendor] || 0) + 1;
    }

    const invocationsById: Record<string, number> = {};
    let totalInvocations = 0;
    for (const [id, count] of this.invocationCounts) {
      invocationsById[id] = count;
      totalInvocations += count;
    }

    return {
      totalPersonalities: this.personalities.size,
      byVendor,
      totalInvocations,
      invocationsById,
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 智能推荐
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * 推荐单个最优分身
   *
   * 算法流程：
   * 1. 过滤出能处理该任务的分身
   * 2. 计算每个分身的匹配度评分：
   *    a. 能力相似度（与理想画像的余弦相似度）
   *    b. 场景匹配加分（bestFor 包含任务类型）
   *    c. 语言匹配加分
   *    d. 成本与延迟约束过滤
   * 3. 排序返回 Top N
   */
  recommend(
    task: TaskDescription,
    topN: number = 3,
  ): Recommendation[] {
    const ideal = idealCapabilityForTask(task);

    const scored: Recommendation[] = this.getAll()
      .map((personality) => {
        const profile = personality.getProfile();

        // 基础匹配度 = 能力相似度
        const similarity = capabilitySimilarity(
          profile.capabilities,
          ideal,
        );

        // 场景匹配加分
        let bonus = 0;
        if (profile.bestFor.includes(task.type)) {
          bonus += 0.15;
        }
        if (
          profile.weaknesses.includes(task.type)
        ) {
          bonus -= 0.2;
        }

        // 语言匹配加分
        if (
          task.targetLanguage &&
          profile.languages.includes(task.targetLanguage)
        ) {
          bonus += 0.1;
        }

        // 成本约束
        if (
          task.maxCost !== undefined &&
          profile.costRating > task.maxCost
        ) {
          bonus -= 0.3;
        }

        // 延迟约束
        if (
          task.latencyTolerance !== undefined &&
          profile.speedRating < (5 - task.latencyTolerance + 1)
        ) {
          bonus -= 0.15;
        }

        // 使用频率微调（冷启动时均等）
        const invocations = this.invocationCounts.get(profile.id) || 0;
        const totalInvocations =
          Array.from(this.invocationCounts.values()).reduce(
            (a, b) => a + b,
            0,
          ) || 1;
        const frequencyBonus =
          invocations === 0 ? 0.02 : -0.005 * (invocations / totalInvocations);

        const score = Math.max(
          0,
          Math.min(1, similarity * 0.6 + bonus + frequencyBonus),
        );

        return {
          personalityId: profile.id,
          score,
          reason: this.generateReason(profile, task, similarity, bonus),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return scored;
  }

  /**
   * 推荐协作组合
   *
   * 根据任务自动选择最优的分身组合和协作模式。
   */
  recommendCollaboration(
    task: TaskDescription,
  ): {
    personalityIds: string[];
    mode: CollaborationMode;
    reason: string;
  } {
    const recommendations = this.recommend(task, 5);

    // 单分身即可处理的场景
    if (
      recommendations.length > 0 &&
      recommendations[0].score > 0.85
    ) {
      return {
        personalityIds: [recommendations[0].personalityId],
        mode: CollaborationMode.Sequential,
        reason: `单分身 "${recommendations[0].personalityId}" 匹配度 ${recommendations[0].score.toFixed(2)}，无需协作`,
      };
    }

    // 需要多分身协作
    const topIds = recommendations.slice(0, 3).map((r) => r.personalityId);

    let mode: CollaborationMode;
    if (task.preferredCollaboration) {
      mode = task.preferredCollaboration;
    } else if (task.requiresAlgorithm && task.requiresEngineering) {
      mode = CollaborationMode.Chain;
    } else if (
      task.type === TaskType.CodeReview ||
      task.type === TaskType.Architecture
    ) {
      mode = CollaborationMode.Voting;
    } else {
      mode = CollaborationMode.Parallel;
    }

    const profiles = topIds.map((id) => this.getProfile(id)?.name || id);
    return {
      personalityIds: topIds,
      mode,
      reason: `推荐 ${profiles.join(" + ")} 以 ${mode} 模式协作`,
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 辅助方法
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  private generateReason(
    profile: PersonalityProfile,
    task: TaskDescription,
    similarity: number,
    bonus: number,
  ): string {
    const parts: string[] = [];

    parts.push(`能力匹配度 ${(similarity * 100).toFixed(0)}%`);

    if (profile.bestFor.includes(task.type)) {
      parts.push("擅长该任务类型");
    }

    if (
      task.targetLanguage &&
      profile.languages.includes(task.targetLanguage)
    ) {
      parts.push(`支持 ${task.targetLanguage}`);
    }

    if (bonus > 0.1) {
      parts.push("场景高度匹配");
    }

    if (bonus < -0.1) {
      parts.push("存在弱项扣分");
    }

    return parts.join("，");
  }

  /** 打印所有已注册分身的概览 */
  printOverview(): void {
    console.log("=".repeat(60));
    console.log("  TRAE 分身注册表概览");
    console.log("=".repeat(60));

    const stats = this.getStats();
    console.log(`\n已注册: ${stats.totalPersonalities} 个分身`);
    console.log(`总调用: ${stats.totalInvocations} 次\n`);

    // 按厂商分组
    const vendorGroups: Map<string, PersonalityProfile[]> = new Map();
    for (const p of this.getAll()) {
      const profile = p.getProfile();
      const list = vendorGroups.get(profile.vendor) || [];
      list.push(profile);
      vendorGroups.set(profile.vendor, list);
    }

    for (const [vendor, profiles] of vendorGroups) {
      console.log(`  ┌─ ${vendor} (${profiles.length} 个)`);
      for (const p of profiles) {
        const invocations = this.invocationCounts.get(p.id) || 0;
        console.log(
          `  │  ${p.icon} ${p.name.padEnd(20)} v${p.version.padEnd(10)} 调用: ${invocations}`,
        );
      }
      console.log(`  └${"─".repeat(50)}`);
    }

    console.log("=".repeat(60));
  }
}
