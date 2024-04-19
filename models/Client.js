const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
    },
    name: {
      type: String,
    },
    analysis: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "analysis",
    }],
  },
  { timestamps: true }
);

const Client = mongoose.model("client", clientSchema);
module.exports = Client;