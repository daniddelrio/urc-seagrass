const express = require('express')
const AdminCtrl = require('../controllers/admin-ctrl')
const passport = require('passport');

const router = express.Router()

router.post('/login', AdminCtrl.signIn)
router.post('/admin', passport.authenticate('master-jwt', { session: false }), AdminCtrl.createAdmin)
router.put('/admin/:username', passport.authenticate('master-jwt', { session: false }), AdminCtrl.updateAdmin)
router.delete('/admin/:username', passport.authenticate('master-jwt', { session: false }), AdminCtrl.deleteAdmin)
router.get('/admin/:username', passport.authenticate('jwt', { session: false }), AdminCtrl.getAdminByUsername)
router.get('/admins', passport.authenticate('jwt', { session: false }), AdminCtrl.getAdmins)

module.exports = router;
