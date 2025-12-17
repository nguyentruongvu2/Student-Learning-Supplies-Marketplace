#!/bin/bash
# Script tu dong chay Ngrok va cap nhat .env

PORT=${1:-3000}
BACKEND=$2

echo ""
echo "========================================"
echo "  CHAY NGROK - TRUY CAP TU DIEN THOAI"
echo "========================================"
echo ""

# Kiem tra ngrok da cai dat
if ! command -v ngrok &> /dev/null; then
    echo "✗ Ngrok chua duoc cai dat!"
    echo ""
    echo "Vui long cai dat ngrok:"
    echo "  Mac: brew install ngrok"
    echo "  Linux: sudo snap install ngrok"
    echo "  Hoac: https://ngrok.com/download"
    echo ""
    echo "Sau do dang ky va cau hinh:"
    echo "  1. Dang ky: https://dashboard.ngrok.com/signup"
    echo "  2. Chay: ngrok config add-authtoken YOUR_TOKEN"
    echo ""
    exit 1
fi

echo "✓ Ngrok da cai dat: $(ngrok version)"

# Kiem tra Docker dang chay
echo "Kiem tra Docker..."
if docker ps &> /dev/null; then
    echo "✓ Docker dang chay"
    
    # Kiem tra containers
    if docker ps --filter "name=nha-cho-frontend" --format "{{.Names}}" | grep -q "nha-cho-frontend"; then
        echo "  ✓ Frontend container dang chay"
    else
        echo "  ⚠ Frontend container chua chay"
        echo "  → Chay: docker-compose up -d"
    fi
    
    if docker ps --filter "name=nha-cho-backend" --format "{{.Names}}" | grep -q "nha-cho-backend"; then
        echo "  ✓ Backend container dang chay"
    else
        echo "  ⚠ Backend container chua chay"
    fi
else
    echo "⚠ Docker chua chay, dam bao ung dung dang chay tren port $PORT"
fi

echo ""
echo "========================================"
echo "  BAT DAU NGROK"
echo "========================================"
echo ""

if [ "$BACKEND" = "--backend" ]; then
    echo "Chay ngrok cho BACKEND (port 5000)..."
    echo "Nhan Ctrl+C de dung"
    echo ""
    sleep 1
    ngrok http 5000
else
    echo "Chay ngrok cho FRONTEND (port $PORT)..."
    echo ""
    echo "Sau khi ngrok chay:"
    echo "  1. Copy URL (https://xxx.ngrok-free.app)"
    echo "  2. Mo .env va cap nhat:"
    echo "     CLIENT_URL=https://xxx.ngrok-free.app"
    echo "  3. Chay: docker-compose restart backend"
    echo "  4. Mo URL tren dien thoai"
    echo ""
    echo "Nhan Ctrl+C de dung"
    echo ""
    sleep 2
    ngrok http $PORT
fi
