@echo off
title ZKTeco K40 生物识别健身房管理系统 - 桌面端
color 0A

echo ================================================================
echo    ZKTeco K40 生物识别健身房管理系统 - 桌面端
echo    员工专用版本 - 会员注册和验证
echo ================================================================
echo.

REM 检查.NET 6.0是否已安装
echo [1/4] 检查.NET 6.0环境...
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到.NET 6.0
    echo.
    echo 请先安装.NET 6.0 Runtime:
    echo https://dotnet.microsoft.com/download/dotnet/6.0
    echo.
    pause
    exit /b 1
) else (
    echo ✅ .NET 6.0 环境正常
)

REM 导航到正确目录
cd /d "%~dp0"

REM 还原NuGet包
echo.
echo [2/4] 还原项目依赖包...
dotnet restore BiometricGymDesktop.csproj --verbosity quiet
if errorlevel 1 (
    echo ❌ 错误: 包还原失败
    echo 请检查网络连接和NuGet配置
    pause
    exit /b 1
) else (
    echo ✅ 依赖包还原完成
)

REM 编译项目
echo.
echo [3/4] 编译桌面应用程序...
dotnet build BiometricGymDesktop.csproj --configuration Release --verbosity quiet
if errorlevel 1 (
    echo ❌ 错误: 编译失败
    echo.
    echo 可能的解决方案:
    echo 1. 确保安装了.NET 6.0 SDK (不仅仅是Runtime)
    echo 2. 检查项目文件完整性
    echo 3. 重新下载项目文件
    echo.
    pause
    exit /b 1
) else (
    echo ✅ 编译成功
)

REM 启动应用程序
echo.
echo [4/4] 启动桌面应用程序...
echo.
echo ================================================================
echo 应用程序正在启动...
echo 
echo 功能说明:
echo • 会员注册 - 添加新会员并录入指纹
echo • 会员验证 - 通过编号或指纹验证身份
echo 
echo 注意: 请确保后端API服务正在运行 (端口8000)
echo ================================================================
echo.

dotnet run --project BiometricGymDesktop.csproj --configuration Release

if errorlevel 1 (
    echo.
    echo ❌ 错误: 应用程序启动失败
    echo.
    echo 可能的原因:
    echo 1. 后端API服务未启动 (http://localhost:8000)
    echo 2. 网络连接问题
    echo 3. 配置文件错误
    echo.
    echo 请检查后端服务状态后重试
    pause
    exit /b 1
)

echo.
echo 应用程序已关闭
pause 