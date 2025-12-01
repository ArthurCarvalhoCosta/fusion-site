// routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { parse } = require("csv-parse"); // used for CSV import

// routes from controller
router.get("/", usersController.list);
router.post("/", usersController.create);
router.post("/:id/reset-password", usersController.resetPassword);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);

// authenticated "me"
router.get("/me", authMiddleware, (req, res) => {
  const { _id, nome, email, cpf, genero, avatarUrl, tipo } = req.user;
  res.json({ user: { _id, nome, email, cpf, genero, avatarUrl, tipo } });
});

/* ===========================
   UPLOADS (disk storage)
   =========================== */
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

/* avatar upload (disk) */
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

/* DELETE avatar */
router.delete("/:id/avatar", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado" });

    const current = user.avatarUrl || "";

    if (current && current.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", "..", current);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Não foi possível remover arquivo:", err);
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

/* ===========================
   FILTER endpoint (server-side)
   Usage: /api/users/filter?q=&tipo=&modalidade=&plano=
   =========================== */
router.get('/filter', async (req, res) => {
  try {
    const { q, tipo, modalidade, plano } = req.query;

    const filter = {};

    if (tipo) filter.tipo = tipo;
    if (modalidade) filter.modalidade = modalidade;
    if (plano) filter.plano = plano;

    // busca geral (nome, email, cpf, modalidade, plano)
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { nome: regex },
        { email: regex },
        { cpf: regex },
        { modalidade: regex },
        { plano: regex }
      ];
    }

    const users = await User.find(filter).sort({ nome: 1 });

    res.json({ success: true, users });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Erro ao filtrar usuários" });
  }
});

/* ===========================
   EXPORT CSV
   =========================== */
router.get('/export', async (req, res) => {
  try {
    const users = await User.find().lean();

    let csv = "nome,email,cpf,tipo,genero,modalidade,plano\n";

    users.forEach(u => {
      const safe = (v) => String(v ?? "").replace(/"/g, '""');
      csv += `"${safe(u.nome)}","${safe(u.email)}","${safe(u.cpf)}","${safe(u.tipo)}","${safe(u.genero)}","${safe(u.modalidade)}","${safe(u.plano)}"\n`;
    });

    res.setHeader("Content-Disposition", "attachment; filename=usuarios.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");

    return res.send(csv);

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Erro ao exportar CSV" });
  }
});

/* ===========================
   IMPORT CSV (memory upload)
   =========================== */
/* Use a different multer instance for memory upload to avoid re-defining variables */
const uploadMemory = multer({ storage: multer.memoryStorage() });

router.post('/import', uploadMemory.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Nenhum arquivo enviado" });
    }

    const csv = req.file.buffer.toString();

    parse(csv, {
      columns: true,
      trim: true,
      skip_empty_lines: true
    }, async (err, records) => {
      if (err) {
        console.error("CSV parse error:", err);
        return res.status(500).json({ success: false, message: "Erro ao ler CSV" });
      }

      const inserted = [];

      for (const row of records) {
        try {
          // minimal validation: require email and nome
          if (!row.email || !row.nome) continue;

          const exists = await User.findOne({ email: row.email });
          if (exists) continue;

          const newUser = new User({
            nome: row.nome,
            email: row.email,
            cpf: row.cpf ?? "",
            tipo: row.tipo ?? "Aluno",
            genero: row.genero ?? "Prefiro não dizer",
            modalidade: row.modalidade ?? "",
            plano: row.plano ?? "",
            senha_hash: "imported_placeholder" // senha provisória/placeholder
          });

          await newUser.save();
          inserted.push(newUser);
        } catch (errRow) {
          console.warn("Erro inserindo linha CSV:", errRow);
          continue;
        }
      }

      return res.json({
        success: true,
        message: "Importação concluída",
        inserted: inserted.length
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Erro ao importar CSV" });
  }
});

module.exports = router;
