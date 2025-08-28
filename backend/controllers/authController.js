const Cliente = require("../models/Cliente");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Cadastro
const cadastro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
      return res.status(400).json({ success: false, message: "Preencha todos os campos" });

    const usuarioExistente = await Cliente.findOne({ email });
    if (usuarioExistente)
      return res.status(400).json({ success: false, message: "Email já cadastrado" });

    const senha_hash = await bcrypt.hash(senha, 10);
    const novoCliente = new Cliente({ nome, email, senha_hash });
    await novoCliente.save();

    res.status(201).json({ success: true, message: "Cadastro realizado com sucesso", cliente: { id: novoCliente._id, nome, email } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro no servidor", detalhe: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res.status(400).json({ success: false, message: "Preencha todos os campos" });

    const usuario = await Cliente.findOne({ email });
    if (!usuario) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) return res.status(401).json({ success: false, message: "Senha incorreta" });

    // Gera JWT (expira em 1h)
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      cliente: { id: usuario._id, nome: usuario.nome, email: usuario.email },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro no servidor", detalhe: err.message });
  }
};

// Gerar token de reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Informe o email" });

    const usuario = await Cliente.findOne({ email });
    if (!usuario) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    // Gera token aleatório
    const token = crypto.randomBytes(20).toString("hex");
    usuario.resetToken = token;
    usuario.resetTokenExp = Date.now() + 3600000; // 1 hora
    await usuario.save();

    // Aqui você enviaria o email com link: /reset-password/<token>
    res.json({ success: true, message: "Link de recuperação enviado (simulado)", token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro no servidor", detalhe: err.message });
  }
};

// Reset de senha
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { novaSenha } = req.body;

    const usuario = await Cliente.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!usuario) return res.status(400).json({ success: false, message: "Token inválido ou expirado" });

    usuario.senha_hash = await bcrypt.hash(novaSenha, 10);
    usuario.resetToken = undefined;
    usuario.resetTokenExp = undefined;

    await usuario.save();
    res.json({ success: true, message: "Senha redefinida com sucesso" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro no servidor", detalhe: err.message });
  }
};

// Listar todos os usuários (apenas para teste)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Cliente.find().select("-senha_hash -resetToken -resetTokenExp"); 
    // remove campos sensíveis
    res.json({ success: true, usuarios });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erro ao buscar usuários", detalhe: err.message });
  }
};

module.exports = { cadastro, login, forgotPassword, resetPassword, listarUsuarios };
