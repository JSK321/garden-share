//testing back end map route
// Dependencies
// =============================================================

const axios = require('axios')


var db = require("../models");



var mymap = L.map('mapid').setView([lat, long], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 10,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

function mapData(map){
    
}
// Map function
fun
function (req, res) {
    const APIKey = '0a157990-f940-11ea-ac04-cb65445966da'
    axios.get(`https://app.geocodeapi.io/api/v1/search?apikey=${APIKey}&text=${req.body.address}`)
      .then(response => {
        db.Owner.create({
          username: req.body.username,
          email: req.body.email,
          address: req.body.address,
          latitude: response.data.bbox[1],
          longitude: response.data.bbox[0],
          password: req.body.password
          
          let lat = response.data.bbox[1]
          let long = response.data.bbox[0]


          

        }).then(result => {
          res.json(result)
        }).catch(err => {
          res.status(500).send(err)
        })
      })
  }




