const express = require("express");
const Message = require("../models/Message");
const isAdmin = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

router.post("/add", isAdmin, upload.single("image"), async (req, res) => {

  const { title, description } = req.body;
  const image = req.file.path;

  const message = new Message({ title, description, image });
  await message.save();
  res.status(201).send("Message added successfully");
});

router.put("/:id", isAdmin, upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.path : req.body.image;

  await Message.findByIdAndUpdate(req.params.id, { title, description, image });
  res.send("Message updated successfully");
});

router.delete("/:id", isAdmin, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.send("Message deleted successfully");
});

module.exports = router;
