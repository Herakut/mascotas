const Animal = require("../models/Animal.model");
const User = require("../models/User.model");
const router = require("express").Router();

// Ruta post "/api/auth/signup" => registrar al usuari
router.post("/animal-signup/:userId", async (req, res, next) => {
    const { name, race, years, description, genre } = req.body;
    const userId = req.params.userId;

    // campos llenos
    if (!name || !race || !years || !description || !genre) {
      res
        .status(400)
        .json({ errorMessage: "Todos los campos deben estar llenos" });
      return;
    }

    const user = await User.findById(userId)

    try {
      // crear el animal
      const animal = await Animal.create({
        name: name, 
        race: race, 
        years: years, 
        description: description, 
        genre: genre,
        owner: user._id
      });

      // Agregar el ID del perro a la lista de perros del usuario
      user.animals.push(animal._id);
      await user.save();

      console.log(animal)
  
      res.json("animal creado");
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
