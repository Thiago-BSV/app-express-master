const express = require('express');
const router = express.Router();
const tokenController = require("../controller/tokenController");


router.get('/:token', tokenController.get);


module.exports = router;
