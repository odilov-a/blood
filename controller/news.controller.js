const News = require("../models/News.js");

exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const [totalNews, allNews] = await Promise.all([
      News.countDocuments(),
      News.find()
        .skip((page - 1) * perPage)
        .limit(perPage),
    ]);
    const totalPages = Math.ceil(totalNews / perPage);
    if (allNews.length === 0) {
      return res.status(404).json({ data: [] });
    }
    return res.json({
      data: allNews,
      page,
      totalPages,
      totalItems: totalNews,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    return res.json({ data: news });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    req.body.image = req.images;
    const newNews = await News.create({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
    });
    return res.json({ data: newNews });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const oldNews = await News.findById(req.params.newsId);
    if (!oldNews) {
      return res.status(404).json({ message: "News not found" });
    }
    req.body.image = req.images;
    const updatedNews = await News.findByIdAndUpdate(
      req.params.newsId,
      {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
      },
      { new: true }
    );
    return res.json({ data: updatedNews });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.newsId);
    if (!deletedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    return res.json({ message: "News deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
