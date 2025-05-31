import uvicorn
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ZKTeco 生物识别系统后端服务")
    parser.add_argument("--host", default="0.0.0.0", help="监听主机 (默认: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="监听端口 (默认: 8000)")
    parser.add_argument("--reload", action="store_true", help="启用自动重载 (开发模式)")
    
    args = parser.parse_args()
    
    print(f"启动 ZKTeco 生物识别系统后端服务 - 监听于 {args.host}:{args.port}")
    
    uvicorn.run(
        "main:app",
        host=args.host,
        port=args.port,
        reload=args.reload
    )
