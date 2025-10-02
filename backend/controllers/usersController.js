const User = require("../models/User");
const bcrypt = require("bcrypt");

// LISTAR
exports.list = async (req, res) => {
  try {
    const users = await User.find({}, { senha_hash: 0, resetCodigo: 0, resetCodigoExp: 0 });
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao buscar usuários" });
  }
};

// CRIAR
exports.create = async (req, res) => {
  try {
    const { nome, email, senha, tipo, cpf, modalidade, plano } = req.body;
    if (!nome || !email) return res.status(400).json({ success: false, message: "Nome e email obrigatórios" });

    let senha_hash = senha;
    let plainPassword = senha;
    if (!senha) {
      plainPassword = Math.random().toString(36).slice(-8);
      senha_hash = await bcrypt.hash(plainPassword, 10);
    } else {
      senha_hash = await bcrypt.hash(senha, 10);
    }

    const user = await User.create({ nome, email, senha_hash, tipo, cpf, modalidade, plano });
    res.json({ success: true, message: "Usuário criado", plainPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao criar usuário" });
  }
};

// RESETAR SENHA
exports.resetPassword = async (req, res) => {
  try {
    const { novaSenha } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    let plainPassword = novaSenha;
    let senha_hash = novaSenha;
    if (!novaSenha) {
      plainPassword = Math.random().toString(36).slice(-8);
      senha_hash = await bcrypt.hash(plainPassword, 10);
    } else {
      senha_hash = await bcrypt.hash(novaSenha, 10);
    }

    user.senha_hash = senha_hash;
    await user.save();
    res.json({ success: true, message: "Senha alterada", plainPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao resetar senha" });
  }
};

// ATUALIZAR
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    await User.findByIdAndUpdate(id, updateData);
    res.json({ success: true, message: "Usuário atualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao atualizar usuário" });
  }
};

// REMOVER
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "Usuário removido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao remover usuário" });
  }
};
