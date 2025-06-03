# 生物识别健身系统前端

这是基于 React 的生物识别健身系统前端应用，与 ZKTeco K40 生物识别设备集成。

## 技术栈

- React 18
- React Router v6
- Axios 用于 API 请求
- Zustand 用于状态管理
- Tailwind CSS 用于样式
- Chart.js 用于数据可视化
- WebSocket 用于实时通信

## 项目结构

```
frontend/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── components/     # 可复用组件
│   ├── pages/          # 页面组件
│   ├── services/       # API 服务
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── App.jsx         # 应用入口组件
│   ├── App.css         # 全局样式
│   ├── index.js        # 入口文件
│   └── index.css       # 全局样式（包含 Tailwind）
├── .env.example        # 环境变量示例
├── package.json        # 依赖配置
├── tailwind.config.js  # Tailwind 配置
└── postcss.config.js   # PostCSS 配置
```

## 开发指南

### 环境准备

1. 确保已安装 Node.js (v14+) 和 npm (v6+)
2. 复制 `.env.example` 为 `.env`，并根据需要修改环境变量

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 运行。

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `build` 目录中。

## 与后端和中间件集成

本前端应用需要与以下组件配合使用：

1. **FastAPI 后端**：提供 API 接口和 WebSocket 服务
2. **C# 中间件**：与 ZKTeco K40 设备通信

确保这些组件已正确配置并运行，前端应用才能正常工作。

## 主要功能

- 仪表盘：显示系统概览和统计数据
- 会员注册：注册新会员并采集生物特征
- 会员识别：使用生物特征识别会员身份
- 设备管理：管理连接的 ZKTeco 设备
- 会员管理：管理系统中的会员信息
