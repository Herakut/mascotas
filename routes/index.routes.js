const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
const userRouter = require("./user.routes")
const animalRouter = require("./animal.routes")

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/animal", animalRouter)

module.exports = router;
