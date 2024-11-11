const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, nickname, password, sex, role } = req.body;

  if (role === 'admin' && email !== 'nurzigitturman@gmail.com') {
    return res.status(403).send('Недостаточно прав для регистрации как admin');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    nickname,
    password: hashedPassword,
    sex,
    role, 
  });

  await user.save();
  res.status(201).send('User registered');
});

module.exports = router;
