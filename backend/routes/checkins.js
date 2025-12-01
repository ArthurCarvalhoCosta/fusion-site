const express = require("express");
const router = express.Router();
const Checkin = require("../models/Checkin");

// Criar um check-in
router.post("/", async (req, res) => {
  const { treinoId, userId, userName, dia } = req.body;

  if (!treinoId || !userId || !userName || !dia) {
    return res.status(400).json({ success: false, message: "Dados incompletos" });
  }

  try {
    // Verifica se o usuário já fez check-in nesse treino/dia
    const existing = await Checkin.findOne({ treinoId, userId, dia });
    if (existing) {
      return res.status(400).json({ success: false, message: "Check-in já feito nesse dia" });
    }

    const checkin = new Checkin({ treinoId, userId, userName, dia });
    await checkin.save();

    res.json({ success: true, checkin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao criar check-in" });
  }
});

// Buscar check-ins de um treino
router.get("/:treinoId", async (req, res) => {
  const { treinoId } = req.params;

  try {
    const checkins = await Checkin.find({ treinoId });
    res.json({ success: true, checkins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao buscar check-ins" });
  }
});

module.exports = router;
