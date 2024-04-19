const Analysis = require("../models/Analysis.js");
const Client = require("../models/Client.js");

exports.getAllAnalysis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const [totalClients, allClients] = await Promise.all([
      Client.countDocuments(),
      Client.find()
        .populate("analysis")
        .skip((page - 1) * perPage)
        .limit(perPage),
    ]);
    const totalPages = Math.ceil(totalClients / perPage);
    if (allClients.length === 0) {
      return res.status(404).json({ data: [] });
    }
    return res.json({
      data: allClients,
      page,
      totalPages,
      totalItems: totalClients,
    });
  } catch (err) {
    console.log(err);
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
    let existingClient = await Client.findOne({ number: req.body.number });
    if (!existingClient) {
      existingClient = await Client.create({
        number: req.body.number,
        name: req.body.name,
      });
    }
    const newAnalysis = await Analysis.create({
      analysisType: req.body.analysisType,
      fileUrl: "./files/" + req.file.filename,
      fileLink: `${process.env.URL_FILES}${req.file.filename}`,
    });
    existingClient.analysis.push(newAnalysis._id);
    await existingClient.save();
    findClient = await Client.findById(existingClient._id).populate("analysis");
    return res.json({ data: findClient });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    Object.assign(client, req.body);
    await client.save();
    return res.json({ data: client });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

exports.updateAnalysis = async (req, res) => {
  try {
    const oldAnalysis = await Analysis.findById(req.params.analysisId);
    if (!oldAnalysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    Object.assign(oldAnalysis, req.body)
    if (req.file) {
      oldAnalysis.fileUrl = "./files/" + req.file.filename
      oldAnalysis.fileLink = `${process.env.URL_FILES}${req.file.filename}`;
    }
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

exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(
      req.params.clientId
    );
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.json({ message: "Client deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};