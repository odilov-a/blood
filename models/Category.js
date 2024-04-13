const mongoose = require("mongoose");
const categorySchame = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchame);
module.exports = Category;