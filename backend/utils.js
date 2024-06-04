const JobSeeker = require("./Models/JobSeekerModel");
const Employer = require("./Models/EmployersModel");

async function JobSeekerSignUp(req, res){
    try {
        const { Name, Email, Password} = req.body
        console.log(req.body)
        const jobSeeker = new JobSeeker({ Name, Email, Password});
        await jobSeeker.save();
        res.status(201).send(jobSeeker);
      } 
    catch (error) {
        res.status(400).send(error);
      }
}

async function EmployerSignUp(req, res){
    try {
        const { Name, Email, Password} = req.body
        const employer = new Employer({ Name, Email, Password});
        await employer.save();
        res.status(201).send(employer);
      } catch (error) {
        res.status(400).send(error);
      }
}

module.exports = {
    JobSeekerSignUp,
    EmployerSignUp
}