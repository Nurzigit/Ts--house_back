const Card = require('../models/Card');
const User = require('../models/User');

exports.createCard = async (req, res) => {
  const { title, description, image, date, time } = req.body;
  const userId = req.user._id;

  try {
    const newCard = new Card({
      title,
      description,
      image,
      date,
      time,
      userId,
    });

    await newCard.save();
    res.status(201).json({ message: 'Card created successfully', card: newCard });
  } catch (error) {
    res.status(500).json({ message: 'Error creating card', error });
  }
};


exports.getUserCards = async (req, res) => {
  const userId = req.user._id;

  try {
    const cards = await Card.find({ userId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error });
  }
};


// exports.toggleFavorite = async (req, res) => {
//   const { cardId } = req.params;

//   try {
//     const card = await Card.findById(cardId);
//     if (!card) {
//       return res.status(404).json({ message: 'Card not found' });
//     }

//     card.isFavorite = !card.isFavorite; // Меняем статус избранного
//     await card.save();

//     res.status(200).json({ message: 'Favorite status updated', card });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating favorite status', error });
//   }
// };


exports.toggleFavorite = async (req, res) => {
  const { userId, cardId } = req.body; // Получаем userId (идентификатор пользователя) и cardId (идентификатор карточки)

  try {
    // Получаем пользователя по ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Проверяем, существует ли карточка
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Если карточка уже в избранном, удаляем её, если нет — добавляем
    if (user.favorites.includes(cardId)) {
      user.favorites.pull(cardId);  // Убираем карточку из избранного
    } else {
      user.favorites.push(cardId);  // Добавляем карточку в избранное
    }

    await user.save();  // Сохраняем изменения в базе данных

    res.status(200).json({ message: 'Favorite status updated', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorite status', error });
  }
};

exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error });
  }
};


exports.updateFavorite = async (req, res) => {
  const { userId, cardId } = req.body;

  try {
    // Находим карточку, принадлежащую конкретному пользователю
    const card = await Card.findOne({ _id: cardId, userId: userId });

    if (!card) {
      return res.status(404).json({ message: 'Card not found or not belonging to the user' });
    }

    // Меняем состояние isFavorite
    card.isFavorite = !card.isFavorite;
    await card.save();

    // Отправляем обновленную карточку обратно
    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server errors' });
  }
};
