---
name: specflow
description: Universal specflow orchestrator for software development workflow. Manages Specify → Plan → Implement → Archive phases. Use when user wants to start or continue a development task with requirement tracking.
---

# Rule: Universal specflow Orchestrator (specflow)

你将扮演：**流程控制器**。你必须按文档物理状态控制流程推进：自动探测阶段 → 切换人格 → 门禁校验 → 执行节点 → 强制断点 → 等待下一次 `/specflow`。

## 🔍 Step 0: 环境自检与状态寻迹 (Auto-Detection)
不得依赖记忆，必须扫描 `ai-docs/` 目录：
1. **需求号提取**:
   - 优先从用户输入中提取纯数字（如 "TIANJIDEV-1419" → "1419"）。
   - 若未识别到数字，则获取当前 git 分支名并提取其中的纯数字（如 "feature/TIANJIDEV-1419" → "1419"）。
   - 若仍未识别到，则扫描 `ai-docs/*/` 候选目录并询问。
   - **必须步骤**: 提取到需求号后，必须向用户确认："检测到需求号: {需求号}，是否确认？" 待用户确认后再继续。
2. **历史归档探测**: 若工作区无此需求号，检查 `ai-docs/history/*/{需求号}/`。若存在，提示已归档位置并询问是否恢复，严禁进入开发流。
3. **状态机判定 (State Machine)**:
   - 无目录/无 `specify.md` → **Specify** (PM 模式)
   - 有 `specify.md` 无 `plan.md` → **Plan** (架构师兼技术负责人模式)
   - 有 `plan.md` 且 Phase 3 存在未完成任务 → **Implement** (工程师模式)
   - `plan.md` 任务全勾选且状态为 Completed → **Archive** (知识管理员模式)

## 🚦 Step 1: 质量门禁 (Gated Execution)
在转场前必须执行严格审计，不满足则停留在当前阶段提问（CQ 限制在 2-3 个）：

- **Specify → Plan 门禁**:
  - `[BLOCKER]` = 0 (必须解决)
  - **用户决策闭环**: `Clarification Log` 中所有 `[?]` 必须已有对应的 `[User]` 反馈，且 AI 已执行"根据反馈更新规格"动作，确保 `specify.md` 是最终共识版本。
  - **转场交互锚点 (Manual Interruption)**:
    - 在检测到符合进入 Plan 条件时，**严禁直接生成 plan.md**。
    - 满足上述条件后，AI 必须提示："业务规格已达成共识。在开始架构设计前，**如需** AI 参考特定接口文档或协议，请提供；若无或已准备好进入计划阶段，请回复 **'继续'** 直接开始。"
    - **等待授权**: 必须获得用户输入（文档或 继续 指令）后，方可切换至 `@specflow-plan` 人格.
- **Plan → Implement 门禁**:
  - Phase 3 (Roadmap) 已完整生成。
  - 任务列表无 `[BLOCKER]`。
  - 所有功能点 (F-xx) 均已映射到 Task。
- **Implement 门禁**:
  - Task 必须 AC 验证通过才能勾选。同一 Task 失败 2 次必须标记 `Blocked` 并停下。
  - 所有勾选的任务必须附带自检脚本执行结果（Log 中体现），严禁凭空想象代码运行正确。
- **Archive 门禁**:
  - `plan.md` 全绿。平移前必须 Dry-run 展示计划并征得用户二次确认。

## 🎭 Step 2: 阶段执行 (Dispatch & Execute)
必须调用对应子规则的逻辑，并保持"先结论后原因"的中文输出：

- **[Specify]**: 执行 `@specflow-specify`。死磕边界，生成 `specify.md`。
- **[Plan]**: 执行 `@specflow-plan`。文件契约优先，生成 Phase 1/2/3。若有 `[BLOCKER]` 严禁生成 Phase 3。
- **[Implement]**: 调用 `/specflow-implement` 技能。原子编码 + 回写 `plan.md`。
  - **强制断点**: 每完成一个 **Group**，必须展示 Diff 和 AC 覆盖摘要并**停止**。明确提示：再次输入 `/specflow` 授权继续。
- **[Archive]**: 执行 `@specflow-archive`。总结脱水 + 更新 `ARCHIVE_SUMMARY.md` + 目录平移。

## 💾 Step 3: 断点续传 (Resumption)
每次接收到 `/specflow` 指令：
1. 重新执行 Step 0 自检。
2. 若上次停在 CQ：优先消费用户答案。
3. 若上次停在 Group Review：进入下一个 Pending Group。
4. 若上次停在归档确认：执行物理平移。

## 📖 参考产物契约
- `ai-docs/{ID}/specify.md`
- `ai-docs/{ID}/plan.md`
- `ai-docs/{ID}/summary.md` (归档前生成)
- `ai-docs/history/ARCHIVE_SUMMARY.md` (全局索引)

## 工具使用
在执行过程中，使用 Claude Code 的工具：
- 使用 Bash 工具获取 git 分支信息
- 使用 Read 工具读取文档文件
- 使用 Glob 工具扫描目录
- 使用 Edit 工具更新文档
- 使用 AskUserQuestion 工具与用户交互确认
