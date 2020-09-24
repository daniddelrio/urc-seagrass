const Contribution = require("../models/contribution");
const logger = require("../logger")

const createContribution = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Contribution was not created due to lack of data",
            body: body,
            type: "contribution",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide data",
        });
    }

    const contrib = new Contribution(body);

    if (!contrib) {
        logger.error({
            message: "Contribution was not created",
            body: body,
            type: "contribution",
        });
        return res.status(400).json({ success: false, error: err });
    }

    await contrib
        .save()
        .then((data) => {
            logger.info({
                message: "Contribution was created",
                body: data,
                type: "contribution",
            });
            return res.status(201).json({
                success: true,
                id: contrib._id,
                message: "A contribution was added!",
            });
        })
        .catch((error) => {
            logger.error({
                message: "Contribution was not created",
                errorTrace: err,
                type: "contribution",
            });
            return res.status(400).json({
                error,
                message: "A contribution was not added!",
            });
        });
};

const updateContribution = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Contribution was not updated",
            body: body,
            type: "contribution",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    await Contribution.findOne({ _id: req.params.id }, (err, contrib) => {
        if (err || !contrib) {
            logger.error({
                message: "Contribution was not found",
                errorTrace: err,
                type: "contribution",
            });
            return res.status(404).json({
                err,
                message: "Contribution not found!",
            });
        }
        if(body.date) contrib.date = body.date;
        if(body.parameters) contrib.parameters = body.parameters;

        if (body.hasOwnProperty("isApproved")) {
            contrib.hasStatus = true;
            contrib.isApproved = body.isApproved;
        }
        contrib
            .save()
            .then((data) => {
                logger.info({
                    message: "Contribution was updated",
                    body: data,
                    type: "contribution",
                });
                return res.status(200).json({
                    success: true,
                    id: contrib._id,
                    message: "Contribution updated!",
                });
            })
            .catch((error) => {
                logger.error({
                    message: "Contribution was not updated",
                    errorTrace: error,
                    type: "contribution",
                });
                return res.status(404).json({
                    error,
                    message: "Contribution not updated!",
                });
            });
    });
};

const deleteContribution = async (req, res) => {
    await Contribution.findOneAndDelete(
        { _id: req.params.id },
        (err, contrib) => {
            if (err) {
                logger.error({
                    message: "Contribution was not deleted",
                    errorTrace: err,
                    type: "contribution",
                });
                return res.status(400).json({ success: false, error: err });
            }

            if (!contrib) {
                logger.error({
                    message: "Contribution was not found",
                    body: req.params.id,
                    type: "contribution",
                });
                return res
                    .status(404)
                    .json({ success: false, error: `Contribution not found` });
            }

            logger.info({
                message: "Contribution was deleted",
                body: contrib,
                type: "contribution",
            });
            return res.status(200).json({ success: true, data: contrib });
        }
    ).catch((err) => 
        logger.error({
            message: "Contribution was not deleted",
            errorTrace: err,
            type: "contribution",
        })
    )
};

const getContributionById = async (req, res) => {
    await Contribution.findOne({ _id: req.params.id }, (err, contrib) => {
        if (err) {
            logger.error({
                message: "Contribution was not found",
                errorTrace: err,
                type: "contribution",
            });
            return res.status(400).json({ success: false, error: err });
        }

        if (!contrib) {
            logger.error({
                message: "Contribution was not found",
                body: body,
                type: "contribution",
            });
            return res
                .status(404)
                .json({ success: false, error: `Contribution not found` });
        }
        logger.info({
            message: "Contribution was found",
            body: contrib,
            type: "contribution",
        });
        return res.status(200).json({ success: true, data: contrib });
    }).catch((err) =>
        logger.error({
            message: "Contribution was not found",
            errorTrace: err,
            type: "contribution",
        })
    )
};

const getContributionsByStatus = async (req, res) => {
    await Contribution.find(
        {
            ...((req.params.status == "approved" ||
                req.params.status == "denied") && {
                isApproved: req.params.status == "approved",
            }),
            hasStatus: req.params.status != "nostatus",
        },
        (err, contrib) => {
            if (err) {
                logger.error({
                    message: "Contribution was not found",
                    errorTrace: err,
                    type: "contribution",
                });
                return res.status(400).json({ success: false, error: err });
            }

            if (!contrib) {
                logger.error({
                    message: "Contribution was not found",
                    type: "contribution",
                });
                return res
                    .status(404)
                    .json({ success: false, error: `Contribution not found` });
            }
            logger.info({
                message: "Contribution was found",
                body: contrib,
                type: "contribution",
            });
            return res.status(200).json({ success: true, data: contrib });
        }
    ).catch((err) =>
        logger.error({
            message: "Contributions were not found",
            errorTrace: err,
            type: "contribution",
        })
    )
};

const getContributions = async (req, res) => {
    await Contribution.find({}, (err, contrib) => {
        if (err) {
            logger.error({
                message: "Contribution was not found",
                errorTrace: err,
                type: "contribution",
            });
            return res.status(400).json({ success: false, error: err });
        }
        if (!contrib.length) {
            logger.error({
                message: "Contribution was not found",
                type: "contribution",
            });
            return res
                .status(404)
                .json({ success: false, error: `Contribution not found` });
        }
        logger.info({
            message: "Contribution was found",
            body: contrib,
            type: "contribution",
        });
        return res.status(200).json({ success: true, data: contrib });
    }).catch((err) =>
        logger.error({
            message: "Contributions were not found",
            errorTrace: err,
            type: "contribution",
        })
    )
};

module.exports = {
    createContribution,
    updateContribution,
    deleteContribution,
    getContributionById,
    getContributionsByStatus,
    getContributions,
};
