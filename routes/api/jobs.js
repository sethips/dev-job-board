const express = require('express');
const router = express.Router();

// Item Model
const Job = require('../../models/Job');

// @route   GET api/items
// @desc    Get All Items
// @access  Public
router.get('/', (req, res) => {
  Job.find()
    .then(jobs => res.json(jobs));
  // Job.find()
  //   .then(res => console.log(res));
});

// @route   POST api/items
// @desc    Create An Item
// @access  Private
router.post('/', (req, res) => {
  const newJob = new Job({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    url: req.body.url,
    keywords: req.body.keywords,
    datePosted: req.body.datePosted,
    scrapedFrom: req.body.scrapedFrom
  });

  newJob.save().then(job => res.json(job));
});

module.exports = router;
