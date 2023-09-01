
const router = require("express").Router();
const User = require("../models/User.model");


router.get('/user/:userId', async (req, res, next) => {

    const { userId } = req.params;

    const userFound = await User.findById(userId)

    console.log(userFound)
})

module.exports = router