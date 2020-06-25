const express = require('express')

const SiteInfoCtrl = require('../controllers/siteInfo-ctrl')

const router = express.Router()

router.post('/sitedata', SiteInfoCtrl.createData)
router.put('/sitedata/:id', SiteInfoCtrl.updateData)
router.delete('/sitedata/:id', SiteInfoCtrl.deleteData)
router.get('/sitedata/:id', SiteInfoCtrl.getSiteDataById)
router.get('/sitedata', SiteInfoCtrl.getAllSiteData)
router.get('/sitedata/year/:year', SiteInfoCtrl.getSiteDataByYear)

module.exports = router;
