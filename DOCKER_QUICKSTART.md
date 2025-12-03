# 🚀 Quick Start Guide - Docker Deployment

## ⚡ Chạy nhanh (Quick Start)

### Windows (PowerShell):

```powershell
# Chạy tất cả (Frontend + Backend + MongoDB)
.\docker-deploy.ps1

# Xem logs
.\docker-logs.ps1

# Dừng
.\docker-stop.ps1
```

### Linux/Mac:

```bash
# Chạy tất cả
chmod +x docker-deploy.sh
./docker-deploy.sh

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

## 🌐 Truy cập

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/api
- **MongoDB**: localhost:27017

## 📋 Yêu cầu

- Docker Desktop đã cài đặt và đang chạy
- File `.env` đã được cấu hình (tự động copy từ `.env.docker`)

## 🎯 Các lệnh hữu ích

```powershell
# Xem trạng thái containers
docker-compose ps

# Xem logs của service cụ thể
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Restart service
docker-compose restart backend

# Rebuild và restart
docker-compose up -d --build

# Xóa tất cả (bao gồm data)
docker-compose down -v
```

## 🐛 Troubleshooting

### Port đã được sử dụng

```powershell
# Tìm và kill process
Get-NetTCPConnection -LocalPort 3000,5000,27017
Stop-Process -Id <PID> -Force
```

### Container không khởi động

```powershell
# Xem logs chi tiết
docker-compose logs <service-name>

# Rebuild lại
docker-compose build --no-cache <service-name>
docker-compose up -d
```

Xem thêm chi tiết trong `DOCKER_README.md`
