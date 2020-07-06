const express = require('express')
const AdminCtrl = require('../controllers/admin-ctrl')
const passport = require('passport');

const router = express.Router()

const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5
});

router.post('/login', loginLimiter, AdminCtrl.signIn)
router.post('/admin', passport.authenticate('master-jwt', { session: false }), AdminCtrl.createAdmin)
router.put('/admin/:username', passport.authenticate('master-jwt', { session: false }), AdminCtrl.updateAdmin)
router.delete('/admin/:username', passport.authenticate('master-jwt', { session: false }), AdminCtrl.deleteAdmin)
router.get('/admin/:username', passport.authenticate('jwt', { session: false }), AdminCtrl.getAdminByUsername)
router.get('/admin', passport.authenticate('jwt', { session: false }), AdminCtrl.getAdmins)

module.exports = router;
