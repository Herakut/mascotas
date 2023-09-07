const router = require("express").Router();
const Animal = require("../models/Animal.model");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

const uploader=require("../middlewares/cloudinary.js");
const { reset } = require("nodemon");

//Ruta para recibir imagen y subirla a Cloudinary
router.post("/upload-profile-pic", uploader.single("profilePic"), (req,res,next)=>{
//cuando recibimos la imagen
//la iamgen la pasamos a cloudinary

//cloudinary nos devuelve el url de acesso



console.log(req.file, "cloudinaryyyyyyyyyyyyyyyyyyyyyyyyy")
//buscar el usuario que esta subieno esa imagen, actualizarlo y cambiar su profilePic por el req.file.path de cloudinary
User.findByIdAndUpdate(req.session.user._id,{
  profilePic: req.file.path
})
.then(()=>{
res.redirect("/Perfil.jsx")
})
.catch((error)=>{
  next(error)
})
})






// Perfil
router.get("/:userId/animals", async (req, res, next) => {
  const { userId } = req.params;
  const usersInfo = await User.findById(userId).populate("animals");
  res.json(usersInfo);
});

router.get("/:userId/details", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("animals");
    console.log(user);
    res.json(user);
  } catch (error) {
    next(error);
  }
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
  console.log(userId, "fdasfdfffffffffffffffffffffffffffdasf");
  const userInSession = req.payload; // obtener usuario en sesión/payload/el id es necesario del agregado

  try {
    const userFollowed = await User.findById(userId);
    const userFollowing = await User.findById(userInSession);

    // hay que hacerlo en 2 pasos, el usuario seguido tiene que guardar el que lo sigue y el que sigue tiene que guardar al seguido
    const followedResult = await User.findByIdAndUpdate(
      userFollowed,
      {
        $push: { friends: userFollowing },
      },
      {
        $new: true,
      }
    );

    const followingResult = await User.findByIdAndUpdate(
      userFollowing,
      {
        $push: { friends: userFollowed },
      },
      {
        new: true,
      }
    );

    console.log(followedResult);
    console.log(followingResult);

    res.status(200).json("Los usuarios se siguen");
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
});

// Ruta para dejar de seguir a un usuario
router.patch("/unfollow/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  console.log(userId, "fdasfdfffffffffffffffffffffffffffdasf");
  const userInSession = req.payload; // obtener usuario en sesión/payload/el id es necesario del agregado

  try {
    const userUnfollowed = await User.findById(userId);
    const userUnfollowing = await User.findById(userInSession);

    // hay que hacerlo en 2 pasos, el usuario seguido tiene que guardar el que lo sigue y el que sigue tiene que guardar al seguido
    const unfollowedResult = await User.findByIdAndUpdate(userUnfollowed._id, {
      $pull: { friends: userUnfollowing._id },
    });

    const unfollowingResult = await User.findByIdAndUpdate(
      userUnfollowing._id,
      {
        $pull: { friends: userUnfollowed._id },
      }
    );

    console.log(unfollowedResult);
    console.log(unfollowingResult);

    res.status(200).json("Los usuarios se dejaron de seguir");
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
});

module.exports = router;
