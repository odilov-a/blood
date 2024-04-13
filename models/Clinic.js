const mongoose = require("mongoose");
const clinicSchame = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Clinics = mongoose.model("clinic", clinicSchame);
module.exports = Clinics;