const SiteCoords = require('../models/siteCoord');

createCoords = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide coordinates',
        })
    };

    const coords = new SiteCoords(body)

    if (!coords) {
        return res.status(400).json({ success: false, error: err })
    }

    coords
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: coords._id,
                message: 'Coordinates were added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Coordinates were not added!',
            })
        })
}

updateCoords = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    SiteCoords.findOne({ _id: req.params.id }, (err, coords) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Site coordinates not found',
            })
        }
        coords.properties = body.propeties
        coords.geometry = body.geometry
        coords
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: coords._id,
                    message: 'Site coordinates updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Site coordinates not updated due to errors in the data!',
                })
            })
    })
}

deleteCoords = async (req, res) => {
    await SiteCoords.findOneAndDelete({ _id: req.params.id }, (err, coords) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!coords) {
            return res
                .status(404)
                .json({ success: false, error: `Site coordinates not found` })
        }

        return res.status(200).json({ success: true, coords: coords })
    }).catch(err => console.log(err))
}

getSiteCoordsById = async (req, res) => {
    await SiteCoords.findOne({ _id: req.params.id }, (err, coords) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!coords) {
            return res
                .status(404)
                .json({ success: false, error: `Site coords not found` })
        }
        return res.status(200).json({ success: true, coords: coords })
    }).catch(err => console.log(err))
}

getSiteCoordsByCode = async (req, res) => {
    await SiteCoords.findOne({ "properties.siteCode": req.params.code }, (err, coords) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!coords) {
            return res
                .status(404)
                .json({ success: false, error: `Site coordinates with given code not found` })
        }
        return res.status(200).json({ success: true, coords: coords })
    }).catch(err => console.log(err))
}

getAllSiteCoords = async (req, res) => {
    await SiteCoords.find({}, (err, coords) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!coords.length) {
            return res
                .status(404)
                .json({ success: false, error: `Site coordinates not found` })
        }
        return res.status(200).json({ success: true, coords: coords })
    }).catch(err => console.log(err))
}

module.exports = {
    createCoords,
    updateCoords,
    deleteCoords,
    getAllSiteCoords,
    getSiteCoordsById,
    getSiteCoordsByCode,
}