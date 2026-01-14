---
name: sleep-coder
description: "Self-Directed Code Loop v3.0 - 单分支 + Claude 验收 Gate 的全自动开发闭环。Claude 负责调度与验收，Codex Cloud 负责编码，每个 task 必须通过 Claude 验收后才能进入下一个。"
---

# SDCL Mode v3.0
## Single-Branch + Claude Review Gate

> 目标：
> 一次需求只使用一个分支。
> 每个 TASK 都必须经过 Claude 验收，不通过则自动纠正，直到通过。
> 用户只需提供「需求号 + 需求内容」，Claude 自动生成 SPEC.md 和 PLAN.md，其余流程无人值守。

---

## 核心原则

1. 一次需求只使用一个分支（Demand Branch）
2. 所有 TASK 顺序执行，不允许跳过
3. Claude 是唯一验收者
4. 未出现 `SDCL_REVIEW: PASS` 不视为完成

---

## 依赖文件

- ai-docs/<DEMAND_ID>/SPEC.md
- ai-docs/<DEMAND_ID>/PLAN.md
- .codex-env

其中 `<DEMAND_ID>` 为需求号，如 `REQ-20260114-001`。

自动生成目录：

ai-docs/<DEMAND_ID>/.sdcl/
- state.json
- logs/
- prompt_TASK-x.txt
- review_TASK-x.txt
- fix_TASK-x.txt

---

## Claude 验收输出规范（强制）

Claude 在每个 TASK 完成后，必须生成：

ai-docs/<DEMAND_ID>/.sdcl/review_TASK-x.txt

格式必须如下：

SDCL_REVIEW: PASS | FAIL

SUMMARY:
- 一句话总结

CHECKLIST:
- [x] 验收点
- [ ] 未通过点

MISSING:
- 未满足的规范

FIX_INSTRUCTIONS:
- 明确、可执行的修正指令（FAIL 必须）

---

## 执行流程

1. 同步本地代码
2. **创建需求目录，生成 SPEC.md 和 PLAN.md**
3. 创建 / 复用需求分支
4. 从 PLAN.md 获取下一个 TASK
5. Codex Cloud 编码（同一分支）
6. Claude 验收
   - FAIL → 纠正 → Codex 修复 → 重新验收
   - PASS → 更新 PLAN → 下一个 TASK
7. 所有 TASK 完成

---

## Step 0：同步本地修改

```bash
git diff-index --quiet HEAD || exit 1
git push
```

---

## Step 1：创建需求目录并生成 SPEC.md / PLAN.md

用户输入：需求号 + 需求内容

```bash
DEMAND_ID="<用户提供的需求号>"
DOCS_DIR="ai-docs/$DEMAND_ID"
mkdir -p "$DOCS_DIR"
```

Claude 根据需求内容生成：

1. **SPEC.md** - 需求规范文档
   - 项目概述
   - 技术栈
   - 功能需求（详细拆解）
   - UI/UX 规范
   - 目录结构
   - 验收标准

2. **PLAN.md** - 实现计划
   - 按 `- [ ] **TASK-N**: 任务标题` 格式列出所有任务
   - 每个 TASK 包含具体的子任务说明
   - TASK 粒度适中，单个 TASK 应可在一次 Codex 执行中完成

生成后提交：

```bash
git add "$DOCS_DIR"
git commit -m "[$DEMAND_ID] init SPEC.md and PLAN.md"
git push
```

---

## Step 2：环境检查

```bash
source .codex-env
# DEMAND_ID 从用户输入或 state.json 获取
DEMAND_ID=${DEMAND_ID:-$(jq -r .demand_id ai-docs/*/.sdcl/state.json 2>/dev/null | head -1)}
DOCS_DIR="ai-docs/$DEMAND_ID"
test -f "$DOCS_DIR/SPEC.md" && test -f "$DOCS_DIR/PLAN.md"
```

---

## Step 3：创建 / 复用需求分支

```bash
DOCS_DIR="ai-docs/$DEMAND_ID"
STATE="$DOCS_DIR/.sdcl/state.json"
DEFAULT=$(git remote show origin | awk '/HEAD branch/ {print $NF}')

if [ ! -f "$STATE" ]; then
  mkdir -p "$DOCS_DIR/.sdcl"
  BRANCH=feature/$DEMAND_ID-$(date +%Y%m%d-%H%M%S)
  git checkout $DEFAULT
  git checkout -b $BRANCH
  git push -u origin $BRANCH
  echo '{"demand_id":"'$DEMAND_ID'","demand_branch":"'$BRANCH'","attempt":0}' > $STATE
else
  BRANCH=$(jq -r .demand_branch $STATE)
fi

git checkout $BRANCH
```

---

## Step 4：获取下一个 TASK

```bash
PLAN_FILE="$DOCS_DIR/PLAN.md"
LINE=$(grep -n "^- \[ \]" "$PLAN_FILE" | head -1 | cut -d: -f1)
TASK=$(sed -n "${LINE}p" "$PLAN_FILE" | grep -oE 'TASK-[0-9]+')
```

---

## Step 5：构建 Codex Prompt（含分支同步）

Codex Cloud 环境是独立的，本地创建的分支需要先 fetch 才能使用。
Prompt 必须以分支同步指令开头：

```text
## 前置步骤（必须先执行）
git fetch origin
git checkout <demand_branch>
git pull origin <demand_branch>

## 约束
- 只允许在需求分支 <demand_branch> 工作，不得创建任何新分支
- 完成后必须 commit 并 push 到 origin/<demand_branch>
- 完成 TASK 后必须输出：SDCL_DONE: TASK-x

## 任务描述
...
```

其中 `<demand_branch>` 从 `ai-docs/<DEMAND_ID>/.sdcl/state.json` 的 `demand_branch` 字段获取。

---

## Step 6：提交 Codex Cloud

```bash
# 记录提交前的最新 commit
BEFORE_COMMIT=$(git rev-parse origin/$BRANCH)

# 提交任务
codex cloud exec --env "$CODEX_ENV_ID" --branch "$BRANCH" "$(cat $DOCS_DIR/.sdcl/prompt_TASK-x.txt)"
```

---

## Step 6.5：后台轮询等待 Codex 完成（无人值守）

使用 Bash 的 `run_in_background` 参数启动轮询脚本，避免阻塞和用户确认：

```bash
# 后台轮询脚本（使用 run_in_background=true）
BRANCH="<demand_branch>"
BEFORE_COMMIT="<提交前的commit>"
MAX_WAIT=600  # 最多等待10分钟
INTERVAL=30   # 每30秒检查一次

for i in $(seq 1 $((MAX_WAIT/INTERVAL))); do
  sleep $INTERVAL
  git fetch origin
  CURRENT=$(git rev-parse origin/$BRANCH)
  if [ "$CURRENT" != "$BEFORE_COMMIT" ]; then
    echo "CODEX_COMPLETED: new commit detected"
    git pull origin $BRANCH
    exit 0
  fi
done
echo "CODEX_TIMEOUT: no new commit after ${MAX_WAIT}s"
exit 1
```

Claude 使用 `TaskOutput` 工具读取后台任务结果：
- 检测到 `CODEX_COMPLETED` → 进入 Step 7 验收
- 检测到 `CODEX_TIMEOUT` → 重试或报告失败

---

## Step 7：Claude 验收 Gate

- Claude 对照 `$DOCS_DIR/SPEC.md` + `$DOCS_DIR/PLAN.md` + git diff 验收
- 输出 `$DOCS_DIR/.sdcl/review_TASK-x.txt`

FAIL：
- 生成 `$DOCS_DIR/.sdcl/fix_TASK-x.txt`
- 回到 Step 6

PASS：
- 进入 Step 8

---

## Step 8：更新 PLAN.md

```bash
sed -i '' "${LINE}s/- \[ \]/- [x]/" "$PLAN_FILE"
git commit -am "[$DEMAND_ID] mark $TASK done"
git push
```

---

## Step 9：进入下一个 TASK

重复 Step 4~8，直到 `$DOCS_DIR/PLAN.md` 无未完成任务。
