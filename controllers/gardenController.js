const express = require("express");
const router = express.Router();
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
var cloudinary = require('cloudinary').v2;
const path = require("path")

// Get all gardens
router.get("/api/gardens", function (req, res) {
  db.Garden.findAll()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get garden by id
router.get("/api/gardens/:id", function (req, res) {
  db.Garden.findOne({ where: { id: req.params.id } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// return info_display.handlebars to display all gardens available
router.get("/gardens", function (req, res) {
  db.Garden.findAll((data) => {
    let gardenObject = {
      Garden: data,
    };
    console.log(gardenObject);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

// Post route to add a garden
router.post("/api/gardens", async function (req, res) {
  if (req.session.user && req.session.user.userType === "owner") {
    try {
      if (req.files) {
        const image = req.files.image;
        const imagePath = path.join(__dirname, '../public/images/userGarden')
        function moveImage(file, filePath) {
          return new Promise((resolve, reject) => {
            file.mv(filePath, function (err) {
              if (err) return reject(err)
              return resolve("image uploaded")
            })
          })
        }
        function uploadToCloudinary(filePath) {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(filePath, (error, result) => {
              if (error) return reject(error);
              return resolve(result);
            })
          });
        }
        const imageMoved = await moveImage(image, imagePath)
        var imageUpload = await uploadToCloudinary(imagePath)
      } else {
        var imageUpload = { url: null }
      }
      const owner = await db.Owner.findOne({ where: { id: req.session.user.id } })
      const garden = await db.Garden.create({
        name: req.body.name,
        address: owner.address,
        latitude: owner.latitude,
        longitude: owner.longitude,
        description: req.body.description,
        length: req.body.length,
        width: req.body.width,
        OwnerId: owner.id,
        pictureLink: imageUpload.url
      })

      let gardenJSON = garden.toJSON();
      gardenJSON.justPosted = true;
      gardenJSON.loggedIn = true;
      res.status(200).send(`${gardenJSON.id}`)
    } catch (err) {
      console.log(err)
      res.status(500).send(err)
    }
  } else {
    res.redirect("/owners/login")
  }
});



//DELETE route to delete garden by ID
router.delete("/api/gardens/:id", function (req, res) {
  db.Garden.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data === 0) {
        res.status(404).json(data);
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
// PUT route to assign a garden
router.put("/api/gardens/assign/:id", async function (req, res) {
  try {
    const result = await db.Garden.update(
      req.body,
      {
        where: {
          id: req.params.id,
        },
      }
    )
    const garden = await db.Garden.findOne({
      where: { id: req.params.id },
    })
    res.render("garden_display", garden.toJSON());
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// PUT route to update garden information
router.put("/api/gardens/:id", async function (req, res) {
  try {
    if (req.files) {
      const image = req.files.image;
      const imagePath = path.join(__dirname, '../public/images/userGarden')
      function moveImage(file, filePath) {
        return new Promise((resolve, reject) => {
          file.mv(filePath, function (err) {
            if (err) return reject(err)
            return resolve("image uploaded")
          })
        })
      }
      function uploadToCloudinary(filePath) {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(filePath, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          })
        });
      }
      const imageMoved = await moveImage(image, imagePath)
      var imageUpload = await uploadToCloudinary(imagePath)
    } else {
      var imageUpload = { url: req.body.imageUrl }
    }

    console.log(req.files)
    const result = await db.Garden.update({
      name: req.body.name,
      description: req.body.description,
      length: req.body.length,
      width: req.body.width,
      pictureLink: imageUpload.url
    },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    const garden = await db.Garden.findOne({
      where: { id: req.params.id },
    })
    res.render("garden_display", garden.toJSON());

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/api/gardens/unassign/:id", function (req, res) {
  sequelize.query(`UPDATE Gardens SET GardenerId = NULL WHERE id = ${req.params.id}`, { type: QueryTypes.UPDATE }).then(update => {
    res.json(update)
  })
});

module.exports = router;
