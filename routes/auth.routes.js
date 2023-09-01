const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

const jwt = require("jsonwebtoken");

// Ruta post "/api/auth/signup" => registrar al usuari
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  // 1. validaciones
  // que tenga el nombre un formato especifico
  // con la contraseña y el email igual
  // que el usuario no este repetido

  // campos llenos
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ errorMessage: "Todos los campos deben estar llenos" });
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
    console.log(foundUser);
    if (foundUser === null) {
      res
        .status(400)
        .json({ errorMessage: "Usuario no registrado" });
      return;
    }

    // contraseña correcta
    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    console.log(isPasswordValid)
    if (isPasswordValid === false) {
        res
          .status(400)
          .json({ errorMessage: "Contraseña incorrecta" });
        return;
      }

    // crear la sesion
    // en el payload agregamos info que no deberia cambiar
    const payload = {
        _id: foundUser._id,
        email: foundUser.email,
    }

    const authToken = jwt.sign()

  } catch (error) {
    next(error);
  }

  res.json("probando acceso a la ruta");
});

// GET "/api/auth/verify" => indicar al FE que el usuario esta activo.

module.exports = router;

// --------------------------------------------------------------------------- Antiguo

// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");

// const User = require("../models/User.model.js");

// // RUTA DE REACT
// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup.hbs");
// });

// router.post("/signup", async (req, res, next) => {
//   const { username, email, password } = req.body;

//   // 1. validaciones.
//   // - los campos llenos
//   // - que nombre tenga un formato especifico
//   // - que la constraseña o email tenga un formato especifico
//   // - que el usuario no esté repetido

//   if (username === "" || email === "" || password === "") {
//     res.status(400).json({
//       errorMessage: "Todos los campos deben estar llenos",
//     });
//     return; // detener la ejecucion de la ruta
//   }

//   // Validación para comprobar que la contraseña cumple unos requisitos
//   const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\/\\])(?=.{8,})/gm;
//   if (regexPassword.test(password) === false) {
//     res.status(400).json({
//       errorMessage:
//         "La contraseña debe tener al menos una mayúscula, una minúscula, un caracter especial y tener 8 caracteres o más",
//     });
//     return;
//   }

//   // ECHAR UN OJO PARA HACERLO EN REACT
//   // Creación del usuario
//   try {
//     // Validacion para comprobar que el usuario no está duplicado
//     const foundUser = await User.findOne({
//       $or: [{ email: email }, { username: username }],
//     });
//     if (foundUser !== null) {
//       res.status(400).json({
//         errorMessage:
//           "Ya existe un usuario con ese nombre de usuario o correo electronico",
//       });
//       return;
//     }

//     // Cifrado de la contraseña
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     await User.create({
//       username: username,
//       email: email,
//       password: passwordHash,
//     });

//     return res.status(200)
//     // res.redirect("/auth/login");
//   } catch (error) {
//     next(error);
//   }
// });

// // SE HACE EN REACT
// // GET "/auth/login" => renderiza al usuario un formulario de acceso
// router.get("/login", (req, res, next) => {
//   res.render("auth/login.hbs");
// });

// // POST "/auth/login" => recibir las credenciales del usuario y validarlo/autenticarlo
// router.post("/login", async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     // PASAR A REACT
//     const foundUser = await User.findOne({ email: email });
//     if (foundUser === null) {
//       res.status(400).json({
//         errorMessage: "Usuario no existe con ese correo",
//       });
//       return; // detener la ejecucion de la ruta
//     }

//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       foundUser.password
//     );

//     if (isPasswordCorrect === false) {
//       res.status(400).json({
//         errorMessage: "Contraseña no valida",
//       });
//       return; // detener la ejecucion de la ruta
//     }

//     req.session.user = {
//       _id: foundUser._id,
//       email: foundUser.email,
//       role: foundUser.role,
//     };

//     // PASAR A REACT
//     req.session.save(() => {
//       // Si todo sale bien...
//       res.redirect("/");
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // PASAR A REACT
// router.get("/logout", isLoggedIn, (req, res, next) => {
//   req.session.destroy(() => {
//     res.redirect("/");
//   });
// });

module.exports = router;
