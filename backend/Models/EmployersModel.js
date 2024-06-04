const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  CompanyName: { type: String},
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Phone: { type: String },
  Address: { type: String },
});

module.exports = new mongoose.model("Employers", employerSchema);
