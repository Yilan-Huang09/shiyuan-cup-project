<div align="center">

# Aurora Classroom · 智慧课堂交互演示系统

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

基于多智能体协作与 RAG 技术的智慧课堂前端演示系统，以**高中物理动量定理**为教学场景，展示 Agent Team 协同对话、交互式碰撞模拟与知识卡片白板的能力。

</div>

---

## 功能概览

| 模块 | 说明 |
|------|------|
| **Agent Team 对话** | Teacher / Student / Synthesizer / Curator 四角色分步演示课堂互动，含逐条打字动画与引用溯源 |
| **知识卡片白板** | 可拖拽、缩放、固定的 Board 卡片系统，自动碰撞避让排列，支持知识/公式/易错点/模拟器/测验/小结六类卡片 |
| **碰撞模拟器** | 完全非弹性碰撞交互演示，支持双滑块调参与实时动画，配合作动量定理公式联动 |
| **冲量模拟器** | 力-时间冲量 Δp = Ft 交互卡片，滑块实时计算冲量与速度变化 |
| **随堂测验** | 5 道分步选择题卡片，含 KATEX 数学公式渲染与详细解析 |
| **知识库抽屉** | 侧滑抽屉展示参考材料（PPT / 题库 / 真题），支持来源高亮与内容预览 |
| **Agent 角色配置** | 点击头像可修改显示名称、系统提示词与知识库引用偏好 |

## 技术栈

- **框架**：React 19 + TypeScript
- **构建**：Vite 6
- **样式**：Tailwind CSS v4（OKLCH 色彩空间主题）
- **动画**：Motion (Framer Motion)
- **数学渲染**：KaTeX (react-markdown + remark-math + rehype-katex)
- **图标**：Lucide React
- **AI API**：Google GenAI (Gemini)

## 项目结构

```
src/
├── App.tsx                    # 主应用：模拟步进控制、卡片排列算法
├── main.tsx                   # 入口
├── index.css                  # Tailwind 主题与全局样式
├── types.ts                   # TypeScript 类型定义
├── mockData.ts                # 模拟课堂数据（8 步场景）
├── lib/
│   └── utils.ts               # cn() 工具函数
└── components/
    ├── AgentChat.tsx           # 多角色对话面板
    ├── Board.tsx               # 白板容器（点阵背景）
    ├── BoardCards.tsx          # 6 类卡片渲染 + 拖拽/缩放/编辑
    ├── CollisionSimulator.tsx  # 碰撞模拟器
    ├── SimulatorCard.tsx       # 冲量模拟器
    └── SourceDrawer.tsx        # 知识库抽屉
```

## 本地运行

**前置条件**：Node.js ≥ 18

```bash
# 安装依赖
npm install

# 配置环境变量（可选，用于 Gemini AI API）
cp .env.example .env.local
# 编辑 .env.local 填入 GEMINI_API_KEY

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 即可查看。

## 构建部署

```bash
npm run build     # 生产构建，输出到 dist/
npm run preview   # 本地预览生产构建
npm run clean     # 清除构建产物
```

## 模拟流程说明

系统预设了 8 个教学步骤，每步由 Agent 消息与新增白板卡片组成：

1. **开场引入** — Teacher 介绍动量定理，提示查看右侧材料
2. **概念辨析** — Student 提问动量 vs 冲量，Curator 生成知识卡片
3. **公式推导** — Teacher 推导 I = Δp，Synthesizer 小结矢量性，Curator 生成公式/易错点卡片
4. **互动演示** — 推送冲量模拟器卡片
5. **守恒定律** — 推导动量守恒，生成守恒定律卡片
6. **碰撞动画** — 推送碰撞模拟器卡片
7. **课堂小结** — 生成小结卡片
8. **随堂测验** — 推送 5 题测验组卡片

每步完成后点击底部候选按钮推进下一步；点击左上角**重置**可回到初始状态。

## 相关文档

- [`docs/智慧课堂系统项目书起草.md`](docs/智慧课堂系统项目书起草.md) — 系统设计理念与核心思路
- [`docs/项目报告模板参考.md`](docs/项目报告模板参考.md) — 项目报告撰写参考

## 许可证

本项目为师元杯参赛作品，仅供学习与展示用途。