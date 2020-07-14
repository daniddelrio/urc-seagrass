const express = require('express')
const ModificationCtrl = require('../controllers/modification-ctrl')
const passport = require('passport');

const router = express.Router()

router.get('/modifications/:siteCode/:year', passport.authenticate('jwt', { session: false }), ModificationCtrl.getModificationsBySite)
router.get('/modifications', passport.authenticate('jwt', { session: false }), ModificationCtrl.getModifications)
// router.delete('/modifications', ModificationCtrl.deleteModifications)

module.exports = router;
