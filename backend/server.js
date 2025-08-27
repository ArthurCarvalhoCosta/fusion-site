require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ClienteLogin = require("./models/ClienteLogin");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB conectado ✅"))
  .catch(err => console.error("Erro ao conectar MongoDB ❌", err));

app.post("/register", async (req, res) => {
  try {
    const nome = req.body.nome.trim();
    const email = req.body.email.trim().toLowerCase();
    const senha = req.body.senha;

    const clienteExistente = await ClienteLogin.findOne({ email });
    if (clienteExistente) return res.status(400).json({ erro: "Email já cadastrado!" });

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoCliente = new ClienteLogin({ nome, email, senha_hash: senhaHash });
    await novoCliente.save();

    res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const senha = req.body.senha;

    const cliente = await ClienteLogin.findOne({ email });
    if (!cliente) return res.status(400).json({ erro: "Email não encontrado!" });

    const senhaValida = await bcrypt.compare(senha, cliente.senha_hash);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta!" });

    res.json({
      mensagem: "Login realizado com sucesso!",
      cliente: { nome: cliente.nome, email: cliente.email }
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
});

app.post("/reset-password-request", async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const cliente = await ClienteLogin.findOne({ email });
    if (!cliente) return res.status(400).json({ erro: "Email não encontrado" });

    const token = crypto.randomBytes(20).toString("hex");
    cliente.resetToken = token;
    cliente.resetTokenExp = Date.now() + 30*60*1000;
    await cliente.save();

    res.json({ mensagem: "Token gerado com sucesso", token });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    const cliente = await ClienteLogin.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!cliente) return res.status(400).json({ erro: "Token inválido ou expirado" });

    const salt = await bcrypt.genSalt(10);
    cliente.senha_hash = await bcrypt.hash(novaSenha, salt);
    cliente.resetToken = undefined;
    cliente.resetTokenExp = undefined;

    await cliente.save();
    res.json({ mensagem: "Senha redefinida com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
