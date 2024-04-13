const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const clinicController = require("../controller/clinic.controller.js");
const clinicRoutes = Router();

clinicRoutes.get("/", clinicController.getAllClinics);
clinicRoutes.get("/:clinicId", clinicController.getClinicById);
clinicRoutes.post("/", authMiddleware, clinicController.createClinic);
clinicRoutes.put("/:clinicId", authMiddleware, clinicController.updateClinic);
clinicRoutes.delete("/:clinicId", authMiddleware, clinicController.deleteClinic);

module.exports = clinicRoutes;