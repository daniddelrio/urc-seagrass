const express = require('express')
const ContributionCtrl = require('../controllers/contribution-ctrl')
const passport = require('passport');

const router = express.Router()

router.post('/contribution', ContributionCtrl.createContribution)
router.put('/contribution/:id', passport.authenticate('jwt', { session: false }), ContributionCtrl.updateContribution)
router.delete('/contribution/:id', passport.authenticate('jwt', { session: false }), ContributionCtrl.deleteContribution)
router.get('/contribution/:id', ContributionCtrl.getContributionById)
router.get('/contribution', ContributionCtrl.getContributions)
router.get('/contribution/status/:status', ContributionCtrl.getContributionsByStatus)

module.exports = router;
