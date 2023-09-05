const router = require("express").Router();
const Animal = require("../models/Animal.model");
const User = require("../models/User.model");

const uploader=require("../middlewares/cloudinary.js")



// Perfil
// router.get("/user/:userId", async (req, res, next) => {
//   const { userId } = req.params;

//   const userFound = await User.findById(userId).populate("animals");

//   console.log(userFound);
// });

router.get("/:userId/animals", async (req, res, next) => {
  const { userId } = req.params;

  // const user = await User.findById(userId);

  const usersInfo = await  User.findById(userId).populate("animals");


  res.json(usersInfo);
});
// Lista de usuarios
router.get("/users", async (req, res, next) => {
  const users = await User.find().populate("animals").populate("friends");

  res.json(users);
});

// Ruta para seguir a un usuario
router.patch("/follow/:userId", async (req, res) => {
  const { userId } = req.params;
  const { loggedInUserId } = req.body;
  console.log(loggedInUserId,"holaaa")

  try {
    const userToFollow = await User.findByIdAndUpdate(
      userId,
      {
        $push: { friends: loggedInUserId },
      },
      { new: true }
    );

    if (!userToFollow) {
      return res
        .status(404)
        .json({ message: "Usuario a seguir no encontrado" });
    }

    res.status(200).json({ message: "Ahora sigues a este usuario" });
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
});

// Ruta para dejar de seguir a un usuario
router.patch("/unfollow/:userId", async (req, res) => {
  const { userId } = req.params;
  const { loggedInUserId } = req.body;

  try {
    const userToUnfollow = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { friends: loggedInUserId },
      },
      { new: true }
    );

    if (!userToUnfollow) {
      return res
        .status(404)
        .json({ message: "Usuario a dejar de seguir no encontrado" });
    }

    res.status(200).json({ message: "Has dejado de seguir a este usuario" });
  } catch (error) {
    console.error("Error al dejar de seguir al usuario:", error);
    res.status(500).json({ message: "Error al dejar de seguir al usuario" });
  }
});

module.exports = router;
