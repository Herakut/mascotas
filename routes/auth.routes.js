const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Ruta post "/api/auth/user-signup" => registrar al usuario
router.post("/user-signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  // campos llenos
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ errorMessage: "Todos los campos deben estar llenos" });
    return;
  }

  // Validación para comprobar que la contraseña cumple unos requisitos
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\/\\])(?=.{8,})/gm;
  if (regexPassword.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "La contraseña debe tener al menos una mayúscula, una minúscula, un caracter especial y tener 8 caracteres o más",
    });
    return;
  }

  try {
    // encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(hashPassword);

    // crear el usuario
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.json("usuario creado");
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => validar credenciales, crear sesion...
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  // 1 Todas las validaciones

  try {
    // Existencia del usuario
    const foundUser = await User.findOne({ email });
    // console.log(foundUser);
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "Usuario no registrado" });
      return;
    }

    // contraseña correcta
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    // console.log(isPasswordValid)
    if (isPasswordValid === false) {
      res.status(400).json({ errorMessage: "Contraseña incorrecta" });
      return;
    }

    // crear la sesion
    // en el payload agregamos info que no deberia cambiar
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
      profileImg: foundUser.profileImg,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "5d",
    });

    res.json({ authToken });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => indicar al FE que el usuario esta activo.

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log(req.payload);
  res.json(req.payload);
});

module.exports = router;