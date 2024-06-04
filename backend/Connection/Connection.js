const mongoose = require("mongoose");
const databaseName = "Jobnest";
require('dotenv').config();

// mongoose
// .connect(process.env.DB)
// .then(() => {
//   console.log(`MongoDB connection to ${databaseName} is established `);
// }).catch(err => console.error('connection error: ' + err));

mongoose.connect(`mongodb://0.0.0.0:27017/${databaseName}`).then(() => {
  console.log(`MongoDB connection to ${databaseName} is established`);
}).catch(err => console.error('connection error: ' + err));