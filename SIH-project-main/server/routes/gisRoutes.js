const express = require('express');
const router = express.Router();
const { getVillagesGeoJson, getFarmsCoordinates } = require('../controllers/gisController');

router.get('/villages-geojson', getVillagesGeoJson);
router.get('/farms', getFarmsCoordinates);

module.exports = router;
