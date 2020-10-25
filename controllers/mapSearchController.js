const express = require("express");
const router = express.Router();
const axios = require("axios");

//set var for location lat and long
var lat;
var long;

//map search function
router.post("/api/map", function geoData(req, res) {
  let location = $("#location-input").val();
  const APIKey = "0a157990-f940-11ea-ac04-cb65445966da";
  axios
    .get(
      `https://app.geocodeapi.io/api/v1/search?apikey=${APIKey}&text=${location}`
    )
    .then((response) => {
      console.log(response);
      var lat = response.data.bbbox[1];
      var long = response.data.bbox[0];
    });
});
