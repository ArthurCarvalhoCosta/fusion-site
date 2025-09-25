const express = require("express");
const router = express.Router();
const { cadastro, login, forgotPassword, resetPassword } = require("../controllers/authController");

router.post("/register", cadastro);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
