const router = require("express").Router();
const Animal = require("../models/Animal.model");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

// const uploader=require("../middlewares/cloudinary.js")

// Perfil
router.get("/:userId/animals", async (req, res, next) => {
  const { userId } = req.params;
  const usersInfo = await User.findById(userId).populate("animals");
  res.json(usersInfo);
});

// Lista de usuarios
router.get("/users", isAuthenticated, async (req, res, next) => {
  const userInSession = req.payload; // obtener usuario en sesión

  // obtenemos todos los usuarios excepto el que está en sesión
  const users = await User.find({ _id: { $ne: userInSession._id } })
    .populate("animals")
    .populate("friends");

  console.log(users);
  res.json(users);
});

// Ruta para seguir a un usuario
router.patch("/follow/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const userInSession = req.payload; // obtener usuario en sesión

  try {
    const userFollowed = await User.findById(userId)
    const userFollowing = await User.findById(userInSession)

    // hay que hacerlo en 2 pasos, el usuario seguido tiene que guardar el que lo sigue y el que sigue tiene que guardar al seguido
    const followedResult = await User.findByIdAndUpdate(userFollowed, {
        $push: { friends: userFollowing }
    }, {
        $new: true
    })

    const followingResult = await User.findByIdAndUpdate(userFollowing, {
        $push: { friends: userFollowed },
      },
      { new: true }
    )

    console.log(followedResult)
    console.log(followingResult)

    res.status(200).json("Los usuarios se siguen");
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
});

// Ruta para dejar de seguir a un usuario
// router.patch("/unfollow/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const { loggedInUserId } = req.body;

//   try {
//     const userToUnfollow = await User.findByIdAndUpdate(
//       userId,
//       {
//         $pull: { friends: loggedInUserId },
//       },
//       { new: true }
//     );

//     if (!userToUnfollow) {
//       return res
//         .status(404)
//         .json({ message: "Usuario a dejar de seguir no encontrado" });
//     }

//     res.status(200).json({ message: "Has dejado de seguir a este usuario" });
//   } catch (error) {
//     console.error("Error al dejar de seguir al usuario:", error);
//     res.status(500).json({ message: "Error al dejar de seguir al usuario" });
//   }
// });

module.exports = router;
