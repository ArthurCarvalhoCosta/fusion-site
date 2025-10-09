// routes/users
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

router.get("/", usersController.list);
router.post("/", usersController.create);
router.post("/:id/reset-password", usersController.resetPassword);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);

router.get("/me", authMiddleware, (req, res) => {
  const { _id, nome, email, cpf, genero, avatarUrl, tipo } = req.user;
  res.json({ user: { _id, nome, email, cpf, genero, avatarUrl, tipo } });
});

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ success: false, message: "Nenhum arquivo enviado" });

    const avatarUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(id, { avatarUrl });

    res.json({ success: true, message: "Avatar atualizado", avatarUrl });
  } catch (err) {
    console.error("Erro no upload de avatar:", err);
    res.status(500).json({ success: false, message: "Erro ao enviar imagem" });
  }
});

// DELETE /api/users/:id/avatar
router.delete("/:id/avatar", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    const current = user.avatarUrl || "";
    // se apontar para /uploads/arquivo.ext -> remova o arquivo
    if (current && current.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../../", current); // ajusta caminho
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn("Não foi possível remover arquivo de avatar:", err);
        // não falhar por conta do delete do arquivo
      }
    }

    user.avatarUrl = "";
    await user.save();

    return res.json({ success: true, message: "Avatar removido" });
  } catch (err) {
    console.error("Erro ao deletar avatar:", err);
    return res.status(500).json({ success: false, message: "Erro ao remover avatar" });
  }
});


module.exports = router;
