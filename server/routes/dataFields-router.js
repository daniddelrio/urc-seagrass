const express = require('express')
const dataFields = require('../dataFields')

const router = express.Router()

router.get('/parameters', (req, res) => res.status(200).json(dataFields))

module.exports = router;
