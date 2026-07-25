require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

(async () => {
  let mongo;
  let uri = process.env.MONGODB_URI;

  // Check if uri is default localhost or unset, or if it's Atlas URI with placeholders
  const isAtlas = uri && uri.includes('mongodb+srv://') && !uri.includes('<db_username>');

  if (isAtlas) {
    console.log(`🌐 Connecting directly to MongoDB Atlas Cloud: ${uri.replace(/:([^@]+)@/, ':****@')}`);
  } else {
    const dbDir = path.join(__dirname, 'mongodb-data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    try {
      mongo = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbPath: dbDir,
          storageEngine: 'wiredTiger',
          dbName: 'aarogyaid',
        },
      });
      uri = 'mongodb://127.0.0.1:27017/aarogyaid';
      console.log(`🍃 Persistent Local MongoDB Server running at: ${uri}`);
    } catch (e) {
      mongo = await MongoMemoryServer.create({ instance: { dbName: 'aarogyaid' } });
      uri = mongo.getUri() + 'aarogyaid';
      console.log(`🧠 In-memory MongoDB running at: ${uri}`);
    }
  }

  const env = { ...process.env, MONGODB_URI: uri };

  try {
    const { spawn } = require('child_process');
    const proc = spawn('node', ['dist/main'], { env, stdio: 'inherit' });

    proc.on('exit', (code) => {
      if (mongo) mongo.stop();
      process.exit(code ?? 0);
    });

    process.on('SIGINT', () => {
      proc.kill();
      if (mongo) mongo.stop();
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      proc.kill();
      if (mongo) mongo.stop();
      process.exit(0);
    });
  } catch (err) {
    if (mongo) mongo.stop();
    process.exit(1);
  }
})();
