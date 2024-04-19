const mongoose = require("mongoose");
const analysisSchame = new mongoose.Schema(
  {
    analysisType: {
      type: String,
    },
    fileUrl: {
      type: String, 
    },
    fileLink: {
      type: String,
    },
  },
  { timestamps: true }
);

const Analysis = mongoose.model("analysis", analysisSchame);
module.exports = Analysis;