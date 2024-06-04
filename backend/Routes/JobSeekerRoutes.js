const router = require('express').Router();
const JobSeeker = require("../Models/JobSeekerModel");


router.post("/jobseekers", async (req, res) => {
  try {
    const jobSeeker = new JobSeeker(req.body);
    await jobSeeker.save();
    res.status(201).send(jobSeeker);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get("/jobseekers", async (req, res) => {
  try {
    const jobSeekers = await JobSeeker.find();
    res.send(jobSeekers);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/jobseekers/:id", async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findById(req.params.id);
    if (!jobSeeker) {
      return res.status(404).send();
    }
    res.send(jobSeeker);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.patch("/jobseekers/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["Name", "Email", "Password", "Phone", "Skills", "Resume", "ProfilePicture"];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  // if (!isValidOperation) {
  //   return res.status(400).send({ error: "Invalid updates!" });
  // }

  try {
    const jobSeeker = await JobSeeker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!jobSeeker) {
      return res.status(404).send();
    }
    res.send(jobSeeker);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/jobseekers/:id", async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findByIdAndDelete(req.params.id);
    if (!jobSeeker) {
      return res.status(404).send();
    }
    res.send(jobSeeker);
  } catch (error) {
    res.status(500).send(error);
  }
});




module.exports = router;
