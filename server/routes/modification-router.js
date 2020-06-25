const express = require('express')

const ModificationCtrl = require('../controllers/modification-ctrl')

const router = express.Router()

router.get('/modification/:id', ModificationCtrl.getModificationById)
router.get('/modifications', ModificationCtrl.getModifications)
// router.delete('/modifications', ModificationCtrl.deleteModifications)

module.exports = router;
