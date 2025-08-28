const CadastroCliente = require("../models/CadastroCliente");
const bcrypt = require("bcrypt");

// Cadastro
const cadastro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const senha_hash = await bcrypt.hash(senha, 10);

    const novoCliente = new CadastroCliente({ nome, email, senha_hash });
    await novoCliente.save();

    res.status(201).json({ msg: "Cadastro realizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await CadastroCliente.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    res.json({ msg: "Login realizado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
  }
};

module.exports = { cadastro, login };
