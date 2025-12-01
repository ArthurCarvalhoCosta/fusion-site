const express = require("express");
const router = express.Router();
const Treino = require("../models/Treino");

// GET todos os treinos
router.get("/", async (req, res) => {
  try {
    const treinos = await Treino.find().sort({ inicio: 1 });
    res.json({ treinos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar treinos" });
  }
});

// POST criar treino
router.post("/", async (req, res) => {
  try {
    const allowedFields = ["titulo","inicio","fim","modalidade","segunda","terca","quarta","quinta","sexta","sabado"];
    const data = {};
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    });

    const treino = new Treino(data);
    await treino.save();
    res.json({ success: true, treino });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao criar treino" });
  }
});

// PUT editar treino
router.put("/:id", async (req, res) => {
  try {
    const allowedFields = ["titulo","inicio","fim","modalidade","segunda","terca","quarta","quinta","sexta","sabado"];
    const updateData = {};
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const treino = await Treino.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!treino) return res.status(404).json({ success: false, message: "Treino não encontrado" });

    res.json({ success: true, treino });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao atualizar treino" });
  }
});

// DELETE treino
router.delete("/:id", async (req, res) => {
  try {
    const treino = await Treino.findByIdAndDelete(req.params.id);
    if (!treino) return res.status(404).json({ success: false, message: "Treino não encontrado" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao deletar treino" });
  }
});

module.exports = router;
