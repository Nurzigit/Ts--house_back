const express = require("express");
const Card = require("../models/Card");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadImages/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/add", async (req, res) => {
  console.log("Received data:", req.body);

  const { images, title, description, userId, price, location } = req.body; // ✅ Исправлено на images

  if (
    !images || images.length === 0 || // ✅ Проверяем, что массив изображений не пустой
    !title ||
    !description ||
    !userId ||
    !price ||
    !location ||
    !location.address ||
    !location.coordinates
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newCard = new Card({
      images, // ✅ Исправлено на images вместо image
      title,
      description,
      userId,
      price,
      location,
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send("Error fetching cards");
  }
});

// router.put('/favorite/:id', async (req, res) => {
//   try {
//     const card = await Card.findById(req.params.id);
//     if (!card) return res.status(404).send('Card not found');

//     card.isFavorite = !card.isFavorite;
//     await card.save();
//     res.status(200).json(card);
//   } catch (error) {
//     res.status(500).send('Error updating card');
//   }
// });
router.get("/:userId/favorites", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("favorites");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.favorites); // Отправляем массив карточек
  } catch (error) {
    console.error("Ошибка при загрузке избранных карточек:", error);
    res.status(500).json({ error: "Error fetching favorite cards" });
  }
});

// Обновление состояния избранного для конкретного пользователя
router.put("/favorite/:id", async (req, res) => {
  const { id: cardId } = req.params;
  const { userId } = req.body; // Теперь мы получаем userId из тела запроса

  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isFavorite = user.favorites.includes(cardId);

    if (isFavorite) {
      user.favorites.pull(cardId); // Убираем из избранного
    } else {
      user.favorites.push(cardId); // Добавляем в избранное
    }

    await user.save();
    res
      .status(200)
      .json({ message: "Favorite status updated", isFavorite: !isFavorite });
  } catch (error) {
    res.status(500).json({ error: "Error updating favorite status" });
  }
});

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploadImages/${req.file.filename}` });
});

router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Карточка не найдена");
    res.json(card);
  } catch (err) {
    res.status(500).send("Ошибка сервера");
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, { isPremium: req.body.isPremium }, { new: true });
    res.json(card);
  } catch (err) {
    res.status(500).send("Ошибка обновления");
  }
});

router.patch("/:id/view", async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: "Ошибка обновления просмотров" });
  }
});

router.patch("/:id/like", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    card.isFavorite = !card.isFavorite;
    card.likes += card.isFavorite ? 1 : -1;
    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: "Ошибка обновления лайков" });
  }
});

router.patch("/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body;
    const card = await Card.findById(req.params.id);

    // Добавляем новый рейтинг
    card.rating = (card.rating * card.views + rating) / (card.views + 1);
    
    await card.save();
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: "Ошибка установки рейтинга" });
  }
});


module.exports = router;
