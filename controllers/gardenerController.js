const express = require("express");
const router = express.Router();
const db = require("../models")
const axios = require('axios')


// Get all gardeners
router.get("/api/gardeners", function (req, res) {
  db.Gardener.findAll().then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err);
  })
})

// Get owner by id
router.get("/api/gardeners/:id", function (req, res) {
  db.Gardener.findOne({ where: { id: req.params.id } }).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err);
  })
})

// Post route to add a Gardener
router.post("/api/gardeners", function (req, res) {
  const APIKey = '0a157990-f940-11ea-ac04-cb65445966da'
  axios.get(`https://app.geocodeapi.io/api/v1/search?apikey=${APIKey}&text=${req.body.address}`)
    .then(response => {
      db.Gardener.create({
        username: req.body.username,
        email: req.body.email,
        address: req.body.address,
        latitude: response.data.bbox[1],
        longitude: response.data.bbox[0],
        password: req.body.password
      }).then(result => {
        res.json(result)
      }).catch(err => {
        res.status(500).send(err)
      })
    })
})

// DELETE route 
router.delete("/api/gardeners/:id", function (req, res) {
  db.Gardener.destroy({
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
router.put("/api/gardeners/:id", function (req, res) {
  res.status(418).end();
});

module.exports = router;