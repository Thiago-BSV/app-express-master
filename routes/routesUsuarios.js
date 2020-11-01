const express = require('express');
const router = express.Router();
const usuarioController = require("../controller/usuarioController");


router.get('/', usuarioController.get);
router.post('/', usuarioController.post);
router.delete('/', usuarioController.del);


module.exports = router;
