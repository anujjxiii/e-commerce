const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const configuredPath = process.env.DATABASE_URL || path.join('data', 'ecommerce.db');
const dbPath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.resolve(__dirname, configuredPath);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);
db.configure('busyTimeout', 5000);

const PRODUCT_SEED = [
  {
    id: 1,
    name: 'Yaperz Oversized Tee',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
    description: 'Heavyweight cotton oversized tee with a clean streetwear fit.',
    category: 'T-Shirts',
    gender: 'Men',
  },
  {
    id: 2,
    name: 'Urban Baggy Hoodie',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    description: 'Premium fleece hoodie with a relaxed shape and soft interior.',
    category: 'Hoodies',
    gender: 'Men',
  },
  {
    id: 3,
    name: 'Signature Cargo Pants',
    price: 3199,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
    description: 'Tactical cargo pants with roomy utility pockets and durable cotton twill.',
    category: 'Bottomwear',
    gender: 'Men',
  },
  {
    id: 4,
    name: 'Desert Windbreaker',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight windbreaker built for layering through changing weather.',
    category: 'Outerwear',
    gender: 'Men',
  },
  {
    id: 5,
    name: 'Canvas High-Tops',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    description: 'Classic canvas high-top sneakers with a cushioned everyday sole.',
    category: 'Footwear',
    gender: 'Men',
  },
  {
    id: 6,
    name: 'Skeleton Peace Tee',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    description: 'Graphic cotton tee with a relaxed silhouette and bold front artwork.',
    category: 'T-Shirts',
    gender: 'Women',
  },
  {
    id: 7,
    name: 'Street Style Hoodie',
    price: 2399,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    description: 'Soft baggy hoodie designed for an easy layered streetwear look.',
    category: 'Hoodies',
    gender: 'Women',
  },
  {
    id: 8,
    name: 'High Waist Distressed Jeans',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    description: 'High waist denim with a vintage wash and clean distress details.',
    category: 'Bottomwear',
    gender: 'Women',
  },
  {
    id: 9,
    name: 'Chunky White Sneakers',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=80',
    description: 'Platform sneakers with a cushioned sole and crisp white finish.',
    category: 'Footwear',
    gender: 'Women',
  },
  {
    id: 10,
    name: 'Urban Cargo Skirt',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80',
    description: 'Utility cargo skirt with structured pockets and a modern mini length.',
    category: 'Bottomwear',
    gender: 'Women',
  },
  {
    id: 11,
    name: 'Silk Street Top',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80',
    description: 'Smooth satin-finish top with a refined drape and oversized fit.',
    category: 'Tops',
    gender: 'Women',
  },
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

async function tableExists(tableName) {
  const row = await get(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    [tableName],
  );
  return Boolean(row);
}

async function migrateUsersTable() {
  const usersExists = await tableExists('users');
  await run('DROP TABLE IF EXISTS users_next');
  await run(`
    CREATE TABLE users_next (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      google_id TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  if (usersExists) {
    const columns = await all('PRAGMA table_info(users)');
    const columnNames = new Set(columns.map((column) => column.name));
    const usernameExpr = columnNames.has('username')
      ? "COALESCE(NULLIF(TRIM(username), ''), 'Customer')"
      : "'Customer'";
    const passwordExpr = columnNames.has('password') ? 'password' : 'NULL';
    const googleExpr = columnNames.has('google_id')
      ? 'google_id'
      : columnNames.has('googleId')
        ? 'googleId'
        : 'NULL';
    const createdAtExpr = columnNames.has('created_at')
      ? "COALESCE(created_at, datetime('now'))"
      : "datetime('now')";

    await run(`
      INSERT OR IGNORE INTO users_next (id, username, email, password, google_id, created_at)
      SELECT id, ${usernameExpr}, LOWER(TRIM(email)), ${passwordExpr}, ${googleExpr}, ${createdAtExpr}
      FROM users
      WHERE email IS NOT NULL AND TRIM(email) <> ''
      ORDER BY id ASC
    `);
    await run('DROP TABLE users');
  }

  await run('ALTER TABLE users_next RENAME TO users');
  await run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
}

async function resetProductsTable() {
  await run('DROP TABLE IF EXISTS products');
  await run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  for (const product of PRODUCT_SEED) {
    await run(
      `INSERT INTO products (id, name, price, image, description, category, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.name,
        product.price,
        product.image,
        product.description,
        product.category,
        product.gender,
      ],
    );
  }
}

async function createPaymentsTable() {
  await run(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL CHECK (amount > 0),
      method TEXT NOT NULL CHECK (method IN ('card', 'upi', 'cod')),
      status TEXT NOT NULL CHECK (status IN ('paid', 'pending')),
      provider TEXT NOT NULL DEFAULT 'demo',
      reference TEXT NOT NULL UNIQUE,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await run('CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)');
}

let initPromise;

async function initializeDatabase() {
  await exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  await run('BEGIN IMMEDIATE TRANSACTION');

  try {
    await migrateUsersTable();
    await resetProductsTable();
    await createPaymentsTable();
    await run('COMMIT');
  } catch (err) {
    await run('ROLLBACK').catch(() => {});
    throw err;
  }
}

function initDatabase() {
  if (!initPromise) {
    initPromise = initializeDatabase();
  }

  return initPromise;
}

module.exports = {
  all,
  close,
  db,
  dbPath,
  get,
  initDatabase,
  run,
};
