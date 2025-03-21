const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cardRoutes = require("./routes/cardRoutes");
const authRoutes = require("./routes/authRoutes");
const messagesRoutes = require("./routes/messageRoutes");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const db = process.env.MONGODB_URI;

mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/api/auth", authRoutes);
app.use("/uploadImages", express.static("uploadImages"));
app.use("/api/cards", cardRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/messages", messagesRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
