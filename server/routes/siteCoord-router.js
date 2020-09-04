const express = require("express");
const SiteCoordCtrl = require("../controllers/siteCoord-ctrl");
const passport = require("passport");

const router = express.Router();
const multer = require("multer");
const { imageUploadPath } = require('../config');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, imageUploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + ".jpg");
	},
});

const upload = multer({ storage: storage });

router.post(
	"/coords",
	passport.authenticate("jwt", { session: false }),
	SiteCoordCtrl.createCoords
);
router.put(
	"/coords/:id",
	passport.authenticate("jwt", { session: false }),
	SiteCoordCtrl.updateCoords
);
router.put(
	"/coords/image/:id",
	passport.authenticate("jwt", { session: false }),
	upload.single("file"),
	SiteCoordCtrl.uploadSiteImage
);
router.delete(
	"/coords/:id",
	passport.authenticate("jwt", { session: false }),
	SiteCoordCtrl.deleteCoords
);
router.get("/coords/:id", SiteCoordCtrl.getSiteCoordsById);
router.get("/coords", SiteCoordCtrl.getAllSiteCoords);
router.get("/coords/site/:code", SiteCoordCtrl.getSiteCoordsByCode);

module.exports = router;
