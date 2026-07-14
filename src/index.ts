/**
 * TRAE- 13 主体多模型协作系统
 *
 * 主入口：创建注册表 → 注册分身 → 智能推荐 → 协作执行
 */

import { PersonalityRegistry } from "./src/core/PersonalityRegistry";
import { PersonalityInvoker } from "./src/core/PersonalityInvoker";
import { createAllPersonalities } from "./src/personalities";
import { TaskType, CollaborationMode } from "./src/core/PersonalityCore";

async function main() {
  // 1. 初始化
  const registry = new PersonalityRegistry();
  const personalities = createAllPersonalities();
  registry.registerAll(personalities);

  // 2. 打印概览
  registry.printOverview();

  // 3. 智能推荐示例
  console.log("\n" + "─".repeat(60));
  console.log("  智能推荐示例");
  console.log("─".repeat(60));

  const task1 = {
    type: TaskType.CodeGeneration,
    description: "写一个高性能异步爬虫",
    requiresPerformance: true,
    targetLanguage: "Python",
  };

  const recs = registry.recommend(task1, 3);
  console.log(`\n任务: ${task1.description}`);
  for (const rec of recs) {
    console.log(
      `  ${rec.score.toFixed(2)} | ${rec.personalityId} — ${rec.reason}`,
    );
  }

  // 4. 协作推荐
  console.log("\n" + "─".repeat(60));
  console.log("  协作推荐示例");
  console.log("─".repeat(60));

  const collab = registry.recommendCollaboration(task1);
  console.log(`\n任务: ${task1.description}`);
  console.log(`  推荐组合: ${collab.personalityIds.join(" + ")}`);
  console.log(`  协作模式: ${collab.mode}`);
  console.log(`  理由: ${collab.reason}`);

  // 5. 统计
  console.log("\n" + "─".repeat(60));
  console.log("  注册表统计");
  console.log("─".repeat(60));
  const stats = registry.getStats();
  console.log(`  已注册: ${stats.totalPersonalities} 个分身`);
  console.log(`  厂商分布: ${JSON.stringify(stats.byVendor)}`);
}

main().catch(console.error);
