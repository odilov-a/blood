const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const fileMiddleware = require("../middlewares/file.middleware.js");
const analysisController = require("../controller/analysis.controller.js");
const analysisRoutes = Router();

analysisRoutes.get("/", analysisController.getAllAnalysis);
analysisRoutes.get("/:analysisId", analysisController.getAnalysisById);
analysisRoutes.get("/client/:clientId", analysisController.getClientById);
analysisRoutes.post("/", authMiddleware, fileMiddleware, analysisController.createAnalysis);
analysisRoutes.put("/client/:clientId", authMiddleware, analysisController.updateClient);
analysisRoutes.put("/:analysisId", authMiddleware, fileMiddleware, analysisController.updateAnalysis);
analysisRoutes.delete("/:analysisId", authMiddleware, analysisController.deleteAnalysis);
analysisRoutes.delete("/client/:clientId", authMiddleware, analysisController.deleteClient);

module.exports = analysisRoutes;