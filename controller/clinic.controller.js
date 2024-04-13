const Clinics = require("../models/Clinic.js");

exports.getAllClinics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const [totalClinics, allClinics] = await Promise.all([
      Clinics.countDocuments(),
      Clinics.find()
        .skip((page - 1) * perPage)
        .limit(perPage),
    ]);
    const totalPages = Math.ceil(totalClinics / perPage);
    if (allClinics.length === 0) {
      return res.status(404).json({ data: [] });
    }
    return res.json({
      data: allClinics,
      page,
      totalPages,
      totalItems: totalClinics,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getClinicById = async (req, res) => {
  try {
    const clinic = await Clinics.findById(req.params.clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinics not found" });
    }
    return res.json({ data: clinic });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createClinic = async (req, res) => {
  try {
    const newClinic = await Clinics.create({
      name: req.body.name,
      location: req.body.location,
    });
    return res.json({ data: newClinic });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateClinic = async (req, res) => {
  try {
    const oldClinic = await Clinics.findById(req.params.clinicId);
    if (!oldClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    const updatedClinic = await Clinics.findByIdAndUpdate(
      req.params.clinicId,
      {
        name: req.body.name,
        location: req.body.location,
      },
      { new: true }
    );
    return res.json({ data: updatedClinic });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteClinic = async (req, res) => {
  try {
    const deletedClinic = await Clinics.findByIdAndDelete(req.params.clinicId);
    if (!deletedClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    return res.json({ message: "Clinic deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};