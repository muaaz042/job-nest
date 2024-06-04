const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  EmployerID: { type: String, required : true },
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Location: { type: String, required: true },
  Category: { type: String, required: true },
  Type: { type: String, required: true },
  Salary:{type:Number, required:true},
  // Deadline: { type: Date },
});

module.exports = new mongoose.model("Jobs", jobSchema);
