from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.websockets import WebSocket, WebSocketDisconnect
from typing import List, Dict, Optional
import uvicorn
import asyncio
import json
from datetime import datetime, timedelta

from app.database.database import engine, get_db
from app.models import models
from app.api.member import router as member_router
from app.api.device import router as device_router
from app.api.fingerprint import router as fingerprint_router
from app.websocket.connection_manager import ConnectionManager

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZKTeco K40生物识别系统", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，生产环境应该限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket连接管理器
manager = ConnectionManager()

# 注册路由
app.include_router(member_router.router, prefix="/api/members", tags=["members"])
app.include_router(device_router.router, prefix="/api/devices", tags=["devices"])
app.include_router(fingerprint_router.router, prefix="/api/fingerprints", tags=["fingerprints"])

@app.get("/")
async def root():
    return {"message": "ZKTeco K40生物识别系统API"}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db = Depends(get_db)):
    """获取仪表板统计数据"""
    from app.services.dashboard_service import get_dashboard_statistics
    return await get_dashboard_statistics(db)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # 处理不同类型的消息
            if message.get("type") == "enrollment_request":
                # 处理指纹录入请求
                await manager.broadcast({"type": "enrollment_status", "message": "开始录入指纹..."})
                # 这里应该调用中间件服务
            
            elif message.get("type") == "recognition_request":
                # 处理指纹识别请求
                await manager.broadcast({"type": "recognition_status", "message": "开始识别指纹..."})
                # 这里应该调用中间件服务
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
