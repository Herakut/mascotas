
const router = require("express").Router();
const Animal = require("../models/Animal.model");
const User = require("../models/User.model");


router.get('/user/:userId', async (req, res, next) => {

    const { userId } = req.params;

    const userFound = await User.findById(userId)

    console.log(userFound)
})

router.get('/:userId/animals', async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    const animals = await Animal.find({ owner: userId });

    res.json(animals);
})

module.exports = router