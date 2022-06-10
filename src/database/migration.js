import Database from './database.js'

async function up() {
  const db = await Database.connect();

  const categoriesSql = `
    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL
    )
  `;

  db.run(categoriesSql);

  const foodsSql = `
    CREATE TABLE foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL,
      price DOUBLE NOT NULL,
      category_id INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `;

  db.run(foodsSql);
}

export default { up };