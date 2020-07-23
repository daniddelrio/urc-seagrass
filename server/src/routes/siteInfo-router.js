const express = require('express')
const SiteInfoCtrl = require('../controllers/siteInfo-ctrl')
const passport = require('passport');

const router = express.Router()

router.post('/sitedata', passport.authenticate('jwt', { session: false }), SiteInfoCtrl.createData)
router.put('/sitedata/:id', passport.authenticate('jwt', { session: false }), SiteInfoCtrl.updateData)
router.delete('/sitedata/:id', passport.authenticate('jwt', { session: false }), SiteInfoCtrl.deleteData)
router.get('/sitedata/:id', SiteInfoCtrl.getSiteDataById)
router.get('/sitedata', SiteInfoCtrl.getAllSiteData)
router.get('/sitedata/year/:year', SiteInfoCtrl.getSiteDataByYear)
// Add an endpoint for getting all the years for the dropdown
router.get('/year', SiteInfoCtrl.getAllYears)

module.exports = router;
