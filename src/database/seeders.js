import { resolve } from 'path';
import { readFileSync} from 'fs';
import Food from '../models/Food.js';
import Category from '../models/Category.js';

async function up() {
  const file = resolve(process.cwd(), "src", "database", "seeders.json");

  const content = JSON.parse(readFileSync(file));

  for (const category of content.categories) {
    await Category.create(category);
  }

  for (const food of content.foods) {
    await Food.create(food);
  }
}

export default { up };