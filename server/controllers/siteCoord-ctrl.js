const SiteCoords = require('../models/siteCoord');
const fs = require('fs'); 
const path = require('path'); 
const { imageUploadPath } = require('../config');
const logger = require("../logger")

const createCoords = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Coordinates were not created",
            body: body,
            type: "siteCoords",
        });
        return res.status(400).json({
            success: false,
            error: 'You must provide coordinates',
        })
    };

    const coords = new SiteCoords(body)

    if (!coords) {
        logger.error({
            message: "Coordinates were not created",
            body: body,
            type: "siteCoords",
        });
        return res.status(400).json({ success: false, error: err })
    }

    await coords
        .save()
        .then((data) => {
            logger.info({
                message: "Coordinates were created",
                body: data,
                type: "siteCoords",
            });
            return res.status(201).json({
                success: true,
                id: coords._id,
                message: 'Coordinates were added!',
            })
        })
        .catch(error => {
            logger.error({
                message: "Coordinates were not created",
                errorTrace: error,
                type: "siteCoords",
            });
            return res.status(400).json({
                error,
                message: 'Coordinates were not added!',
            })
        })
}

const updateCoords = async (req, res) => {
    const body = req.body

    if (!body) {
        logger.error({
            message: "Coordinates were not updated",
            body: body,
            type: "siteCoords",
        });
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await SiteCoords.findOne({ _id: req.params.id }, (err, coords) => {
        if (err) {
            logger.error({
                message: "Coordinates were not updated",
                errorTrace: err,
                type: "siteCoords",
            });
            return res.status(404).json({
                err,
                message: 'Site coordinates not found',
            })
        }
        if(body.properties)
            coords.properties = body.properties
        if(body.geometry)
            coords.geometry = body.geometry
        coords
            .save()
            .then((data) => {
                logger.info({
                    message: "Coordinates were updated",
                    body: data,
                    type: "siteCoords",
                });
                return res.status(200).json({
                    success: true,
                    id: coords._id,
                    message: 'Site coordinates updated!',
                })
            })
            .catch(error => {
                logger.error({
                    message: "Coordinates were not updated",
                    errorTrace: err,
                    type: "siteCoords",
                });
                return res.status(404).json({
                    error,
                    message: 'Site coordinates not updated due to errors in the data!',
                })
            })
    })
}

const deleteCoords = async (req, res) => {
    await SiteCoords.findOneAndDelete({ _id: req.params.id }, (err, coords) => {
        if (err) {
            logger.error({
                message: "Coordinates were not deleted",
                errorTrace: err,
                type: "siteCoords",
            });
            return res.status(400).json({ success: false, error: err })
        }

        if (!coords) {
            logger.error({
                message: "Coordinates were not deleted",
                body: coords,
                type: "siteCoords",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site coordinates not found` })
        }
        logger.info({
            message: "Coordinates were deleted",
            body: coords,
            type: "siteCoords",
        });
        return res.status(200).json({ success: true, coords: coords })
    }).catch((err) =>
        logger.error({
            message: "Coordinates were not deleted",
            errorTrace: err,
            type: "siteCoords",
        })
    );
}

const getSiteCoordsById = async (req, res) => {
    await SiteCoords.findOne({ _id: req.params.id }, (err, coords) => {
        if (err) {
            logger.error({
                message: "Coordinates were not found",
                errorTrace: err,
                type: "siteCoords",
            });
            return res.status(400).json({ success: false, error: err })
        }

        if (!coords) {
            logger.error({
                message: "Coordinates were not found",
                body: req.params.id,
                type: "siteCoords",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site coords not found` })
        }
        logger.info({
            message: "Coordinates were found",
            body: coords,
            type: "siteCoords",
        });
        return res.status(200).json({ success: true, coords: coords })
    }).catch((err) =>
        logger.error({
            message: "Coordinates were not found",
            errorTrace: err,
            type: "siteCoords",
        })
    );
}

const getSiteCoordsByCode = async (req, res) => {
    await SiteCoords.findOne({ "properties.siteCode": req.params.code }, (err, coords) => {
        if (err) {
            logger.error({
                message: "Coordinates were not found",
                errorTrace: err,
                type: "siteCoords",
            });
            return res.status(400).json({ success: false, error: err })
        }

        if (!coords) {
            logger.error({
                message: "Coordinates were not found",
                body: req.params.code,
                type: "siteCoords",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site coordinates with given code not found` })
        }
        logger.info({
            message: "Coordinates were found",
            body: coords,
            type: "siteCoords",
        });
        return res.status(200).json({ success: true, coords: coords })
    }).catch((err) =>
        logger.error({
            message: "Coordinates were not found",
            errorTrace: err,
            type: "siteCoords",
        })
    );
}

const getAllSiteCoords = async (req, res) => {
    await SiteCoords.find({}, (err, coords) => {
        if (err) {
            logger.error({
                message: "Coordinates were not found",
                errorTrace: err,
                type: "siteCoords",
            });
            return res.status(400).json({ success: false, error: err })
        }
        if (!coords.length) {
            logger.error({
                message: "Coordinates were not found",
                type: "siteCoords",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site coordinates not found` })
        }
        logger.info({
            message: "Coordinates were found",
            body: coords,
            type: "siteCoords",
        });
        return res.status(200).json({ success: true, coords: coords })
    }).catch((err) =>
        logger.error({
            message: "Coordinates were not found",
            errorTrace: err,
            type: "siteCoords",
        })
    );
}

const uploadSiteImage = async (req, res) => {
    const file = req.file

    if (!file) {
        logger.error({
            message: "Image was not uploaded",
            type: "siteCoordsImage",
        });
        return res.status(400).json({
            success: false,
            error: 'You must provide an image to update',
        })
    }

    await SiteCoords.findOne({ _id: req.params.id }, (err, coords) => {
        if (err) {
            logger.error({
                message: "Image was not uploaded",
                errorTrace: err,
                type: "siteCoordsImage",
            });
            return res.status(404).json({
                err,
                message: 'Site coordinates not found',
            })
        }
        coords.properties.image = { 
            data: fs.readFileSync(path.join(imageUploadPath, file.filename)), 
            contentType: 'image/jpg'
        }
        coords
            .save()
            .then((data) => {
                logger.info({
                    message: "Image was not uploaded",
                    body: data,
                    type: "siteCoordsImage",
                });
                return res.status(200).json({
                    success: true,
                    id: coords._id,
                    message: 'Site image updated!',
                })
            })
            .catch(error => {
                logger.error({
                    message: "Image was not uploaded",
                    errorTrace: error,
                    type: "siteCoordsImage",
                });
                return res.status(404).json({
                    error,
                    message: 'Site image not updated due to errors in the data!',
                })
            })
    })
}

module.exports = {
    createCoords,
    updateCoords,
    deleteCoords,
    getAllSiteCoords,
    getSiteCoordsById,
    getSiteCoordsByCode,
    uploadSiteImage,
}