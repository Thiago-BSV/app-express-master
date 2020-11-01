const express = require('express');
const router = express.Router();
const poisController = require("../controller/poisController");


router.get('/:pois_id?', poisController.get);
router.post('/', poisController.post);
router.delete('/', poisController.del);


module.exports = router;
