# ZKTeco K40 生物识别系统

这是一个基于ZKTeco K40指纹设备的生物识别系统，用于健身房会员管理、指纹录入和识别。系统包括React前端、FastAPI后端和C#中间件，提供完整的指纹识别解决方案。

## 项目结构

```
biometric-gym-system/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/       # 可复用组件
│   │   │   ├── Device/       # 设备相关组件
│   │   │   ├── Fingerprint/  # 指纹相关组件
│   │   │   ├── Member/       # 会员相关组件
│   │   │   └── Layout.jsx    # 布局组件
│   │   ├── pages/            # 页面组件
│   │   │   ├── Dashboard/    # 仪表板页面
│   │   │   ├── DeviceManage/ # 设备管理页面
│   │   │   ├── MemberManage/ # 会员管理页面
│   │   │   ├── Enrollment/   # 指纹录入页面
│   │   │   └── Recognition/  # 指纹识别页面
│   │   ├── services/         # API服务
│   │   ├── store/            # 状态管理
│   │   ├── utils/            # 工具函数
│   │   └── App.jsx           # 主应用组件
│   ├── package.json          # 依赖配置
│   └── ...
├── backend/                  # FastAPI后端应用
│   ├── app/
│   │   ├── api/              # API路由
│   │   │   ├── device/       # 设备API
│   │   │   ├── fingerprint/  # 指纹API
│   │   │   └── member/       # 会员API
│   │   ├── models/           # 数据模型
│   │   ├── services/         # 业务逻辑
│   │   ├── websocket/        # WebSocket处理
│   │   └── database/         # 数据库配置
│   ├── main.py               # 主应用入口
│   └── requirements.txt      # 依赖配置
├── middleware/               # C#中间件应用
│   ├── Controllers/          # API控制器
│   ├── Services/             # 业务服务
│   ├── Models/               # 数据模型
│   ├── Utils/                # 工具类
│   ├── SDK/                  # ZKTeco SDK
│   ├── Program.cs            # 主程序入口
│   └── ZKTecoMiddleware.csproj # 项目配置
└── README.md                 # 项目说明
```

## 技术栈

### 前端
- React.js
- React Router
- Tailwind CSS
- Lucide React (图标)
- Axios (HTTP请求)
- Socket.io-client (WebSocket)
- Chart.js (图表)
- Zustand (状态管理)

### 后端
- FastAPI
- SQLAlchemy
- PyMySQL
- WebSockets
- Pydantic

### 中间件
- ASP.NET Core
- ZKTeco SDK (zkemkeeper.dll)

## 功能特性

1. **会员管理**
   - 会员信息CRUD
   - 会员指纹管理
   - 会员识别记录查询

2. **设备管理**
   - 设备连接和状态监控
   - 设备信息CRUD
   - 设备数据同步

3. **指纹管理**
   - 指纹录入
   - 指纹识别
   - 指纹模板管理

4. **仪表板**
   - 系统统计数据
   - 识别记录分析
   - 实时状态监控

## 安装与运行

### 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn main:app --reload
```

### 中间件

```bash
# 进入中间件目录
cd middleware

# 确保ZKTeco SDK (zkemkeeper.dll) 已放置在SDK目录下

# 构建项目
dotnet build

# 运行项目
dotnet run
```

## 数据库配置

系统使用MySQL数据库，需要先创建数据库并配置连接信息：

1. 创建数据库：
```sql
CREATE DATABASE biometric_gym CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 配置数据库连接：
   - 修改 `backend/app/database/database.py` 中的 `DATABASE_URL` 变量

## API文档

- 后端API文档：http://localhost:8000/docs
- 中间件API文档：http://localhost:9000/swagger

## WebSocket通信

系统使用WebSocket进行实时通信，主要用于：
- 指纹录入状态更新
- 指纹识别结果通知
- 设备状态变更通知

WebSocket端点：
- 后端：ws://localhost:8000/ws

## 注意事项

1. ZKTeco SDK仅支持Windows系统，因此中间件需要在Windows环境下运行
2. 确保ZKTeco设备已正确连接到网络，并且可以通过IP地址访问
3. 首次使用时，需要在设备管理页面添加并连接设备
4. 指纹录入和识别需要先连接设备才能进行操作

## 许可证

MIT
