const Doctors = require("../models/Doctor.js");

exports.getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const [totalDoctors, allDoctors] = await Promise.all([
      Doctors.countDocuments(),
      Doctors.find()
        .skip((page - 1) * perPage)
        .limit(perPage),
    ]);
    const totalPages = Math.ceil(totalDoctors / perPage);
    if (allDoctors.length === 0) {
      return res.status(404).json({ data: [] });
    }
    return res.json({
      data: allDoctors,
      page,
      totalPages,
      totalItems: totalDoctors,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctors.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    return res.json({ data: doctor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctors.create({
      name: req.body.name,
      work: req.body.work,
      address: req.body.address,
    });
    return res.json({ data: newDoctor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const oldDoctor = await Doctors.findById(req.params.doctorId);
    if (!oldDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const updatedDoctor = await Doctors.findByIdAndUpdate(
      req.params.doctorId,
      {
        name: req.body.name,
        work: req.body.work,
        address: req.body.address,
      },
      { new: true }
    );
    return res.json({ data: updatedDoctor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctors.findByIdAndDelete(req.params.doctorId);
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    return res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};