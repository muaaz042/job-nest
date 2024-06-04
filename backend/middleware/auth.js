const jwt = require("jsonwebtoken");
const employer = require("../Models/EmployersModel");
const jobSeeker = require("../Models/JobSeekerModel");
require("dotenv").config();

async function auth(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token Not Provided");
  try {
    console.log(token)
    let decodedToken = jwt.verify(token, process.env.JWTKEY);
    var userType = decodedToken.userType;
    var { _id } = decodedToken;
    if (userType === "job_seeker") {
      req.user = await jobSeeker.findOne(_id);
    } else {
      req.user = await employer.findOne(_id);
    } 
  } catch (err) {
    return res.status(401).send(`Invalid Token`);
  }
  next();
}
module.exports = auth;