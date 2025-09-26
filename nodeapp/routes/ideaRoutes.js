const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");

router.post("/", ideaController.addIdea);
router.get("/", ideaController.getAllIdeas);
router.delete("/:id", ideaController.deleteIdea);
router.get("/validated", ideaController.getValidatedIdeas);

module.exports = router;
