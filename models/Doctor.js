const mongoose = require("mongoose");
const doctorSchame = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    work: {
      type: String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clinic",
    },
  },
  { timestamps: true }
);

const Doctors = mongoose.model("doctor", doctorSchame);
module.exports = Doctors;