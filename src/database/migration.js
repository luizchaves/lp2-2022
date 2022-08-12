import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const categoriesSql = `
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL
    )
  `;

  await db.run(categoriesSql);

  const foodsSql = `
    CREATE TABLE foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL,
      price DOUBLE NOT NULL,
      category_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `;

  await db.run(foodsSql);

  const usersSql = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(20) NOT NULL
    )
  `;

  db.run(usersSql);
}

export default { up };
