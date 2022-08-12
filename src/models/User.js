import bcrypt from 'bcryptjs';

import Database from '../database/database.js';

const salt = Number(process.env.SALT);

async function create(user) {
  const db = await Database.connect();

  const { name, email, password } = user;

  const hash = bcrypt.hashSync(password, salt);

  const sql = `
    INSERT INTO
      users (name, email, password)
    VALUES
      (?, ?, ?)
  `;

  const { lastID } = await db.run(sql, [name, email, hash]);

  return read(lastID);
}

async function read(id) {
  const db = await Database.connect();

  const sql = `
    SELECT 
      *
    FROM 
      users
    WHERE
      id = ?
  `;

  const user = await db.get(sql, [id]);

  return user;
}

async function readByEmail(email) {
  const db = await Database.connect();

  const sql = `
    SELECT 
      *
    FROM 
      users
    WHERE
      email = ?
  `;

  const user = await db.get(sql, [email]);

  return user;
}

export default { create, read, readByEmail };
