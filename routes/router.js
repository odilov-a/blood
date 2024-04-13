const { Router } = require("express");
const translationRoutes = require("./translation.routes.js");
const userRoutes = require("./user.routes.js");
const clinicRoutes = require("./clinic.routes.js");
const analysisRoutes = require("./analysis.routes.js");
const newsRoutes = require("./news.routes.js");
const doctorRoutes = require("./doctor.routes.js");
const router = Router();

router.use("/translations", translationRoutes);
router.use("/users", userRoutes);
router.use("/clinics", clinicRoutes);
router.use("/analysis", analysisRoutes);
router.use("/news", newsRoutes);
router.use("/doctors", doctorRoutes);

module.exports = router;