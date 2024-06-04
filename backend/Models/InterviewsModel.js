const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  ApplicationID: { type: String, required: true },
  Date: { type: Date, required: true },
  Time: { type: String, required: true },
  Location: { type: String, required: true },
  Feedback: { type: String }
});

module.exports = new mongoose.model("Interviews", interviewSchema);

