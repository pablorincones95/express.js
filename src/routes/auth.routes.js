const { Router } = require("express");
const { register, login } = require("../controllers/auth.controller");
const authenticateToken = require("../middlewares/auth");

const router = Router();

router.post("/register", register);

router.post("/login", login);

module.exports = router;
