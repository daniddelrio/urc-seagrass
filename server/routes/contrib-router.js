const express = require('express')

const ContributionCtrl = require('../controllers/contribution-ctrl')

const router = express.Router()

router.post('/contribution', ContributionCtrl.createContribution)
router.put('/contribution/:id', ContributionCtrl.updateContribution)
router.delete('/contribution/:id', ContributionCtrl.deleteContribution)
router.get('/contribution/:id', ContributionCtrl.getContributionById)
router.get('/contributions', ContributionCtrl.getContributions)
router.get('/contribution/:status', ContributionCtrl.getContributionsByStatus)

module.exports = router;
