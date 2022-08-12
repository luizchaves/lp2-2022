import Database from '../database/database.js';

async function readAll() {
  const db = await Database.connect();

  const sql = `
    SELECT 
      f.id, f.name, f.price, c.name as category
    FROM 
      foods as f INNER JOIN categories as c
    ON
      f.category_id = c.id
  `;

  const foods = await db.all(sql);

  return foods;
}

async function read(id) {
  const db = await Database.connect();

  const sql = `
    SELECT 
      f.id, f.name, f.price, c.name as category
    FROM 
      foods as f INNER JOIN categories as c
    ON
      f.category_id = c.id
    WHERE
      f.id = ?
  `;

  const food = await db.get(sql, [id]);

  return food;
}

async function create(food) {
  const db = await Database.connect();

  const { name, price, category_id } = food;

  const sql = `
    INSERT INTO
      foods (name, price, category_id)
    VALUES
      (?, ?, ?)
  `;

  const { lastID } = await db.run(sql, [name, price, category_id]);

  return read(lastID);
}

async function update(food, id) {
  const db = await Database.connect();

  const { name, price, category_id } = food;

  const sql = `
    UPDATE 
      foods
    SET
      name = ?, price = ?, category_id = ?
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [name, price, category_id, id]);

  if (changes === 1) {
    return read(id);
  } else {
    return false;
  }
}

async function destroy(id) {
  const db = await Database.connect();

  const sql = `
    DELETE FROM
      foods
    WHERE
      id = ?
  `;

  const { changes } = await db.run(sql, [id]);

  return changes === 1;
}

export default { readAll, read, create, update, destroy };
