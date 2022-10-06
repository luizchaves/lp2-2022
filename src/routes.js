import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { celebrate, Joi, errors, Segments } from 'celebrate';

import uploadConfig from './config/multer.js';
import Category from './models/Category.js';
import Food from './models/Food.js';
import User from './models/User.js';

import { isAuthenticated } from './middleware/auth.js';
import SendMail from './services/SendMail.js';

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const router = Router();

router.get('/', (req, res) => res.redirect('/foods.html'));

router.get('/foods', isAuthenticated, async (req, res) => {
  try {
    const foods = await Food.readAll();

    res.json(foods);
  } catch (error) {
    throw new AppError('Error in list foods');
  }
});

router.post(
  '/foods',
  isAuthenticated,
  multer(uploadConfig).single('image'),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().precision(2),
      category_id: Joi.number().integer(),
    }),
  }),
  async (req, res) => {
    try {
      const food = req.body;

      console.log('body', req.body);

      const image = req.file
        ? `/imgs/foods/${req.file.filename}`
        : '/imgs/foods/placeholder.jpg';

      const newFood = await Food.create({ ...food, image });

      res.json(newFood);
    } catch (error) {
      throw new AppError('Error in create food');
    }
  }
);

router.put(
  '/foods/:id',
  isAuthenticated,
  multer(uploadConfig).single('image'),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().precision(2),
      category_id: Joi.number().integer(),
    }),
  }),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const food = req.body;

      const image = req.file
        ? `/imgs/foods/${req.file.filename}`
        : '/imgs/foods/placeholder.jpg';

      const newFood = await Food.update({ ...food, image }, id);

      if (newFood) {
        res.json(newFood);
      } else {
        throw new AppError('Food not found.');
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Error in update food');
    }
  }
);

router.delete('/foods/:id', isAuthenticated, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (await Food.destroy(id)) {
      res.status(204).send();
    } else {
      throw new AppError('Food not found.');
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Error in delete food');
  }
});

router.get('/categories', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.readAll();

    res.json(categories);
  } catch (error) {
    throw new AppError('Error in list categories');
  }
});

router.post(
  '/users',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().min(8),
    }),
  }),
  async (req, res) => {
    try {
      const user = req.body;

      const newUser = await User.create(user);

      await SendMail.createNewUser(user.email);

      res.json(newUser);
    } catch (error) {
      if (
        error.message.includes(
          'SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email'
        )
      ) {
        throw new AppError('Email already exists');
      } else {
        throw new AppError('Error in create user');
      }
    }
  }
);

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.readByEmail(email);

    if (!user) {
      throw new Error();
    }

    const { id: userId, password: hash } = user;

    const match = await bcrypt.compareSync(password, hash);

    if (match) {
      const token = jwt.sign(
        { userId },
        process.env.SECRET,
        { expiresIn: 3600 } // 1h
      );

      res.json({ auth: true, token });
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new AppError('User not found', 401);
  }
});

router.use(function (req, res, next) {
  res.status(404).json({
    message: 'Content not found',
  });
});

router.use(errors());

router.use(function (error, req, res, next) {
  console.error(error.stack);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
  } else {
    res.status(500).json({ message: 'Something broke!' });
  }
});

export default router;
