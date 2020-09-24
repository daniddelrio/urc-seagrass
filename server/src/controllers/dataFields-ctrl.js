const DataFields = require("../models/dataFields");
const logger = require("../logger")

const createField = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Data fields were not created",
            body: body,
            type: "dataFields",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide data",
        });
    }

    const data = new DataFields(body);

    if (!data) {
        logger.error({
            message: "Data fields were not created",
            body: body,
            type: "dataFields",
        });
        return res.status(400).json({ success: false, error: err });
    }

    await data.save()
        .then((data) => {
            logger.info({
                message: "Data fields were created",
                body: data,
                type: "dataFields",
            });
            return res.status(201).json({
                success: true,
                id: data._id,
                message: "A field was added!",
            });
        })
        .catch((error) => {
            logger.error({
                message: "Data fields were not created",
                errorTrace: err,
                type: "dataFields",
            });
            return res.status(400).json({
                error,
                message: "A field was not added!",
            });
        });
};

const updateField = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Data fields were not updated",
            body: body,
            type: "dataFields",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    await DataFields.findOne({ _id: req.params.id }, (err, field) => {
        if (err || !field) {
            logger.error({
                message: "Data fields were not updated",
                errorTrace: err,
                type: "dataFields",
            });
            return res.status(404).json({
                err,
                message: "Field not found!",
            });
        }
        field.label = body.label;
        if(field.unit) field.unit = body.unit;
        if(field.standards) field.standards = body.standards;
        field
            .save()
            .then((data) => {
                logger.info({
                    message: "Data fields were updated",
                    body: data,
                    type: "dataFields",
                });
                return res.status(200).json({
                    success: true,
                    id: field._id,
                    message: "Field updated!",
                });
            })
            .catch((error) => {
                logger.error({
                    message: "Data fields were not updated",
                    errorTrace: err,
                    type: "dataFields",
                });
                return res.status(404).json({
                    error,
                    message: "Field not updated due to an error!",
                });
            });
    });
};

const getFieldById = async (req, res) => {
    await DataFields.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            logger.error({
                message: "Data fields were not found",
                errorTrace: err,
                type: "dataFields",
            });
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            logger.error({
                message: "Data fields were not found",
                body: req.params.id,
                type: "dataFields",
            });
            return res
                .status(404)
                .json({ success: false, error: `Field not found` });
        }
        logger.info({
            message: "Data fields were found",
            body: data,
            type: "dataFields",
        });
        return res.status(200).json({ success: true, data: data });
    }).catch((err) =>
        logger.error({
            message: "Data fields were not found",
            errorTrace: err,
            type: "dataFields",
        })
    );
};

const getAllFields = async (req, res) => {
    await DataFields.find({}, (err, data) => {
        if (err) {
            logger.error({
                message: "Data fields were not found",
                errorTrace: err,
                type: "dataFields",
            });
            return res.status(400).json({ success: false, error: err });
        }
        if (!data.length) {
            logger.error({
                message: "Data fields were not found",
                type: "dataFields",
            });
            return res
                .status(404)
                .json({ success: false, error: `Fields not found` });
        }
        logger.info({
            message: "Data fields were found",
            body: data,
            type: "dataFields",
        });
        return res.status(200).json({ success: true, data: data });
    }).catch((err) =>
        logger.error({
            message: "Data fields were not found",
            errorTrace: err,
            type: "dataFields",
        })
    );
};

module.exports = {
    createField,
    updateField,
    getFieldById,
    getAllFields,
};
