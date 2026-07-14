/**
 * PersonalityCore.ts — 分身核心接口定义
 *
 * 定义所有 AI 分身必须遵循的契约，包括：
 * - PersonalityProfile：模型画像（能力、风格、元数据）
 * - TaskDescription：任务描述（用于推荐算法）
 * - CollaborationMode：协作模式枚举
 * - InvokeResult：调用结果
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 枚举类型
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 协作模式 */
export enum CollaborationMode {
  /** 串行执行：A 完成后 B 才开始 */
  Sequential = "sequential",
  /** 并行执行：A 和 B 同时进行 */
  Parallel = "parallel",
  /** 投票制：多分身独立回答，取最优 */
  Voting = "voting",
  /** 链式传递：A 的输出作为 B 的输入 */
  Chain = "chain",
  /** 主从式：主分身调度，从分身执行 */
  MasterSlave = "master_slave",
}

/** 任务类型 */
export enum TaskType {
  CodeGeneration = "code_generation",
  CodeReview = "code_review",
  Refactoring = "refactoring",
  Debugging = "debugging",
  Documentation = "documentation",
  DataAnalysis = "data_analysis",
  Research = "research",
  CreativeWriting = "creative_writing",
  Translation = "translation",
  Math = "math",
  Architecture = "architecture",
  Testing = "testing",
  DevOps = "devops",
  MultiModal = "multimodal",
  LongContext = "long_context",
  QuickTask = "quick_task",
}

/** 代码风格 */
export enum CodeStyle {
  Minimal = "minimal",
  Moderate = "moderate",
  Detailed = "detailed",
}

/** 设计模式偏好 */
export enum DesignPattern {
  Factory = "factory",
  Strategy = "strategy",
  Observer = "observer",
  ChainOfResponsibility = "chain_of_responsibility",
  Middleware = "middleware",
  Protocol = "protocol",
  Pipeline = "pipeline",
  Plugin = "plugin",
  Adapter = "adapter",
  None = "none",
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 核心接口
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 能力评分（1-10） */
export interface CapabilityScores {
  /** 代码生成能力 */
  codeGeneration: number;
  /** 工程化程度 */
  engineering: number;
  /** 算法深度 */
  algorithmDepth: number;
  /** 架构设计能力 */
  architecture: number;
  /** 简洁性（越高越简洁） */
  simplicity: number;
  /** 性能优化意识 */
  performance: number;
  /** 长上下文处理 */
  longContext: number;
  /** 多模态理解 */
  multimodal: number;
  /** 中文理解与表达 */
  chinese: number;
  /** 多语言能力 */
  multilingual: number;
}

/** 代码风格画像 */
export interface StyleProfile {
  /** 代码长度偏好 */
  codeLength: "short" | "medium" | "long";
  /** 注释风格 */
  commentStyle: CodeStyle;
  /** 常用设计模式 */
  designPatterns: DesignPattern[];
  /** 偏好数据结构 */
  dataStructures: string[];
  /** 偏好序列化格式 */
  exportFormats: string[];
  /** 命名风格 */
  namingConvention: "camelCase" | "snake_case" | "PascalCase" | "mixed";
}

/** 分身完整画像 */
export interface PersonalityProfile {
  /** 唯一标识 */
  readonly id: string;
  /** 显示名称 */
  readonly name: string;
  /** 厂商 */
  readonly vendor: string;
  /** 模型版本 */
  readonly version: string;
  /** 图标标识（用于 UI 展示） */
  readonly icon: string;
  /** 能力评分 */
  capabilities: CapabilityScores;
  /** 代码风格画像 */
  style: StyleProfile;
  /** 擅长任务类型 */
  bestFor: TaskType[];
  /** 不擅长任务类型 */
  weaknesses: TaskType[];
  /** 擅长编程语言 */
  languages: string[];
  /** 最大上下文窗口（tokens） */
  contextWindow: number;
  /** 单次工具调用最大轮数 */
  maxToolCalls: number;
  /** 速度评级（1-5，5 最快） */
  speedRating: number;
  /** 成本评级（1-5，5 最贵） */
  costRating: number;
  /** 系统提示词模板 */
  systemPrompt: string;
  /** 描述 */
  description: string;
}

/** 任务描述（用于推荐算法输入） */
export interface TaskDescription {
  /** 任务类型 */
  type: TaskType;
  /** 任务描述文本 */
  description: string;
  /** 是否需要高性能 */
  requiresPerformance?: boolean;
  /** 是否需要高工程化 */
  requiresEngineering?: boolean;
  /** 是否需要算法深度 */
  requiresAlgorithm?: boolean;
  /** 是否需要架构设计 */
  requiresArchitecture?: boolean;
  /** 是否需要简洁 */
  requiresSimplicity?: boolean;
  /** 是否需要长上下文 */
  requiresLongContext?: boolean;
  /** 是否需要多模态 */
  requiresMultimodal?: boolean;
  /** 是否需要多语言 */
  requiresMultilingual?: boolean;
  /** 目标编程语言（可选） */
  targetLanguage?: string;
  /** 首选协作模式 */
  preferredCollaboration?: CollaborationMode;
  /** 预算限制 */
  maxCost?: number;
  /** 延迟容忍度（1-5，5 最不敏感） */
  latencyTolerance?: number;
}

/** 调用结果 */
export interface InvokeResult {
  /** 执行的分身 ID */
  personalityId: string;
  /** 是否成功 */
  success: boolean;
  /** 生成的内容 */
  content?: string;
  /** 执行耗时（ms） */
  durationMs: number;
  /** 使用的 token 数 */
  tokensUsed?: number;
  /** 错误信息 */
  error?: string;
  /** 子任务结果（链式调用时） */
  chainResults?: InvokeResult[];
}

/** 分身接口 — 所有 AI 分身必须实现 */
export interface IPersonality {
  /** 获取分身画像 */
  getProfile(): PersonalityProfile;
  /** 执行任务 */
  invoke(task: TaskDescription, context?: string): Promise<InvokeResult>;
  /** 检查是否能处理某任务 */
  canHandle(task: TaskDescription): boolean;
  /** 获取匹配度评分（0-1） */
  getMatchScore(task: TaskDescription): number;
}

/** 协作任务 */
export interface CollaborationTask {
  /** 主任务描述 */
  mainTask: TaskDescription;
  /** 参与的分身 ID 列表 */
  personalityIds: string[];
  /** 协作模式 */
  mode: CollaborationMode;
  /** 最大并行数 */
  maxParallel?: number;
  /** 超时时间（ms） */
  timeout?: number;
}

/** 协作结果 */
export interface CollaborationResult {
  /** 是否全部成功 */
  success: boolean;
  /** 各分身的执行结果 */
  results: InvokeResult[];
  /** 最终合并的内容 */
  mergedContent?: string;
  /** 总耗时 */
  totalDurationMs: number;
  /** 使用的协作模式 */
  mode: CollaborationMode;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 工具函数
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** 计算两个能力评分的相似度（余弦相似度） */
export function capabilitySimilarity(
  a: CapabilityScores,
  b: CapabilityScores,
): number {
  const keys = Object.keys(a) as (keyof CapabilityScores)[];
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    dotProduct += a[key] * b[key];
    normA += a[key] * a[key];
    normB += b[key] * b[key];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** 根据任务自动生成理想能力画像 */
export function idealCapabilityForTask(
  task: TaskDescription,
): CapabilityScores {
  return {
    codeGeneration: task.requiresPerformance ? 8 : task.requiresSimplicity ? 5 : 7,
    engineering: task.requiresEngineering ? 9 : 5,
    algorithmDepth: task.requiresAlgorithm ? 9 : 5,
    architecture: task.requiresArchitecture ? 9 : 5,
    simplicity: task.requiresSimplicity ? 9 : 5,
    performance: task.requiresPerformance ? 9 : 5,
    longContext: task.requiresLongContext ? 9 : 5,
    multimodal: task.requiresMultimodal ? 9 : 3,
    chinese: task.requiresMultilingual ? 6 : 8,
    multilingual: task.requiresMultilingual ? 9 : 5,
  };
}
