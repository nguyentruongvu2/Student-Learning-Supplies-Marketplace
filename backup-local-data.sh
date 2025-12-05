#!/bin/bash
# Script backup dữ liệu từ MongoDB local sang thư mục mongo-backup
# Dùng để chuẩn bị data trước khi đóng gói Docker

echo "📦 Bắt đầu backup dữ liệu từ MongoDB local..."

BACKUP_DIR="$(dirname "$0")/Backend/mongo-backup"
DB_NAME="nha-cho-sinh-vien"
MONGO_URI="mongodb://localhost:27017/$DB_NAME"

# Tạo thư mục backup nếu chưa có
mkdir -p "$BACKUP_DIR"
echo "✓ Thư mục backup: $BACKUP_DIR"

# Danh sách collections cần backup
collections=("users" "posts" "comments" "messages" "conversations" "reports" "warnings" "auditlogs")

echo ""
echo "📋 Backup các collections..."

total_docs=0
for collection in "${collections[@]}"; do
    output_file="$BACKUP_DIR/$collection.json"
    
    echo -n "  → Backup $collection..."
    
    # Sử dụng mongoexport để export data
    mongoexport --uri="$MONGO_URI" --collection="$collection" --out="$output_file" --jsonArray 2>/dev/null
    
    if [ -f "$output_file" ]; then
        docs=$(jq '. | length' "$output_file" 2>/dev/null || echo "0")
        total_docs=$((total_docs + docs))
        echo " ✓ ($docs documents)"
    else
        echo " ⚠ (0 documents)"
    fi
done

echo ""
echo "✅ Backup hoàn tất!"
echo "📊 Tổng cộng: $total_docs documents"
echo "📁 Thư mục backup: $BACKUP_DIR"

# Hiển thị danh sách files
echo ""
echo "📦 Các file backup:"
ls -lh "$BACKUP_DIR"/*.json 2>/dev/null | awk '{print "  • " $9 " (" $5 ")"}'

echo ""
echo "💡 Tiếp theo: Chạy 'docker-compose up --build -d' để khởi động với dữ liệu này"
