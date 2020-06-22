const express = require('express')

const SiteCoordCtrl = require('../controllers/siteCoord-ctrl')

const router = express.Router()

router.post('/coords', SiteCoordCtrl.createCoords)
router.put('/coords/:id', SiteCoordCtrl.updateCoords)
router.delete('/coords/:id', SiteCoordCtrl.deleteCoords)
router.get('/coords/:id', SiteCoordCtrl.getSiteCoordsById)
router.get('/coords', SiteCoordCtrl.getAllSiteCoords)
router.get('/coords/:code', SiteCoordCtrl.getSiteCoordsByCode)

module.exports = router;
