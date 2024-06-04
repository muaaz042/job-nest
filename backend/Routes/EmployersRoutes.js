const express = require('express');
const router = express.Router();
const Employer = require("../Models/EmployersModel");
const Job = require('../Models/JobsModel');
const App = require('../Models/ApplicationsModel');
const Interview = require('../Models/InterviewsModel'); // Assuming you have an Interview model

router.post("/employers", async (req, res) => {
  try {
    const employer = new Employer(req.body);
    await employer.save();
    res.status(201).send(employer);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/employers", async (req, res) => {
  try {
    const employers = await Employer.find();
    res.send(employers);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/employers/:id", async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).send();
    }
    res.send(employer);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/employers/:id", async (req, res) => {
  const updates = Object.keys(req.body);


  try {
    const employer = await Employer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employer) {
      return res.status(404).send();
    }
    res.send(employer);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/employers/:id", async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).send();
    }
    res.send(employer);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/applications/:email', async (req, res) => {
  try {
    const { _id } = await Employer.findOne({ Email: req.params.email });
    const jobs = await Job.find({ EmployerID: _id });
    const ids = jobs.map(job => job._id);
    const applications = [];
    for (const id of ids) {
      const jobApplications = await App.find({ JobID: id });
      applications.push(...jobApplications);
    }
    res.status(202).json({ "Applications": applications });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/employer/stats/:id', async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    const employerId = employer._id;

    // Find all jobs posted by the employer
    const jobs = await Job.find({ EmployerID: employerId });
    const jobIds = jobs.map(job => job._id);

    // Find all applications for the jobs posted by the employer
    const applications = await App.find({ JobID: { $in: jobIds } });
    const applicationIds = applications.map(application => application._id);

    // Find all interviews for the applications
    const interviews = await Interview.find({ ApplicationID: { $in: applicationIds } });

    // Prepare the statistics
    const stats = {
      numberOfJobsPosted: jobs.length,
      numberOfApplications: applications.length,
      numberOfInterviewsScheduled: interviews.length
    };

    // Send the response
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
