const express = require("express");
const router = express.Router();
const { cadastro, login, forgotPassword, resetPassword } = require("../controllers/authController");
const { listarUsuarios } = require("../controllers/authController");

// Cadastro
router.post("/register", cadastro);

// Login
router.post("/login", login);

// Esqueci senha
router.post("/forgot-password", forgotPassword);

// Reset de senha
router.post("/reset-password/:token", resetPassword);

// Rota de teste - listar todos os usuários
router.get("/usuarios", listarUsuarios);

module.exports = router;
