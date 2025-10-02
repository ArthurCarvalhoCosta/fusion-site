// backend/controllers/authController.js
const User = require("../models/User"); // novo model (users.js)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailer"); // ajuste path se necessário

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, senha, userType } = req.body;
    if (!email || !senha) return res.status(400).json({ success: false, message: "Preencha email e senha" });

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    // Verifica tipo de usuário
    if (user.tipo !== userType) {
      return res.status(403).json({ success: false, message: `Acesso negado para este tipo de usuário: ${user.tipo}` });
    }

    const senhaValida = await bcrypt.compare(String(senha), String(user.senha_hash));
    if (!senhaValida) return res.status(401).json({ success: false, message: "Senha incorreta" });

    const token = jwt.sign({ id: user._id, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const { senha_hash, resetCodigo, resetCodigoExp, ...safeUser } = user;
    res.json({ success: true, message: "Login realizado", cliente: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};


// RECEBER CODIGO
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Informe o email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email não cadastrado" });

    // gera código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = 15;

    user.resetCodigo = codigo;
    user.resetCodigoExp = Date.now() + expiryMinutes * 60 * 1000; // 15 minutos
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&codigo=${codigo}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || "Fusion Site"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Redefinição de senha",
      text: `Olá ${user.nome || ""},

        Recebemos uma solicitação para redefinir a senha da sua conta.

        Seu código de recuperação é: ${codigo}
        Expira em ${expiryMinutes} minutos.

        Se você não solicitou, ignore este e-mail.

        Equipe ${process.env.EMAIL_SENDER_NAME || "Fusion Site"}
        `,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Redefinição de senha</h2>
          <p>Olá <strong>${user.nome || ""}</strong>,</p>
          <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
          <p style="font-size: 1.2rem;">Código de recuperação: <strong>${codigo}</strong></p>
          <p>Este código expira em <strong>${expiryMinutes} minutos</strong> e só pode ser usado uma vez.</p>
          <p>Se você não solicitou esta alteração, simplesmente ignore este e-mail.</p>
          <p>Atenciosamente,<br/>Equipe ${process.env.EMAIL_SENDER_NAME || "Fusion Site"}</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[auth.forgotPassword] código para ${email}: ${codigo}`);
      }
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

// RESET DE SENHA
exports.resetPassword = async (req, res) => {
  try {
    const { email, codigo, novaSenha } = req.body;
    if (!email || !codigo) return res.status(400).json({ success: false, message: "Dados incompletos" });

    const user = await User.findOne({ email, resetCodigo: codigo, resetCodigoExp: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Código inválido ou expirado" });

    if (!novaSenha) return res.json({ success: true, message: "Código válido" });

    user.senha_hash = await bcrypt.hash(String(novaSenha), 10);
    user.resetCodigo = undefined;
    user.resetCodigoExp = undefined;
    await user.save();

    res.json({ success: true, message: "Senha alterada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};
