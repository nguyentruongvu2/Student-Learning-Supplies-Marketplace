#!/bin/bash
# MongoDB initialization script
# This script runs once when MongoDB container starts for the first time

echo "🔄 Checking for backup data to import..."

BACKUP_DIR="/mongo-backup"

if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR)" ]; then
    echo "📦 Found backup files, importing data..."
    
    # Wait for MongoDB to be ready
    until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
        echo "⏳ Waiting for MongoDB to start..."
        sleep 2
    done
    
    echo "✓ MongoDB ready, starting import..."
    
    # Import each JSON file
    for file in $BACKUP_DIR/*.json; do
        if [ -f "$file" ]; then
            collection=$(basename "$file" .json)
            echo "Importing $collection..."
            mongoimport --db nha-cho-sinh-vien --collection "$collection" --file "$file" --jsonArray
        fi
    done
    
    echo "✅ Data import completed!"
else
    echo "ℹ️  No backup data found, skipping import"
fi
