const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.list);
router.post("/", usersController.create);
router.post("/:id/reset-password", usersController.resetPassword);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);

module.exports = router;
