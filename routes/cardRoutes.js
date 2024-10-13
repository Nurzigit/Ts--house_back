const express = require('express');
const { createCard, getUserCards, toggleFavorite, deleteCard } = require('../controllers/cardController');
const authMiddleware = require('../middleware/auth'); // Middleware для проверки токена
const router = express.Router();

// POST /cards - Создание новой карточки
router.post('/cards', authMiddleware, createCard);

// GET /cards - Получение всех карточек пользователя
router.get('/cards', authMiddleware, getUserCards);

// PUT /cards/favorite/:cardId - Обновление статуса избранного
router.put('/cards/favorite/:cardId', authMiddleware, toggleFavorite);

// DELETE /cards/:cardId - Удаление карточки
router.delete('/cards/:cardId', authMiddleware, deleteCard);

module.exports = router;
