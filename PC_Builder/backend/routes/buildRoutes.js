const express = require('express');
const router = express.Router();
const { getCompatibleComponents } = require('../controllers/buildController');

router.post('/compatibility', getCompatibleComponents);

module.exports = router;