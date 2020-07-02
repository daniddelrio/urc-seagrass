const express = require('express')
const SiteCoordCtrl = require('../controllers/siteCoord-ctrl')
const passport = require('passport');

const router = express.Router()

router.post('/coords', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.createCoords)
router.put('/coords/:id', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.updateCoords)
router.delete('/coords/:id', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.deleteCoords)
router.get('/coords/:id', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.getSiteCoordsById)
router.get('/coords', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.getAllSiteCoords)
router.get('/coords/site/:code', passport.authenticate('jwt', { session: false }), SiteCoordCtrl.getSiteCoordsByCode)

module.exports = router;
