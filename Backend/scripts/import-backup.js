/**
 * Script import dữ liệu từ backup vào Docker MongoDB
 * Chạy trong Docker: docker exec -it nha-cho-backend node scripts/import-backup.js
 */

const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGO_URI =
  process.env.MONGODB_URI || 
  process.env.MONGO_URI || 
  "mongodb://mongodb:27017/nha-cho-sinh-vien";
const BACKUP_DIR = path.join(__dirname, "..", "..", "mongo-backup");

async function importData() {
  console.log("📦 Bắt đầu import dữ liệu vào MongoDB...\n");
  console.log("📍 MongoDB URI:", MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✓ Kết nối MongoDB thành công");

    const db = client.db();

    // Đọc tất cả file JSON trong backup
    const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".json"));
    console.log(`📦 Tìm thấy ${files.length} backup files\n`);

    for (const file of files) {
      const collName = file.replace(".json", "");
      const filePath = path.join(BACKUP_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (data.length > 0) {
        // Xóa collection cũ
        await db.collection(collName).deleteMany({});

        // Import data mới
        await db.collection(collName).insertMany(data);
        console.log(`✓ Imported ${collName}: ${data.length} documents`);
      }
    }

    console.log("\n✅ Import hoàn tất!");
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    await client.close();
  }
}

importData();
