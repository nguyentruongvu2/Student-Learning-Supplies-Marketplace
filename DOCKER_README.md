# 🐳 Docker Deployment Guide

## 📋 Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### 1. Production Deployment

```powershell
# Copy environment file
Copy-Item .env.docker .env

# Edit .env and fill in your values (EMAIL_USER, EMAIL_PASSWORD, JWT_SECRET)

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes database data)
docker-compose down -v
```

Access the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 2. Development Mode (with hot reload)

```powershell
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Stop
docker-compose -f docker-compose.dev.yml down
```

## 📦 Services

### Frontend (Port 3000)

- React application
- Nginx web server
- Production build optimized
- Auto-routing to backend API

### Backend (Port 5000)

- Node.js Express server
- RESTful API
- Socket.IO for real-time features
- File uploads handling

### MongoDB (Port 27017)

- Database server
- Persistent data storage
- Health checks enabled

## 🔧 Useful Commands

```powershell
# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# View running containers
docker ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Execute command in container
docker-compose exec backend sh
docker-compose exec mongodb mongosh

# Restart specific service
docker-compose restart backend

# Remove all containers and volumes
docker-compose down -v

# Clean up unused images
docker system prune -a
```

## 🗄️ Database Management

### Backup MongoDB

```powershell
# Backup to file
docker-compose exec -T mongodb mongodump --archive > backup.archive

# Restore from file
docker-compose exec -T mongodb mongorestore --archive < backup.archive
```

### Access MongoDB Shell

```powershell
docker-compose exec mongodb mongosh nha-cho-sinh-vien
```

## 🔐 Environment Variables

Edit `.env` file:

```env
# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-key-here

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Client URL
CLIENT_URL=http://localhost:3000
```

## 🌐 Network Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ :3000
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│   MongoDB   │
│   (Nginx)   │     │  (Node.js)  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
    :3000               :5000                :27017
```

## 📊 Health Checks

All services include health checks:

- Backend: `http://localhost:5000/api/health`
- Frontend: `http://localhost:3000`
- MongoDB: `mongosh ping`

## 🐛 Troubleshooting

### Port already in use

```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 3000,5000,27017

# Kill process
Stop-Process -Id <PID> -Force
```

### Container won't start

```powershell
# Check logs
docker-compose logs <service-name>

# Rebuild container
docker-compose build --no-cache <service-name>
docker-compose up -d <service-name>
```

### Database connection failed

```powershell
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Clear everything and start fresh

```powershell
# Stop all containers
docker-compose down -v

# Remove all images
docker rmi $(docker images -q)

# Rebuild and start
docker-compose up --build -d
```

## 📝 Production Deployment Notes

1. **Change JWT_SECRET** to a strong random string
2. **Configure email** with valid Gmail app password
3. **Set up reverse proxy** (nginx/Caddy) for HTTPS
4. **Enable firewall** rules for ports
5. **Regular backups** of MongoDB data
6. **Monitor logs** for errors
7. **Update images** regularly for security patches

## 🎯 Best Practices

- Use `.env` file for sensitive data (never commit it)
- Regular database backups
- Monitor container resource usage
- Keep Docker images updated
- Use production builds for deployment
- Enable HTTPS in production
- Set up proper logging and monitoring

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Hub](https://hub.docker.com/_/node)
