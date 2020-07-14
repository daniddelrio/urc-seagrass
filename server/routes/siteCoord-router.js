const express = require('express')
const SiteCoordCtrl = require('../controllers/siteCoord-ctrl')
const passport = require('passport');

const router = express.Router()

router.post('/coords', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.createCoords)
router.put('/coords/:id', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.updateCoords)
router.delete('/coords/:id', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.deleteCoords)
router.get('/coords/:id', SiteCoordCtrl.getSiteCoordsById)
router.get('/coords', SiteCoordCtrl.getAllSiteCoords)
router.get('/coords/site/:code', SiteCoordCtrl.getSiteCoordsByCode)

module.exports = router;
