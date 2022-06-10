import { Router } from "express";
import Category from "./models/Category.js";
import Food from "./models/Food.js";

const router = Router();

router.get('/foods', async (req, res) => {
  const foods = await Food.readAll();

  res.json(foods);
});

router.post('/foods', async (req, res) => {
  const food = req.body;

  const newFood = await Food.create(food);

  res.json(newFood);
});

router.put('/foods/:id', async (req, res) => {
  const id = Number(req.params.id);

  const food = req.body;

  const newFood = await Food.update(food, id);

  if (newFood) {
    res.json(newFood);
  } else {
    res.status(400).json({ error: 'Food not found.' });
  }
});

router.delete('/foods/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (await Food.destroy(id)) {
    res.status(204).send();
  } else {
    res.status(400).json({ error: 'Food not found.' });
  }
});

router.get('/categories', async (req, res) => {
  const categories = await Category.readAll();

  res.json(categories);
});

router.use(function(req, res, next) {
  res.status(404).json({
    message: 'Content not found'
  });
});

router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something broke!'
  });
});

export default router;