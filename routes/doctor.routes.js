const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const doctorController = require("../controller/doctor.controller.js");
const doctorRoutes = Router();

doctorRoutes.get("/", doctorController.getAllDoctors);
doctorRoutes.get("/:doctorId", doctorController.getDoctorById);
doctorRoutes.post("/", authMiddleware, doctorController.createDoctor);
doctorRoutes.put("/:doctorId", authMiddleware, doctorController.updateDoctor);
doctorRoutes.delete("/:doctorId", authMiddleware, doctorController.deleteDoctor);

module.exports = doctorRoutes;