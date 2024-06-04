const express = require("express");
const app = express();
const { JobSeekerSignUp, EmployerSignUp } = require("./utils");
const cors = require("cors");
const sendEmail = require("./smtp/sendEmail");
const jwt = require("jsonwebtoken");
const JobSeeker = require("./Models/JobSeekerModel");
const Employer = require("./Models/EmployersModel");
const Job = require("./Models/JobsModel");
const Application = require("./Models/ApplicationsModel");

require("./Connection/Connection");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const jobSeekerRoutes = require("./Routes/JobSeekerRoutes");
const employerRoutes = require("./Routes/EmployersRoutes");
const jobRoutes = require("./Routes/JobsRoutes");
const applicationRoutes = require("./Routes/ApplicationsRoutes");
const interviewRoutes = require("./Routes/InterviewsRoutes");

app.use("/jobseeker", jobSeekerRoutes);
app.use("/employer", employerRoutes);
app.use("/jobs", jobRoutes);
app.use("/application", applicationRoutes);
app.use("/interview", interviewRoutes);

app.post("/signup", (req, res) => {
  console.log("Sign Up");
  if (req.body.userType === "job_seeker") {
    console.log("Seeker Up");
    JobSeekerSignUp(req, res);
  } else if (req.body.userType === "employer") {
    console.log("Employer Up");
    EmployerSignUp(req, res);
  }
});

// Route to fetch job details and job seekers who applied for jobs posted by an employer
app.get("/employer/:employerID/job-applications", async (req, res) => {
  try {
    const { employerID } = req.params;

    // Fetch all jobs posted by the employer
    const jobs = await Job.find({ EmployerID: employerID });

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this employer" });
    }

    const jobIds = jobs.map(job => job._id);

    // Fetch applications related to those jobs
    const applications = await Application.find({ JobID: { $in: jobIds } });

    if (applications.length === 0) {
      return res.status(404).json({ message: "No applications found for the jobs posted by this employer" });
    }

    // Fetch job seeker details from those applications
    const jobSeekerIds = applications.map(application => application.JobSeekerID);
    const jobSeekers = await JobSeeker.find({ _id: { $in: jobSeekerIds } });

    // Combine the necessary data
    const response = applications.map(application => {
      const job = jobs.find(job => job._id.equals(application.JobID));
      const jobSeeker = jobSeekers.find(seeker => seeker._id.equals(application.JobSeekerID));

      return {
        applicationId: application._id,
        Title: job.Title,
        Location: job.Location,
        Salary: job.Salary,
        Type: job.Type,
        Category: job.Category,
        Description: job.Description,
        Name: jobSeeker.Name,
        Email: jobSeeker.Email,
        Resume: jobSeeker.Resume
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching job details and job seekers:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/sendEmail", (req, res) => {
  sendEmail(req.body.Email)
    .then((code) => {
      res.status(200).send(code);
    })
    .catch((error) => {
      res.status(400).send("error");
    });
});

app.post("/login", async (req, res) => {
    const { Email, Password, userType } = req.body;
    if (userType === "job_seeker") {
        const jobSeeker = await JobSeeker.findOne({ Email: Email });
        if (!jobSeeker) return res.status(404).send("User not found");
        if (jobSeeker.Password !== Password)
            return res.status(400).send("Invalid Password");
        const { _id }=jobSeeker;
        const token = jwt.sign({ _id, userType,  }, process.env.JWTKEY);
        res.status(200).json({"token":token});
    } else if (userType === "employer") {
        const employer = await Employer.findOne({ Email: Email });
        if (!employer) return res.status(404).send("User not found");
        const { _id }=employer;
        if (employer.Password !== Password)
            return res.status(400).send("Invalid Password");
        const token = jwt.sign({ userType , _id}, process.env.JWTKEY);
        res.status(200).json({"token":token});
    } else {
        res.status(400).send("Invalid user type");
    }
});

app.listen(PORT, () => {
  console.log("App is listening on port : " + PORT);
});
