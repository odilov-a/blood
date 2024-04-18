const Analysis = require("../models/Analysis.js");

exports.getAllAnalysis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const [totalAnalysis, allAnalysis] = await Promise.all([
      Analysis.countDocuments(),
      Analysis.find()
        .skip((page - 1) * perPage)
        .limit(perPage),
    ]);
    const result = allAnalysis.forEach((analysis) => {
      analysis.fileLink = `${process.cwd()}/${analysis.fileUrl}`
    })
    console.log(result);
    const totalPages = Math.ceil(totalAnalysis / perPage);
    if (allAnalysis.length === 0) {
      return res.status(404).json({ data: [] });
    }
    return res.json({
      data: allAnalysis,
      page,
      totalPages,
      totalItems: totalAnalysis,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.analysisId);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    return res.json({ data: analysis });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createAnalysis = async (req, res) => {
  try {
    const existingAnalysis = await Analysis.findOne({ number: req.body.number });
    if (existingAnalysis) {
      return res.status(400).json({ error: "Number must be unique" });
    }
    const newAnalysis = await Analysis.create({
      number: req.body.number,
      name: req.body.name,
      analysisType: req.body.analysisType,
      fileUrl: "./files/" + req.file.filename,
    });
    return res.json({ data: newAnalysis });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.updateAnalysis = async (req, res) => {
  try {
    const oldAnalysis = await Analysis.findById(req.params.analysisId);
    if (!oldAnalysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    oldAnalysis.number = req.body.number;
    oldAnalysis.name = req.body.name;
    oldAnalysis.analysisType = req.body.analysisType;
    const files = oldAnalysis.fileUrl;
    files.push("./files/" + req.file.filename,);
    oldAnalysis.fileUrl = files;
    await oldAnalysis.save();
    return res.json({ data: oldAnalysis });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteAnalysis = async (req, res) => {
  try {
    const deletedAnalysis = await Analysis.findByIdAndDelete(
      req.params.analysisId
    );
    if (!deletedAnalysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    return res.json({ message: "Analysis deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
