const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const userController = require("../controller/user.controller.js");
const userRoutes = Router();

userRoutes.get("/get-me", authMiddleware, userController.getMe);
userRoutes.put("/:userId", authMiddleware, userController.update);
userRoutes.post("/login", userController.login);
userRoutes.post("/register", userController.register);

module.exports = userRoutes;