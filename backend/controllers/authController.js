// authControllers
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, senha, userType } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: "Preencha email e senha",
      });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    if (userType && user.tipo !== userType) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado para este tipo de usuário: ${user.tipo}`,
      });
    }

    const senhaValida = await bcrypt.compare(String(senha), String(user.senha_hash));
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Configuração do servidor inválida (JWT_SECRET ausente)",
      });
    }

    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      secret,
      { expiresIn: "1h" }
    );

    const { senha_hash, resetCodigo, resetCodigoExp, ...safeUser } = user;

    const defaultAvatar = "/assets/img/avatar.png"; 

    res.json({
      success: true,
      message: "Login realizado",
      cliente: {
        id: user._id,
        nome: user.nome,
        genero: user.genero,
        email: user.email,
        tipo: user.tipo,
        cpf: user.cpf || "",
        modalidade: user.modalidade || "",
        plano: user.plano || "",
        avatarUrl: user.avatarUrl && user.avatarUrl.trim() !== ""
          ? user.avatarUrl
          : defaultAvatar,
      },
      token,
    });

  } catch (err) {
    console.error("auth.login erro:", err);
    res.status(500).json({
      success: false,
      message: "Erro interno no servidor",
    });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  return res.json({ success: true, message: "Logout realizado" });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Informe o email" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "Email não cadastrado" });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = 15;

    user.resetCodigo = codigo;
    user.resetCodigoExp = Date.now() + expiryMinutes * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || ''}/reset-password?email=${encodeURIComponent(email)}&codigo=${codigo}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || "Fusion Site"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Redefinição de senha",
      text: `Olá ${user.nome || ""},\n\nSeu código de recuperação é: ${codigo}\nExpira em ${expiryMinutes} minutos.\n\nSe você não solicitou, ignore este e-mail.\n\nEquipe ${process.env.EMAIL_SENDER_NAME || "Fusion Site"}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Redefinição de senha</h2>
          <p>Olá <strong>${user.nome || ""}</strong>,</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
          <p style="font-size: 1.2rem;">Código de recuperação: <strong>${codigo}</strong></p>
          <p>Este código expira em <strong>${expiryMinutes} minutos</strong> e só pode ser usado uma vez.</p>
          <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
          <p>Atenciosamente,<br/>Equipe ${process.env.EMAIL_SENDER_NAME || "Fusion Site"}</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV !== "production") console.log(`[auth.forgotPassword] código para ${email}: ${codigo}`);
    } catch (mailErr) {
      console.error("auth.forgotPassword - erro ao enviar email:", mailErr);
      return res.status(500).json({ success: false, message: "Falha ao enviar o email. Tente novamente mais tarde." });
    }

    return res.json({ success: true, message: "Código enviado para o e-mail" });
  } catch (err) {
    console.error("auth.forgotPassword erro:", err);
    return res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};

// POST /api/auth/reset-password
// if novaSenha absent -> validate only
exports.resetPassword = async (req, res) => {
  try {
    const { email, codigo, novaSenha } = req.body;
    if (!email || !codigo) return res.status(400).json({ success: false, message: "Dados incompletos" });

    const user = await User.findOne({ email: String(email).toLowerCase(), resetCodigo: codigo, resetCodigoExp: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Código inválido ou expirado" });

    if (!novaSenha) return res.json({ success: true, message: "Código válido" });

    user.senha_hash = await bcrypt.hash(String(novaSenha), 10);
    user.resetCodigo = undefined;
    user.resetCodigoExp = undefined;
    await user.save();

    res.json({ success: true, message: "Senha alterada com sucesso" });
  } catch (err) {
    console.error("auth.resetPassword erro:", err);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};
