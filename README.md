<p align="center">
  <img src="public/logo.svg" alt="Evoke Logo" width="80" height="80">
</p>

<h1 align="center">Evoke</h1>

<p align="center">
  AI 驱动的代码生成平台 | AI-Powered Code Generation Platform
</p>

<p align="center">
  <a href="#中文">中文</a> •
  <a href="#english">English</a>
</p>

---

<h2 id="中文">中文</h2>

### 简介

Evoke 是一个 AI 驱动的代码生成平台，通过自然语言对话将你的想法转化为功能完整的 Web 应用程序。只需描述你想要构建的内容，即可实时查看 AI 生成并运行的应用程序。

### 演示截图

![首页](screenshots/home.png)
![工作区](screenshots/workspace.png)
![代码浏览器](screenshots/code-explorer.png)

### 功能特性

- **AI 代码生成** - 用自然语言描述你的应用，AI 自动生成代码
- **实时预览** - 在沙箱环境中即时查看生成的应用
- **代码浏览器** - 浏览生成的代码，支持语法高亮和文件树导航
- **项目模板** - 提供多种预设模板，快速开始创建
- **多轮对话** - 通过持续对话迭代优化应用
- **多模型支持** - 支持选择不同的 AI 模型
- **深色/浅色模式** - 自动跟随系统主题
- **用户认证** - 安全的登录注册系统，项目云端存储

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16, React 19, TypeScript |
| 样式 | Tailwind CSS 4, Shadcn/UI, Radix UI |
| 后端 | tRPC, Prisma, Neon, PostgreSQL |
| AI 编排 | Inngest Agent Kit |
| 代码执行 | E2B Code Interpreter |
| 认证 | Clerk |
| 数据请求 | TanStack Query |
| 数据验证 | Zod |

### 环境要求

- Node.js 18+
- Neon (PostgreSQL) 数据库
- Clerk 账户
- E2B API 密钥
- Inngest 账户
- AI 模型 API 密钥

### 快速开始

1. 克隆项目

```bash
git clone https://github.com/cheeseburgertony/evoke.git
cd evoke
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

编辑 `.env` 文件，填入以下配置：

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/evoke"

# Clerk 认证
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

# E2B 代码沙箱
E2B_API_KEY=e2b_xxx

# Inngest 事件处理
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx

# AI 模型（根据需要配置）
OPENAI_API_KEY=sk_xxx
ANTHROPIC_API_KEY=sk_xxx
```

4. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

5. 启动开发服务器

```bash
npm run dev
```

6. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 项目结构

```
src/
├── app/                      # Next.js App Router 页面
│   ├── (home)/               # 首页路由
│   ├── api/                  # API 路由 (tRPC, Inngest)
│   └── projects/             # 项目详情页
├── components/               # 通用组件
│   └── ui/                   # Shadcn/UI 组件库
├── hooks/                    # 自定义 Hooks
├── inngest/                  # Inngest 事件和函数
├── lib/                      # 工具函数
├── modules/                  # 业务模块
│   ├── home/                 # 首页模块
│   ├── messages/             # 消息模块
│   ├── projects/             # 项目模块
│   └── usage/                # 用量模块
├── trpc/                     # tRPC 配置
└── generated/                # Prisma 生成文件
```

### 工作原理

1. **用户输入** - 在输入框中描述你想要构建的应用
2. **AI 处理** - Inngest 编排 AI 代理生成应用代码
3. **沙箱执行** - E2B 在安全隔离的环境中运行代码
4. **实时预览** - 在浏览器中直接查看运行的应用
5. **代码浏览** - 查看生成的文件和代码实现

### 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

<h2 id="english">English</h2>

### Introduction

Evoke is an AI-powered code generation platform that transforms your ideas into fully functional web applications through natural language conversation. Simply describe what you want to build, and watch as AI generates and runs your application in real-time.

### Screenshots

<!--
Required screenshots:
1. screenshots/home.png - Homepage (navbar, input field, template buttons, dynamic background)
2. screenshots/workspace.png - Workspace (left: chat, right: preview, top: tabs)
3. screenshots/code-explorer.png - Code explorer (file tree, syntax highlighting)
Recommended size: 1920x1080 or 1280x720
-->

![Home](screenshots/home.png)
![Workspace](screenshots/workspace.png)
![Code Explorer](screenshots/code-explorer.png)

### Features

- **AI Code Generation** - Describe your app in natural language, AI generates the code
- **Real-Time Preview** - See your generated app instantly in a sandboxed environment
- **Code Explorer** - Browse generated code with syntax highlighting and file tree navigation
- **Project Templates** - Multiple preset templates for quick starts
- **Iterative Refinement** - Improve your app through continuous conversation
- **Multi-Model Support** - Choose from different AI models
- **Dark/Light Mode** - Automatically follows system theme
- **User Authentication** - Secure sign-up/sign-in with cloud project storage

### Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Shadcn/UI, Radix UI |
| Backend | tRPC, Prisma, Neon, PostgreSQL |
| AI Orchestration | Inngest Agent Kit |
| Code Execution | E2B Code Interpreter |
| Authentication | Clerk |
| Data Fetching | TanStack Query |
| Validation | Zod |

### Prerequisites

- Node.js 18+
- Neon (PostgreSQL) database
- Clerk account
- E2B API key
- Inngest account
- AI model API keys

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/cheeseburgertony/evoke.git
cd evoke
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with the following configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/evoke"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

# E2B Code Sandbox
E2B_API_KEY=e2b_xxx

# Inngest Event Processing
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx

# AI Models (configure as needed)
OPENAI_API_KEY=sk_xxx
ANTHROPIC_API_KEY=sk_xxx
```

4. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

5. Start the development server

```bash
npm run dev
```

6. Open your browser and visit [http://localhost:3000](http://localhost:3000)

### Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (home)/               # Home page routes
│   ├── api/                  # API routes (tRPC, Inngest)
│   └── projects/             # Project detail pages
├── components/               # Shared components
│   └── ui/                   # Shadcn/UI component library
├── hooks/                    # Custom React hooks
├── inngest/                  # Inngest events and functions
├── lib/                      # Utility functions
├── modules/                  # Feature modules
│   ├── home/                 # Home module
│   ├── messages/             # Messages module
│   ├── projects/             # Projects module
│   └── usage/                # Usage module
├── trpc/                     # tRPC configuration
└── generated/                # Prisma generated files
```

### How It Works

1. **User Input** - Describe the application you want to build in the input field
2. **AI Processing** - Inngest orchestrates AI agents to generate application code
3. **Sandbox Execution** - E2B runs the code in a secure, isolated environment
4. **Live Preview** - View the running application directly in the browser
5. **Code Browsing** - Explore the generated files and code implementation

### Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by the Evoke Team
</p>
