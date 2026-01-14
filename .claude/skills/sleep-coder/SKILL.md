---
name: sleep-coder
description: "Self-Directed Code Loop v3.0 - 单分支 + Claude 验收 Gate 的全自动开发闭环。Claude 负责调度与验收，Codex Cloud 负责编码，每个 task 必须通过 Claude 验收后才能进入下一个。"
---

# SDCL Mode v3.0
## Single-Branch + Claude Review Gate

> 目标：
> 一次需求只使用一个分支。
> 每个 TASK 都必须经过 Claude 验收，不通过则自动纠正，直到通过。
> 用户只负责提供 SPEC.md + PLAN.md，其余流程无人值守。

---

## 核心原则

1. 一次需求只使用一个分支（Demand Branch）
2. 所有 TASK 顺序执行，不允许跳过
3. Claude 是唯一验收者
4. 未出现 `SDCL_REVIEW: PASS` 不视为完成

---

## 依赖文件

- SPEC.md
- PLAN.md
- .codex-env

自动生成目录：

.sdcl/
- state.json
- logs/
- prompt_TASK-x.txt
- review_TASK-x.txt
- fix_TASK-x.txt

---

## Claude 验收输出规范（强制）

Claude 在每个 TASK 完成后，必须生成：

.sdcl/review_TASK-x.txt

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
2. 创建 / 复用需求分支
3. 从 PLAN.md 获取下一个 TASK
4. Codex Cloud 编码（同一分支）
5. Claude 验收
   - FAIL → 纠正 → Codex 修复 → 重新验收
   - PASS → 更新 PLAN → 下一个 TASK
6. 所有 TASK 完成

---

## Step 0：同步本地修改

```bash
git diff-index --quiet HEAD || exit 1
git push
```

---

## Step 1：环境检查

```bash
source .codex-env
test -f SPEC.md && test -f PLAN.md
```

---

## Step 2：创建 / 复用需求分支

```bash
STATE=.sdcl/state.json
DEFAULT=$(git remote show origin | awk '/HEAD branch/ {print $NF}')

if [ ! -f "$STATE" ]; then
  BRANCH=feature/demand-$(date +%Y%m%d-%H%M%S)
  git checkout $DEFAULT
  git checkout -b $BRANCH
  git push -u origin $BRANCH
  echo '{"demand_branch":"'$BRANCH'","attempt":0}' > $STATE
else
  BRANCH=$(jq -r .demand_branch $STATE)
fi

git checkout $BRANCH
```

---

## Step 3：获取下一个 TASK

```bash
LINE=$(grep -n "^- \[ \]" PLAN.md | head -1 | cut -d: -f1)
TASK=$(sed -n "${LINE}p" PLAN.md | grep -oE 'TASK-[0-9]+')
```

---

## Step 4：构建 Codex Prompt（禁止切分支）

```text
只允许在需求分支工作，不得创建任何新分支。
完成 TASK 后必须输出：SDCL_DONE: TASK-x
```

---

## Step 5：提交 Codex Cloud

```bash
codex cloud exec --env "$CODEX_ENV_ID" "$(cat .sdcl/prompt_TASK-x.txt)"
```

---

## Step 6：Claude 验收 Gate

- Claude 对照 SPEC.md + PLAN.md + git diff 验收
- 输出 review_TASK-x.txt

FAIL：
- 生成 fix_TASK-x.txt
- 回到 Step 5

PASS：
- 进入 Step 7

---

## Step 7：更新 PLAN.md

```bash
sed -i '' "${LINE}s/- \[ \]/- [x]/" PLAN.md
git commit -am "mark $TASK done"
git push
```

---

## Step 8：进入下一个 TASK

重复 Step 3~7，直到 PLAN.md 无未完成任务。
