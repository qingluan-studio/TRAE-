/**
 * personalities/index.ts — 统一入口
 *
 * 导出所有 12 个 AI 分身，并提供便捷的初始化方法。
 */

export { DoubaoSeedCode } from "./DoubaoSeedCode";
export { DoubaoSeed21Pro } from "./DoubaoSeed21Pro";
export { DoubaoSeed21Turbo } from "./DoubaoSeed21Turbo";
export { DeepSeekV4Pro } from "./DeepSeekV4Pro";
export { DeepSeekV4Flash } from "./DeepSeekV4Flash";
export { KimiK26 } from "./KimiK26";
export { KimiK27Code } from "./KimiK27Code";
export { GLM52 } from "./GLM52";
export { GLM51 } from "./GLM51";
export { GLM5VTurbo } from "./GLM5VTurbo";
export { Qwen37Plus } from "./Qwen37Plus";
export { MiniMaxM3 } from "./MiniMaxM3";

import type { IPersonality } from "../core/PersonalityCore";
import {
  DoubaoSeedCode,
  DoubaoSeed21Pro,
  DoubaoSeed21Turbo,
  DeepSeekV4Pro,
  DeepSeekV4Flash,
  KimiK26,
  KimiK27Code,
  GLM52,
  GLM51,
  GLM5VTurbo,
  Qwen37Plus,
  MiniMaxM3,
} from "./index";

/**
 * 创建所有 12 个分身实例
 */
export function createAllPersonalities(): IPersonality[] {
  return [
    new DoubaoSeedCode(),
    new DoubaoSeed21Pro(),
    new DoubaoSeed21Turbo(),
    new DeepSeekV4Pro(),
    new DeepSeekV4Flash(),
    new KimiK26(),
    new KimiK27Code(),
    new GLM52(),
    new GLM51(),
    new GLM5VTurbo(),
    new Qwen37Plus(),
    new MiniMaxM3(),
  ];
}

/**
 * 按厂商分组创建
 */
export function createByVendor(): Record<string, IPersonality[]> {
  const all = createAllPersonalities();
  const groups: Record<string, IPersonality[]> = {};

  for (const p of all) {
    const vendor = p.getProfile().vendor;
    if (!groups[vendor]) groups[vendor] = [];
    groups[vendor].push(p);
  }

  return groups;
}
