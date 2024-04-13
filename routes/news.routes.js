const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const uploadMiddleware = require("../middlewares/upload.middleware.js");
const newsController = require("../controller/news.controller.js");
const newsRoutes = Router();

newsRoutes.get("/", newsController.getAllNews);
newsRoutes.get("/:newsId", newsController.getNewsById);
newsRoutes.post("/", authMiddleware, uploadMiddleware, newsController.createNews);
newsRoutes.put("/:newsId", authMiddleware, uploadMiddleware, newsController.updateNews);
newsRoutes.delete("/:newsId", authMiddleware, newsController.deleteNews);

module.exports = newsRoutes;