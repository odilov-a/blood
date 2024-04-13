const mongoose = require("mongoose");
const newsSchame = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("news", newsSchame);
module.exports = News;
