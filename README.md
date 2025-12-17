# Finance Mirror - Frontend

一个基于 Vue 3, TypeScript, Vite 和 Pinia 构建的现代化企业级财务管理系统前端应用。

## ✨ 特性

- 🚀 **现代化技术栈**: 使用 Vue 3 Composition API, TypeScript, Vite 开发，提供极速的开发体验。
- 🧩 **组件化架构**: 高度模块化的组件设计，易于维护和复用。
- 🔒 **完整的认证体系**: 基于 JWT 的用户认证和授权。
- 📊 **核心财务功能**: 涵盖总账、应收、应付、费用管理、财务报表等核心模块。
- 🌐 **响应式设计**: 完美适配桌面端和移动端。
- 📦 **状态管理**: 使用 Pinia 进行集中、类型安全的状态管理。
- 🎨 **全局样式**: 基于 SCSS 的全局样式系统。

## 🏗️ 项目结构

项目采用分层架构，清晰地划分了职责：

```
src/
├── api/ # API 接口层，与后端通信
├── assets/ # 静态资源
├── components/ # 可复用的 Vue 组件
│ ├── common/ # 通用组件（布局、表格等）
│ ├── forms/ # 表单组件
│ └── … # 各业务模块组件
├── composables/ # 组合式函数，封装业务逻辑
├── router/ # 路由配置
├── stores/ # Pinia 状态管理
├── types/ # TypeScript 类型定义
├── utils/ # 工具函数
└── views/ # 页面视图组件
```

## 🚀 快速开始

### 环境准备

确保你的本地环境已安装 [Node.js](https://nodejs.org/) (推荐 v18+)。

### 安装依赖

npm install

### 运行项目

npm run dev

### 构建项目

npm run build
