const router = require("express").Router();
const User = require("../models/User.model");
const Comment = require("../models/Comment.model")
const isAuthenticated = require("../middlewares/isAuthenticated");

// POST "/api/todo" => recibir data para crear un nuevo Todo
router.post("/comment", async (req, res, next) => {
  try {
    const { ownerId, animalId, text } = req.body;

    // 2. crear el Todo
    await Comment.create({
      owner: ownerId,
      animal: animalId,
      text: text,
    });

    res.json("Comentario creado");
  } catch (error) {
    next(error);
  }
});

router.get("/:userId/comments", async (req, res, next) => {
    const { userId } = req.params

    const comments =  await Comment.find({ owner: userId })

    res.json(comments)
})

module.exports = router;
