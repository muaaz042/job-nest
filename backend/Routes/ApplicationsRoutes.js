const router = require('express').Router();
const Application = require("../Models/ApplicationsModel");
const JobSeeker = require("../Models/JobSeekerModel");


router.post("/applications", async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).send(application);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get("/jobseekers/:jobSeekerID/applications", async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.jobSeekerID);
    if (!jobSeeker) {
      return res.status(404).send("Job seeker not found");
    }

    const applications = await Application.find({ JobSeekerID: jobSeeker._id });
    res.send(applications);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/applications/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).send("Application not found");
    }
    res.send(application);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.patch("/applications/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["Status", "AppliedAt", "Interview"];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!application) {
      return res.status(404).send("Application not found");
    }
    res.send(application);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/applications/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).send("Application not found");
    }
    res.send(application);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
