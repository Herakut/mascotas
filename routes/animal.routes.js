const Animal = require("../models/Animal.model");
const User = require("../models/User.model");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

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

  try {
    // crear el animal y asignar directamente el usuario como propietario
    const animal = await Animal.create({
      name: name, 
      race: race, 
      years: years, 
      description: description, 
      genre: genre,
      owner: userId // Puedes asignar directamente el ID del usuario
    });

    // Usar el método `populate` para cargar la información completa del animal
    await User.findByIdAndUpdate(userId, { $push: { animals: animal._id } }).populate('animals');
     
    res.json("animal creado");
  } catch (error) {
    next(error);
  }
});

// Ruta get para obtener los datos de un animal concreto
router.get("/:animalId/details", async (req, res, next) => {
  const { animalId } = req.params

  try {
    const animal = await Animal.findById(animalId);
    console.log(animal)
    res.json(animal)
  } catch (error) {
    next(error)
  }
})

router.put('/:animalId', async (req, res, next) => {
    const { name, years, description, profileImage } = req.body
    
    const response = await Animal.findByIdAndUpdate(req.params.animalId, {
      name,
      years, 
      description, 
      profileImage
    }, { new: true })

    res.json(response)
})

router.delete('/:animalId', async (req, res, next) => {
    const { animalId } = req.params

    await Animal.findByIdAndDelete(animalId)
    res.json("animal eliminado")
})

module.exports = router;