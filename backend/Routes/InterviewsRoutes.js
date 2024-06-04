const router = require('express').Router();
const Interview = require("../Models/InterviewsModel");
const Application = require("../Models/ApplicationsModel");


router.post("/interviews", async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).send(interview);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get("/applications/:applicationID/interviews", async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationID);
    if (!application) {
      return res.status(404).send("Application not found");
    }

    const interviews = await Interview.find({ ApplicationID: application._id });
    res.send(interviews);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get("/interviews/:id", async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    res.send(interview);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.patch("/interviews/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["Date", "Time", "Location", "Feedback"];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    res.send(interview);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.delete("/interviews/:id", async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).send("Interview not found");
    }
    res.send(interview);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
