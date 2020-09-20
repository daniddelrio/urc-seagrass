const express = require('express')
const DataFieldsCtrl = require('../controllers/dataFields-ctrl')
const passport = require('passport');

const router = express.Router()

router.post('/parameters', passport.authenticate('jwt', { session: false }), DataFieldsCtrl.createField)
router.put('/parameters/:id', passport.authenticate('jwt', { session: false }), DataFieldsCtrl.updateField)
router.get('/parameters/:id', DataFieldsCtrl.getFieldById)
router.get('/parameters', DataFieldsCtrl.getAllFields)

module.exports = router;
