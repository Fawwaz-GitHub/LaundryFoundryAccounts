const { signup, login } = require("../Controllers/AuthControllers");
const { checkUser } = require("../Middlewares/AuthMiddlewares");

const router = require('express').Router();

router.post('/home',checkUser)
router.post("/signup",signup)
router.post("/login", login)

module.exports = router;
