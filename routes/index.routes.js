const router = require("express").Router();


const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);















router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes")
const userRouter = require("./user.routes")
const animalRouter = require("./animal.routes")
const commentRouter = require("./comment.routes")

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/animal", animalRouter)
router.use("/comment", commentRouter)

module.exports = router;
