const mongoose = require("mongoose");
const analysisSchame = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    analysisType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: Array, 
      required: true,
    },
  },
  { timestamps: true }
);

const Analysis = mongoose.model("analysis", analysisSchame);
module.exports = Analysis;