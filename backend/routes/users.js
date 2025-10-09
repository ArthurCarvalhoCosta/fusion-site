const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", usersController.list);
router.post("/", usersController.create);
router.post("/:id/reset-password", usersController.resetPassword);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);

router.get("/me", authMiddleware, (req, res) => {
  const { _id, nome, email, cpf, genero, avatarUrl, tipo } = req.user;
  res.json({ user: { _id, nome, email, cpf, genero, avatarUrl, tipo } });
});

module.exports = router;
