// backend/controllers/usersController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

const sanitizeCPF = (cpf = "") => String(cpf).replace(/\D/g, "").slice(0, 11);

const ALLOWED_TYPES = ["Admin", "Aluno", "Personal Trainer"];
const ALLOWED_UPDATE_FIELDS = ["nome", "genero", "email", "tipo", "cpf", "modalidade", "plano"];

// LISTAR
exports.list = async (req, res) => {
  try {
    const users = await User.find({}, { senha_hash: 0, resetCodigo: 0, resetCodigoExp: 0, __v: 0 });
    return res.json({ success: true, users });
  } catch (err) {
    console.error("usersController.list:", err);
    return res.status(500).json({ success: false, message: "Erro ao buscar usuários" });
  }
};

// CRIAR
exports.create = async (req, res) => {
  try {
    let { nome, genero, email, senha, tipo, cpf, modalidade, plano } = req.body;

    if (!nome || !email) return res.status(400).json({ success: false, message: "Nome e email obrigatórios" });

    if (tipo && !ALLOWED_TYPES.includes(tipo)) return res.status(400).json({ success: false, message: "Tipo inválido" });
    tipo = tipo || "Aluno";

    cpf = sanitizeCPF(cpf);

    let plainPassword = senha || null;
    let senha_hash;
    if (!senha) {
      plainPassword = Math.random().toString(36).slice(-8);
      senha_hash = await bcrypt.hash(plainPassword, 10);
    } else {
      senha_hash = await bcrypt.hash(String(senha), 10);
    }

    const payload = { nome, genero, email: String(email).toLowerCase(), senha_hash, tipo, cpf, modalidade, plano };

    const user = await User.create(payload);

    return res.json({
      success: true,
      message: "Usuário criado",
      plainPassword,
      user: {
        id: user._id,
        nome: user.nome,
        genero: user.genero,
        email: user.email,
        tipo: user.tipo,
        cpf: user.cpf,
        modalidade: user.modalidade,
        plano: user.plano,
      },
    });
  } catch (err) {
    console.error("usersController.create:", err);
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ success: false, message: "Email já cadastrado" });
    }
    return res.status(500).json({ success: false, message: "Erro ao criar usuário" });
  }
};

// RESETAR SENHA
exports.resetPassword = async (req, res) => {
  try {
    const { novaSenha } = req.body;
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID do usuário é obrigatório" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    let plainPassword = novaSenha;
    let senha_hash;
    if (!novaSenha) {
      plainPassword = Math.random().toString(36).slice(-8);
      senha_hash = await bcrypt.hash(plainPassword, 10);
    } else {
      senha_hash = await bcrypt.hash(String(novaSenha), 10);
    }

    user.senha_hash = senha_hash;
    await user.save();

    return res.json({ success: true, message: "Senha alterada", plainPassword });
  } catch (err) {
    console.error("usersController.resetPassword:", err);
    return res.status(500).json({ success: false, message: "Erro ao resetar senha" });
  }
};

// ATUALIZAR
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID do usuário é obrigatório" });

    const incoming = req.body || {};
    const updateData = {};

    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        if (key === "cpf") updateData.cpf = sanitizeCPF(incoming.cpf);
        else if (key === "tipo") {
          if (!ALLOWED_TYPES.includes(incoming.tipo)) return res.status(400).json({ success: false, message: "Tipo inválido" });
          updateData.tipo = incoming.tipo;
        } else updateData[key] = incoming[key];
      }
    }

    if (Object.keys(updateData).length === 0) return res.status(400).json({ success: false, message: "Nenhum campo válido para atualizar" });

    await User.findByIdAndUpdate(id, updateData, { new: true });

    return res.json({ success: true, message: "Usuário atualizado" });
  } catch (err) {
    console.error("usersController.update:", err);
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ success: false, message: "Email já cadastrado" });
    }
    return res.status(500).json({ success: false, message: "Erro ao atualizar usuário" });
  }
};

// REMOVER
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID do usuário é obrigatório" });
    await User.findByIdAndDelete(id);
    return res.json({ success: true, message: "Usuário removido" });
  } catch (err) {
    console.error("usersController.remove:", err);
    return res.status(500).json({ success: false, message: "Erro ao remover usuário" });
  }
};
