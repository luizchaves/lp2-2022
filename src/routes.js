import { Router } from "express";

import Category from "./models/Category.js";
import Food from "./models/Food.js";
import User from "./models/User.js";

const router = Router();

router.get('/', (req, res) => res.redirect('/foods.html'));

router.get('/foods', async (req, res) => {
  try {
    const foods = await Food.readAll();
  
    res.json(foods);
  } catch(error) {
    throw new Error('Error in list foods');
  }
});

router.post('/foods', async (req, res) => {
  try {
    const food = req.body;
  
    const newFood = await Food.create(food);
    
    res.json(newFood);
  } catch(error) {
    throw new Error('Error in create food');
  }
});

router.put('/foods/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
  
    const food = req.body;
  
    const newFood = await Food.update(food, id);
  
    if (newFood) {
      res.json(newFood);
    } else {
      res.status(400).json({ error: 'Food not found.' });
    }
  } catch(error) {
    throw new Error('Error in update food');
  }
});

router.delete('/foods/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
  
    if (await Food.destroy(id)) {
      res.status(204).send();
    } else {
      res.status(400).json({ error: 'Food not found.' });
    }
  } catch(error) {
    throw new Error('Error in delete food');
  }
});

router.get('/categories', async (req, res) => {
  try{
    const categories = await Category.readAll();
  
    res.json(categories);
  } catch(error) {
    throw new Error('Error in list categories');
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = req.body;

    const newUser = await User.create(user);

    res.json(newUser);
  } catch(error) {
    throw new Error('Error in create user');
  }
});

router.use(function(req, res, next) {
  res.status(404).json({
    message: 'Content not found'
  });
});

router.use(function(err, req, res, next) {
  // console.error(err.stack);

  res.status(500).json({
    message: 'Something broke!'
  });
});

export default router;