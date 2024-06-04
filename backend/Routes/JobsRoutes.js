const router = require("express").Router();
const Job = require("../Models/JobsModel");
const Employer = require("../Models/EmployersModel");
const auth = require("../middleware/auth");


router.post("/job", async (req, res) => {
  try {
    console.log(req.body);
    const job = new Job(req.body);
    await job.save();
    res.status(201).send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.send(jobs);
  } catch (error) {
    res.status(500
    ).send
    (error);
  }
});

router.get("/employers/:employerID/jobs", async (req, res) => {

  console.log(req.params.employerID)
  try {
    const employer = await Employer.find({_id:req.params.employerID});
    if (!employer) {
      return res.status(404).send("Employer not found");
    }

    const jobs = await Job.find({ EmployerID: req.params.employerID });
    res.send(jobs);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.patch("/jobs/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["JobTitle", "Description", "Requirements", "Location", "Deadline", "Industry", "CompanySize"];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.send(job);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.send(job);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
