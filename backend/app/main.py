from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import (
    student_routes,
    teacher_routes,
    dashboard_routes,
    notification_routes,
    class_teachers,
    headmaster_routes,
    function_routes,
    tours_routes,
)

app = FastAPI(title="School Management API")

# Configure CORS Middleware to allow all cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard Dashboard Endpoints
app.include_router(student_routes.router, prefix="/students", tags=["Students"])
app.include_router(teacher_routes.router, prefix="/teachers", tags=["Teachers"])
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(class_teachers.router, prefix="/class-teachers", tags=["Class Teachers"])
app.include_router(notification_routes.router, prefix="/notifications", tags=["Notifications"])
app.include_router(function_routes.router, prefix="/functions", tags=["Functions"])
app.include_router(tours_routes.router, prefix="/tours", tags=["Tours"])

# Headmaster & AI Endpoints (Mounted on BOTH prefixes to prevent 404 errors)
app.include_router(headmaster_routes.router, prefix="/api/v1/headmaster", tags=["Headmaster"])
app.include_router(headmaster_routes.router, prefix="/api/v1/hm", tags=["Headmaster Short Prefix"])

@app.get("/")
def home():
    return {"message": "Backend running successfully"}
