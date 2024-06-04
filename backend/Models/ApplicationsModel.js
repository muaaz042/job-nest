const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  JobSeekerID: { type: String, required: true },
  JobID: { type: String, required: true },
  Status: { type: String, required: true, default: "Applied" },
  AppliedAt: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("Applications", applicationSchema);

