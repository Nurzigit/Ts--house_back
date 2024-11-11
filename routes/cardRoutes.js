const express = require('express');
const Card = require('../models/Card');
const router = express.Router();


router.post('/add', async (req, res) => {
  const { image, title, description, userId } = req.body;

  const newCard = new Card({
    image,
    title,
    description,
    userId,
  });

  try {
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).send('Error creating card');
  }
});


router.get('/all', async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send('Error fetching cards');
  }
});


router.put('/favorite/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send('Card not found');

    card.isFavorite = !card.isFavorite;
    await card.save();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).send('Error updating card');
  }
});


// Обновление состояния избранного для конкретного пользователя
router.put('/favorite/:cardId', async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id; // Получаем идентификатор пользователя из токена

  try {
    // Проверяем, существует ли карточка
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).send('Card not found');

    // Находим пользователя
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Проверяем, добавлена ли карточка в избранное у пользователя
    const isFavorite = user.favorites.includes(cardId);

    if (isFavorite) {
      // Убираем карточку из избранного
      user.favorites.pull(cardId);
    } else {
      // Добавляем карточку в избранное
      user.favorites.push(cardId);
    }

    await user.save();
    res.status(200).json({ message: 'Favorite status updated', isFavorite: !isFavorite });
  } catch (error) {
    res.status(500).send('Error updating favorite status');
  }
});



module.exports = router;
