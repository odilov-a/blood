const mongoose = require("mongoose");
const analysisSchame = new mongoose.Schema(
  {
    number: {
      type: Number,
    },
    name: {
      type: String,
    },
    analysisType: {
      type: String,
    },
    fileUrl: {
      type: Array, 
    },
  },
  { timestamps: true }
);

const Analysis = mongoose.model("analysis", analysisSchame);
module.exports = Analysis;