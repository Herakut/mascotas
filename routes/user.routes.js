
const router = require("express").Router();
const Animal = require("../models/Animal.model");
const User = require("../models/User.model");

const uploader=require("../middlewares/cloudinary.js")


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


//

router.post("/upload-profile-pic",uploader.single("profilePic"), (req,res,next)=>{

    console.log(req.body)
    User.findByIdAndUpdate(req.session.user._id,{
        profilePic: req.file.path 
    })
    .then(()=>{
        res.redirect("/user")
    })
    .catch(()=>{
        next(error)
    })

    

})






module.exports = router