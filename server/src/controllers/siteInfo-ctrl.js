const SiteData = require("../models/siteInfo");
const logger = require("../logger")

const createData = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Site data was not created",
            type: "siteInfo",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide data",
        });
    }

    const data = new SiteData(body);

    if (!data) {
        logger.error({
            message: "Site data was not created",
            body: body,
            type: "siteInfo",
        });
        return res.status(400).json({ success: false, error: err });
    }

    await data.save()
        .then((data) => {
            logger.info({
                message: "Site data was created",
                body: data,
                type: "siteInfo",
            });
            return res.status(201).json({
                success: true,
                id: data._id,
                message: "Data was added!",
            });
        })
        .catch((error) => {
            logger.error({
                message: "Site data was not created",
                errorTrace: error,
                type: "siteInfo",
            });

            return res.status(400).json({
                error,
                message: "Data was not added!",
            });
        });
};

const updateData = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Site data was not updated",
            type: "siteInfo",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    await SiteData.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                ...(body.status !== undefined && { status: body.status }),
                parameters: body.parameters
            },
        },
        { new: true },
        (err, data) => {
            if (err) {
                logger.error({
                    message: "Site data was not updated",
                    errorTrace: err,
                    type: "siteInfo",
                });
                return res.status(404).json({
                    err,
                    message: "Data not found!",
                });
            }

            logger.info({
                message: "Site data was updated",
                body: data,
                type: "siteInfo",
            });
            return res.status(200).json({ success: true, data: data });
        }
    );
};

const deleteData = async (req, res) => {
    await SiteData.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            logger.error({
                message: "Site data was not deleted",
                errorTrace: err,
                type: "siteInfo",
            });
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            logger.error({
                message: "Site data was not deleted",
                body: req.params.id,
                type: "siteInfo",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }

        logger.info({
            message: "Site data was deleted",
            body: data,
            type: "siteInfo",
        });
        return res.status(200).json({ success: true, data: data });
    }).catch((err) =>
        logger.error({
            message: "Site data was not deleted",
            errorTrace: err,
            type: "siteInfo",
        })
    );
};

const getSiteDataById = async (req, res) => {
    await SiteData.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            logger.error({
                message: "Site data was not found",
                errorTrace: err,
                type: "siteInfo",
            });
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            logger.error({
                message: "Site data was not found",
                body: req.params.id,
                type: "siteInfo",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        logger.info({
            message: "Site data was found",
            body: data,
            type: "siteInfo",
        });
        return res.status(200).json({ success: true, data: data });
    }).catch((err) =>
        logger.error({
            message: "Site data was not found",
            errorTrace: err,
            type: "siteInfo",
        })
    );
};

const getSiteDataByYear = async (req, res) => {
    await SiteData.find({ year: req.params.year }, (err, data) => {
        if (err) {
            logger.error({
                message: "Site data was not found",
                errorTrace: err,
                type: "siteInfo",
            });
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            logger.error({
                message: "Site data was not found",
                type: "siteInfo",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        logger.info({
            message: "Site data was found",
            body: data,
            type: "siteInfo",
        });
        return res.status(200).json({ success: true, data: data });
    }).catch((err) =>
        logger.error({
            message: "Site data was not found",
            errorTrace: err,
            type: "siteInfo",
        })
    );
};

const getAllSiteData = async (req, res) => {
    await SiteData.find({}, (err, data) => {
        if (err) {
            logger.error({
                message: "Site data was not found",
                errorTrace: err,
                type: "siteInfo",
            });
            return res.status(400).json({ success: false, error: err });
        }
        if (!data.length) {
            logger.error({
                message: "Site data was not found",
                type: "siteInfo",
            });
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        logger.info({
            message: "Site data was found",
            body: data,
            type: "siteInfo",
        });
        return res.status(200).json({ success: true, data: data });
    }).catch((err) =>
        logger.error({
            message: "Site data was not found",
            errorTrace: err,
            type: "siteInfo",
        })
    );
};

const getAllYears = async (req, res) => {
    await SiteData.find({}, (err, data) => {
        if (err) {
            logger.error({
                message: "Years not found",
                errorTrace: err,
                type: "siteInfo",
            });
            return res.status(400).json({ success: false, error: err });
        }
        if (!data.length) {
            logger.info({
                message: "Years not found. Returning this year.",
                type: "siteInfo",
            });
            const currYear = new Date().getFullYear();
            return res
                .status(404)
                .json({ success: true, data: [{ value: currYear, label: currYear }] });
        }
        let uniqueYears = [...new Set(data.map(point => point.year))];
        uniqueYears.sort(function(a, b){return b-a});
        uniqueYears = uniqueYears.map(year => ({value: year, label: year}));
        logger.info({
            message: "Years were found",
            body: uniqueYears,
            type: "siteInfo",
        });
        return res.status(200).json({ success: true, data: uniqueYears });
    }).catch((err) =>
        logger.error({
            message: "Years were not found",
            errorTrace: err,
            type: "siteInfo",
        })
    );
};


module.exports = {
    createData,
    updateData,
    deleteData,
    getAllSiteData,
    getSiteDataById,
    getSiteDataByYear,
    getAllYears
};
