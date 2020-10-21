const express = require("express");
const router = express.Router();
const db = require("../models")
// const axios = require('axios')

// Get all gardens
router.get("/api/gardens", function (req, res) {
  db.Garden.findAll().then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err);
  })
})

// Get garden by id
router.get("/api/gardens/:id", function (req, res) {
  db.Garden.findOne({ where: { id: req.params.id } }).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err);
  })
})

// Post route to add a garden
router.post("/api/gardens", function (req, res) {
  db.Owner.findOne({ where: { id: req.body.OwnerId } }).then(owner => {
    db.Garden.create({
      name: req.body.name,
      address: owner.address,
      latitude: owner.latitude,
      longitude: owner.longitude,
      description: req.body.description,
      length: req.body.length,
      width: req.body.width,
      OwnerId: owner.id
      // pictureLink: generated by cloudinary
    }).then(result => {
      res.json(result)
      res.render("info_diplay")
    }
    ).catch(err => {
      res.status(500).send(err)
    })
  }).catch(err => {
    res.status(500).send(err)
  })
})


//DELETE route to delete garden by ID
router.delete("/api/gardens/:id", function (req, res) {
  db.Garden.destroy({
    where: {
      id: req.params.id
    }
  }).then(data => {
    if (data === 0) {
      res.status(404).json(data);
    } else {
      res.json(data);
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// PUT route
router.put("/api/gardens/:id", function (req, res) { 
  res.status(418).end()
});

module.exports = router;