#!/bin/sh
# Backend entrypoint - auto import data nếu database trống

echo "🚀 Starting backend..."

# Wait for MongoDB (Atlas or local)
echo "⏳ Waiting for MongoDB..."
MONGO_URI="${MONGODB_URI:-mongodb://mongodb:27017/nha-cho-sinh-vien}"

# Retry connection
RETRIES=30
until node -e "const mongoose = require('mongoose'); mongoose.connect('$MONGO_URI').then(() => { console.log('✓ MongoDB ready'); process.exit(0); }).catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });" 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -eq 0 ]; then
    echo "❌ MongoDB connection timeout"
    exit 1
  fi
  echo "⏳ Retrying... ($RETRIES attempts left)"
  sleep 2
done

# Check if database is empty
echo "🔍 Checking database..."
COLLECTION_COUNT=$(node -e "
const mongoose = require('mongoose');
mongoose.connect('$MONGO_URI').then(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log(collections.length);
  await mongoose.connection.close();
  process.exit(0);
}).catch(() => { console.log(0); process.exit(1); });
" 2>/dev/null)

if [ "$COLLECTION_COUNT" = "0" ] || [ -z "$COLLECTION_COUNT" ]; then
  echo "📦 Database empty, checking for backup data..."
  
  if [ -d "/mongo-backup" ] && [ "$(ls -A /mongo-backup 2>/dev/null)" ]; then
    echo "✓ Found backup files, importing..."
    MONGODB_URI="$MONGO_URI" node /app/scripts/import-backup.js
  else
    echo "ℹ️  No backup found, running seed script..."
    MONGODB_URI="$MONGO_URI" node /app/scripts/seed.js
  fi
else
  echo "✓ Database already has data ($COLLECTION_COUNT collections)"
fi

# Start the server
echo "✅ Starting server..."
exec node server.js
