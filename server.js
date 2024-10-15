const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cardRoutes = require('./routes/cardRoutes');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const db = process.env.MONGODB_URI


mongoose.connect(db)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


app.post('/api/auth/register', async (req, res) => {
  const { email, nickname, password, sex, role } = req.body;


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User with this email already exists');
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  const newUser = new User({
    email,
    nickname,
    password: hashedPassword,
    sex,
    role
  });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});


app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({ token, user });
});


app.get('/api/main', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    res.status(200).send('Welcome to the main page');
  } catch (err) {
    res.status(400).send('Invalid token');
  }
});



app.use('/api/cards', cardRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
