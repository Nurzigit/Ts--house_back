const Card = require('../models/Card');


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


exports.toggleFavorite = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    card.isFavorite = !card.isFavorite; // Меняем статус избранного
    await card.save();

    res.status(200).json({ message: 'Favorite status updated', card });
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
