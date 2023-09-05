// const Animal = require("../models/Animal.model");
// const User = require("../models/User.model");
// const router = require("express").Router();

// router.post("/animal-signup/:userId", async (req, res, next) => {
//     const { name, race, years, description, genre } = req.body;
//     const userId = req.params.userId;

//     // campos llenos
//     if (!name || !race || !years || !description || !genre) {
//       res
//         .status(400)
//         .json({ errorMessage: "Todos los campos deben estar llenos" });
//       return;
//     }

//     const user = await User.findById(userId)

//     try {
//       // crear el animal
//       const animal = await Animal.create({
//         name: name, 
//         race: race, 
//         years: years, 
//         description: description, 
//         genre: genre,
//         owner: user._id
//       });

//       // Agregar el ID del perro a la lista de perros del usuario
//       user.animals.push(animal._id);
//       await user.save();

//       console.log(animal)
  
//       res.json("animal creado");
//     } catch (error) {
//       next(error);
//     }
//   });

// module.exports = router;

// -------------------------------------------------------- populate abajo, corregio.

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

router.patch('/:animalId', async (req, res, next) => {
    const { name, years, description, profileImg } = req.body
    
    const response = await Animal.findByIdAndUpdate(req.params.animalId, {
      name,
      years, 
      description, 
      profileImg
    }, { new: true })

    res.json(response)
})

router.delete('/:animalId', async (req, res, next) => {
    const { animalId } = req.params

    await Animal.findByIdAndDelete(animalId)
    res.json("animal eliminado")
})

module.exports = router;