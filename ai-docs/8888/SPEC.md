# SaaS 后台管理系统 - 需求规范

## 项目概述

使用 Next.js 14 (App Router) 构建一个现代化的 SaaS 后台管理系统，包含首页仪表盘和设置页面。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **包管理**: pnpm

## 功能需求

### 1. 布局组件 (Layout)

- 左侧导航栏（Sidebar）
  - Logo 区域
  - 导航菜单项：首页、设置
  - 响应式折叠支持
- 顶部导航栏（Header）
  - 页面标题
  - 用户头像/下拉菜单

### 2. 首页仪表盘 (Dashboard)

- 统计卡片区域
  - 总用户数
  - 活跃用户
  - 总收入
  - 订单数量
- 图表区域（占位）
  - 收入趋势图占位
  - 用户增长图占位
- 最近活动列表

### 3. 设置页面 (Settings)

- 个人信息设置
  - 头像上传区域
  - 用户名
  - 邮箱
  - 保存按钮
- 通知设置
  - 邮件通知开关
  - 推送通知开关
- 安全设置
  - 修改密码入口
  - 两步验证开关

## UI/UX 规范

- 采用简洁现代的设计风格
- 主色调：蓝色系 (#3B82F6)
- 背景色：浅灰 (#F9FAFB)
- 卡片圆角：8px
- 响应式断点：md (768px), lg (1024px)

## 目录结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页仪表盘
│   └── settings/
│       └── page.tsx        # 设置页面
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx     # 侧边栏
│   │   └── Header.tsx      # 顶部栏
│   ├── dashboard/
│   │   ├── StatCard.tsx    # 统计卡片
│   │   └── ActivityList.tsx # 活动列表
│   └── settings/
│       ├── ProfileForm.tsx  # 个人信息表单
│       └── SettingsCard.tsx # 设置卡片
└── lib/
    └── utils.ts            # 工具函数
```

## 验收标准

1. 项目可正常启动 (`pnpm dev`)
2. 首页显示所有统计卡片和布局
3. 设置页显示所有设置项
4. 导航可正常切换页面
5. 响应式布局在移动端正常显示
6. 无 TypeScript 编译错误
7. 无控制台报错
