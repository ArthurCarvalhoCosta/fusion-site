const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_APP || process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.log("Erro SMTP:", err);
  else console.log("Servidor SMTP pronto para enviar emails!");
});

module.exports = transporter;
