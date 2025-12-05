/**
 * Script copy dữ liệu từ MongoDB local (port 27017) sang Docker MongoDB
 * Chạy từ local: node scripts/copy-local-data.js
 */

const { MongoClient } = require("mongodb");

const LOCAL_URI = "mongodb://localhost:27017";
const DOCKER_URI = "mongodb://localhost:27017"; // Same port, different container
const DB_NAME = "nha-cho-sinh-vien";

async function copyData() {
  console.log("🔄 Bắt đầu copy dữ liệu từ local MongoDB...\n");

  // Kết nối local MongoDB (cần stop Docker MongoDB trước)
  const localClient = new MongoClient(LOCAL_URI);

  try {
    await localClient.connect();
    console.log("✓ Kết nối MongoDB local");

    const localDb = localClient.db(DB_NAME);

    // Lấy tất cả collections
    const collections = await localDb.listCollections().toArray();
    console.log(`📦 Tìm thấy ${collections.length} collections\n`);

    // Export từng collection
    for (const collInfo of collections) {
      const collName = collInfo.name;
      const collection = localDb.collection(collName);
      const data = await collection.find({}).toArray();

      if (data.length > 0) {
        console.log(`✓ ${collName}: ${data.length} documents`);

        // Ghi ra file JSON
        const fs = require("fs");
        const path = require("path");
        const backupDir = path.join(__dirname, "..", "..", "mongo-backup");

        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }

        fs.writeFileSync(
          path.join(backupDir, `${collName}.json`),
          JSON.stringify(data, null, 2)
        );
      }
    }

    console.log("\n✅ Export hoàn tất! Backup ở thư mục: mongo-backup/");
    console.log("\n📝 Bước tiếp theo:");
    console.log("1. Chạy: docker-compose up -d");
    console.log("2. Chạy: node scripts/import-backup.js");
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    await localClient.close();
  }
}

copyData();
