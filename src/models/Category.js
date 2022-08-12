import Database from '../database/database.js';

async function create(category) {
  const db = await Database.connect();

  const { id, name } = category;

  const sql = `
    INSERT INTO
      categories (id, name)
    VALUES
      (?, ?)
  `;

  const { lastID } = await db.run(sql, [id, name]);

  return read(lastID);
}

async function readAll() {
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      categories
  `;

  const categories = await db.all(sql);

  return categories;
}

async function read(id) {
  const db = await Database.connect();

  const sql = `
    SELECT
      *
    FROM
      categories
    WHERE
      id = ?
  `;

  const category = await db.get(sql, [id]);

  return category;
}

export default { create, readAll, read };
