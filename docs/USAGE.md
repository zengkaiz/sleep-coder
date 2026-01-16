# Sleep-Coder 使用指南

> Claude 验收 Codex Cloud 开发 的全自动开发闭环

## 概述

Sleep-Coder 是一个无人值守的自动化编码系统：

```
用户需求 → Claude (调度+验收) ⟷ Codex Cloud (编码) → 完成
```

**核心特点**：
- 用户只需提供需求，后续全自动执行
- Claude 负责规划、调度、验收
- Codex Cloud 负责实际编码
- 验收不通过自动重试修复

---

## 前置准备

### 1. 安装依赖

```bash
# 安装 Claude Code CLI
npm install -g @anthropic-ai/claude-code

# 安装 Codex CLI (OpenAI)
# 参考: https://github.com/openai/codex
```

### 2. 配置 Codex 环境

创建 `.codex-env` 文件：

```bash
CODEX_ENV_ID=<你的环境ID>
```

> 获取环境 ID: 运行 `codex cloud` 查看可用环境

### 3. 权限配置

确保 `.claude/settings.json` 包含必要权限（已预配置）。

---

## 使用流程

### Step 1: 启动 Claude Code

```bash
claude
```

### Step 2: 提供需求

向 Claude 说明你的需求：

```
需求号: 8888
需求内容: 使用 Next.js 14 构建一个 SaaS 后台管理系统，包含首页仪表盘和设置页面
```

### Step 3: 确认 SPEC 和 PLAN

Claude 会生成两个文件：

| 文件 | 内容 |
|------|------|
| `ai-docs/<需求号>/SPEC.md` | 需求规范（技术栈、功能需求、验收标准） |
| `ai-docs/<需求号>/PLAN.md` | 实现计划（TASK 列表） |

**检查并确认** 这两个文件后，告诉 Claude "确认，开始执行"。

### Step 4: 无人值守执行

从这一步开始，无需人工干预：

```
┌─────────────────────────────────────────────────────────┐
│  Step 4: 获取下一个 TASK                                │
│     ↓                                                   │
│  Step 5: 生成 Codex Prompt                              │
│     ↓                                                   │
│  Step 6: Push 并提交 Codex Cloud                        │
│     ↓                                                   │
│  Step 6.5: 轮询等待 Codex 完成                          │
│     ↓                                                   │
│  Step 7: Claude 验收                                    │
│     ├── FAIL → 生成修复指令 → 回到 Step 6               │
│     └── PASS → Step 8                                   │
│     ↓                                                   │
│  Step 8: 更新 PLAN.md (标记完成)                        │
│     ↓                                                   │
│  Step 9: 下一个 TASK (回到 Step 4)                      │
└─────────────────────────────────────────────────────────┘
```

### Step 5: 完成

所有 TASK 完成后，Claude 会通知你。

---

## 目录结构

```
your-project/
├── .codex-env                    # Codex 环境配置
├── .claude/
│   ├── settings.json             # Claude 权限配置
│   └── skills/
│       └── sleep-coder/
│           └── SKILL.md          # Sleep-Coder 技能定义
└── ai-docs/
    └── <需求号>/
        ├── SPEC.md               # 需求规范
        ├── PLAN.md               # 实现计划
        └── .sdcl/
            ├── state.json        # 状态记录
            ├── prompt_TASK-x.txt # 发送给 Codex 的 prompt
            ├── review_TASK-x.txt # Claude 验收结果
            └── fix_TASK-x.txt    # 修复指令（如有）
```

---

## 验收机制

每个 TASK 完成后，Claude 会生成验收报告：

```
SDCL_REVIEW: PASS | FAIL

SUMMARY:
- 一句话总结

CHECKLIST:
- [x] 验收点
- [ ] 未通过点

MISSING:
- 未满足的规范

FIX_INSTRUCTIONS:
- 明确、可执行的修正指令（FAIL 时必须）
```

---

## 示例

### 示例 Prompt 文件

```text
## 前置步骤（必须先执行）
git fetch origin
git checkout feature-8888
git pull origin feature-8888

## 约束
- 只允许在需求分支 feature-8888 工作，不得创建任何新分支
- 完成后必须 commit 并 push 到 origin/feature-8888
- 完成 TASK 后必须输出：SDCL_DONE: TASK-1

## 任务描述
**TASK-1**: 安装 next

### 具体步骤
1. 使用 pnpm 初始化项目
2. 安装 next react react-dom 包

### 验收标准
- package.json 包含 next, react, react-dom 依赖
- pnpm-lock.yaml 已生成

### 完成后
- git add .
- git commit -m "[8888] TASK-1: install next"
- git push origin feature-8888
- 输出: SDCL_DONE: TASK-1
```

---

## 注意事项

### 分支管理

- 用户需手动创建并切换到需求分支
- 一个需求只使用一个分支
- Claude 不会创建/切换分支

### 权限限制

由于 Claude Code **匹配机制限制**（非配置问题），执行时必须遵守：

#### 1. 禁止复合命令 `&&` `||`

```bash
# ❌ 整体匹配 "git *" 失败
git add . && git commit -m "msg"

# ✅ 分开执行，各自匹配成功
git add .
git commit -m "msg"
```

**原因**：Claude Code 把 `git add . && git commit` 作为整体去匹配 `Bash(git *)`，而不是拆分匹配。

#### 2. 禁止命令替换 `$(...)`

```bash
# ❌ 整体匹配失败
codex cloud exec "$(cat prompt.txt)"

# ✅ 使用管道
cat prompt.txt | codex cloud exec -
```

**原因**：`$(...)` 在权限检查阶段不会被展开，整体字符串无法匹配。

#### 3. 当前权限白名单

参见 `.claude/settings.json`，已收紧为最小必需权限：
- `git`, `pnpm`, `npm` - 版本控制和包管理
- `codex` - Codex Cloud 调用
- `cat`, `grep`, `sed`, `jq` - 文本处理
- `mkdir`, `test`, `ls` - 文件操作

已禁止：`rm -rf`, `curl`, `wget`, `ssh`, `scp`
```

### 错误处理

- 验收失败：自动生成修复指令并重试
- Codex 超时：自动重试
- 无法自动解决：暂停并报告用户

---

## 常见问题

### Q: 如何查看 Codex Cloud 环境？

```bash
codex cloud
```

### Q: 如何手动触发某个 TASK？

```bash
# 调用 sleep-coder skill
/sleep-coder
```

### Q: 如何跳过某个 TASK？

手动编辑 `PLAN.md`，将 `- [ ]` 改为 `- [x]`。

### Q: 执行卡住怎么办？

检查：
1. 网络连接
2. Codex Cloud 状态
3. `ai-docs/<需求号>/.sdcl/` 下的日志文件

---

## 技术架构

```
┌──────────────────────────────────────────────────────────────┐
│                        本地环境                               │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐  │
│  │ Claude Code │ ───→ │   Git Repo  │ ───→ │   GitHub    │  │
│  │   (调度)    │ ←─── │   (本地)    │ ←─── │   (远程)    │  │
│  └─────────────┘      └─────────────┘      └─────────────┘  │
│         │                                         ↑          │
│         │ codex cloud exec                        │          │
│         ↓                                         │          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Codex Cloud                          ││
│  │  - 接收 prompt                                          ││
│  │  - checkout 分支                                        ││
│  │  - AI 编码                                              ││
│  │  - commit + push                                        ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**数据流**：
1. Claude 生成 prompt → 提交到 Codex Cloud
2. Codex Cloud 编码 → push 到 GitHub
3. Claude 通过 git fetch 检测完成 → 验收
4. 循环直到所有 TASK 完成
