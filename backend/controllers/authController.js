const Cliente = require("../models/Cliente");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../utils/mailer");

// Cadastro
exports.cadastro = async (req, res) => {
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

    res.status(201).json({
      success: true,
      message: "Cadastro realizado com sucesso",
      cliente: { id: novoCliente._id, nome, email }
    });
  } catch (err) {
    console.error("[CADASTRO] erro:", err);
    res.status(500).json({ success: false, message: "Erro no servidor", detalhe: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ success: false, message: "Preencha email e senha" });
    }

    const usuario = await Cliente.findOne({ email }).lean();
    if (!usuario) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    const senhaHashFromDb = usuario.senha_hash ?? usuario.senha ?? usuario.password;
    if (!senhaHashFromDb) {
      console.error("[LOGIN] usuário sem campo de senha esperado. Usuário:", usuario);
      return res.status(500).json({ success: false, message: "Erro interno: credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(String(senha), String(senhaHashFromDb));
    if (!senhaValida) {
      return res.status(401).json({ success: false, message: "Senha incorreta" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("[LOGIN] JWT_SECRET não definido no .env");
      return res.status(500).json({ success: false, message: "Erro do servidor: configuração inválida" });
    }

    const token = jwt.sign({ id: usuario._id, role: usuario.role ?? "user" }, secret, { expiresIn: "1h" });

    const {
      senha_hash,
      password,
      resetCodigo,
      resetCodigoExp,
      resetToken,
      resetTokenExp,
      ...safeUser
    } = usuario;

    return res.json({ success: true, message: "Login realizado com sucesso", cliente: safeUser, token });
  } catch (err) {
    console.error("[LOGIN] erro:", err);
    return res.status(500).json({ success: false, message: "Erro no servidor", detalhe: err.message });
  }
};

// Enviar código de 6 dígitos
exports.enviarCodigo = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Informe o email" });

    const cliente = await Cliente.findOne({ email });
    if (!cliente) return res.status(404).json({ success: false, message: "Email não cadastrado" });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    cliente.resetCodigo = codigo;
    cliente.resetCodigoExp = Date.now() + 15 * 60 * 1000; // 15 minutos
    await cliente.save();

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || "Fusion Site"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de recuperação de senha",
      text: `Seu código de recuperação é: ${codigo}. Válido por 15 minutos.`,
      html: `<p>Seu código de recuperação é: <b>${codigo}</b></p><p>Válido por 15 minutos.</p>`,
    };

    await transporter.sendMail(mailOptions); // pode lançar erro se mailer não configurado

    // log em dev para facilitar
    console.log(`[ENVIAR-CODIGO] código para ${email}: ${codigo}`);

    return res.json({ success: true, message: "Código enviado para o e-mail" });
  } catch (err) {
    console.error("enviarCodigo:", err);
    return res.status(500).json({ success: false, message: "Erro ao enviar código" });
  }
};

// Resetar senha usando código — suporta "validação only" quando novaSenha estiver ausente/''.
exports.resetComCodigo = async (req, res) => {
  try {
    const { email, codigo, novaSenha } = req.body;
    if (!email || !codigo) return res.status(400).json({ success: false, message: "Dados incompletos" });

    // busca cliente com código não expirado
    const cliente = await Cliente.findOne({
      email,
      resetCodigo: codigo,
      resetCodigoExp: { $gt: Date.now() }
    });

    if (!cliente) return res.status(400).json({ success: false, message: "Código inválido ou expirado" });

    // Se novaSenha não foi informada (ou vazia), apenas validamos o código
    if (!novaSenha) {
      return res.json({ success: true, message: "Código válido" });
    }

    // Se novaSenha presente, atualiza senha
    cliente.senha_hash = await bcrypt.hash(novaSenha, 10);
    cliente.resetCodigo = undefined;
    cliente.resetCodigoExp = undefined;
    await cliente.save();

    return res.json({ success: true, message: "Senha alterada com sucesso" });
  } catch (err) {
    console.error("resetComCodigo:", err);
    return res.status(500).json({ success: false, message: "Erro ao alterar senha" });
  }
};
