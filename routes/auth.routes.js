const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User.model.js");

// RUTA DE REACT
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  // 1. validaciones.
  // - los campos llenos
  // - que nombre tenga un formato especifico
  // - que la constraseña o email tenga un formato especifico
  // - que el usuario no esté repetido

  if (username === "" || email === "" || password === "") {
    res.status(400).json({
      errorMessage: "Todos los campos deben estar llenos",
    });
    return; // detener la ejecucion de la ruta
  }

  // Validación para comprobar que la contraseña cumple unos requisitos
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\/\\])(?=.{8,})/gm;
  if (regexPassword.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "La contraseña debe tener al menos una mayúscula, una minúscula, un caracter especial y tener 8 caracteres o más",
    });
    return;
  }

  // ECHAR UN OJO PARA HACERLO EN REACT
  // Creación del usuario
  try {
    // Validacion para comprobar que el usuario no está duplicado
    const foundUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (foundUser !== null) {
      res.status(400).json({
        errorMessage:
          "Ya existe un usuario con ese nombre de usuario o correo electronico",
      });
      return;
    }

    // Cifrado de la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      email: email,
      password: passwordHash,
    });

    return res.status(200)
    // res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

// SE HACE EN REACT
// GET "/auth/login" => renderiza al usuario un formulario de acceso
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST "/auth/login" => recibir las credenciales del usuario y validarlo/autenticarlo
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // PASAR A REACT
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      res.status(400).json({
        errorMessage: "Usuario no existe con ese correo",
      });
      return; // detener la ejecucion de la ruta
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (isPasswordCorrect === false) {
      res.status(400).json({
        errorMessage: "Contraseña no valida",
      });
      return; // detener la ejecucion de la ruta
    }

    req.session.user = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };

    // PASAR A REACT
    req.session.save(() => {
      // Si todo sale bien...
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});

// PASAR A REACT
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});







module.exports = router;


