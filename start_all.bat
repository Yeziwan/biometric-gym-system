@echo off
echo 正在启动ZKTeco生物识别系统...

echo 检查MySQL服务...
net start MySQL80

echo 启动中间件服务...
start cmd /k "cd middleware && dotnet run --urls=http://0.0.0.0:9000"

echo 等待中间件启动...
timeout /t 10

echo 启动后端服务...
start cmd /k "cd backend && python run.py"

echo 等待后端启动...
timeout /t 10

echo 启动前端应用...
start cmd /k "cd frontend && npm run dev"

echo 所有服务已启动！
echo 前端: http://localhost:3000
echo 后端API: http://localhost:8000/docs
echo 中间件API: http://localhost:9000/swagger

pause
