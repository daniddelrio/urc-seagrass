const express = require('express')

const ContributionCtrl = require('../controllers/siteInfo-ctrl')

const router = express.Router()

router.post('/contribution', ContributionCtrl.createData)
router.put('/contribution/:id', ContributionCtrl.updateData)
router.delete('/contribution/:id', ContributionCtrl.deleteData)
router.get('/contribution/:id', ContributionCtrl.getContributionById)
router.get('/contributions', ContributionCtrl.getContributions)
router.get('/contribution/:status', ContributionCtrl.getContributionsByStatus)

module.exports = router;

createContribution,
    updateContribution,
    deleteContribution,
    getContributionById,
    getContributionsByStatus,
    getContributions,