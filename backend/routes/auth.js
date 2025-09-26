const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.cadastro);
router.post("/login", authController.login);
router.post("/recuperar-senha", authController.enviarCodigo);
router.post("/reset-senha", authController.resetComCodigo);

module.exports = router;
