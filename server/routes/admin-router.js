const express = require('express')

const AdminCtrl = require('../controllers/admin-ctrl')

const router = express.Router()

router.post('/admin', AdminCtrl.createAdmin)
router.put('/admin/:username', AdminCtrl.updateAdmin)
router.delete('/admin/:username', AdminCtrl.deleteAdmin)
router.get('/admin/:username', AdminCtrl.getAdminByUsername)
router.get('/admins', AdminCtrl.getAdmins)

module.exports = router;
