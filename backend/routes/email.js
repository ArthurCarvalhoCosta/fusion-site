const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS_APP,
      },
    });

    await transporter.sendMail({
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject,
    html: `
        <h2>Nova mensagem recebida pelo site</h2>
        <p><strong>Email do remetente:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
    `
    });

    res.json({ message: "Email enviado com sucesso!" });

  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar o e-mail." });
  }
});

module.exports = router;
