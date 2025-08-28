// routes/auth.js
const express = require("express");
const router = express.Router();
const ClienteLogin = require("../models/ClienteLogin");
const bcrypt = require("bcrypt");

// CADASTRO
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  try {
    const usuarioExistente = await ClienteLogin.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const novoUsuario = new ClienteLogin({ nome, email, senha_hash });
    await novoUsuario.save();

    res.status(201).json({ cliente: { id: novoUsuario._id, nome, email } });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }

  try {
    const usuario = await ClienteLogin.findOne({ email });
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

    res.json({ cliente: { id: usuario._id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
});

module.exports = router;
