const express = require('express')
const DatasetCtrl = require('../controllers/dataset-ctrl')

const router = express.Router()
router.get('/dataset', DatasetCtrl.getDataset)

module.exports = router;
