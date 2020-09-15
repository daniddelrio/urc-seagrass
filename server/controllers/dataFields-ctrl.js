const DataFields = require("../models/dataFields");

const createField = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide data",
        });
    }

    const data = new DataFields(body);

    if (!data) {
        return res.status(400).json({ success: false, error: err });
    }

    await data.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: data._id,
                message: "A field was added!",
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: "A field was not added!",
            });
        });
};

const updateField = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    await DataFields.findOne({ _id: req.params.id }, (err, field) => {
        if (err || !field) {
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
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: field._id,
                    message: "Field updated!",
                });
            })
            .catch((error) => {
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
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Field not found` });
        }
        return res.status(200).json({ success: true, data: data });
    }).catch((err) => console.log(err));
};

const getAllFields = async (req, res) => {
    await DataFields.find({}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!data.length) {
            return res
                .status(404)
                .json({ success: false, error: `Fields not found` });
        }
        return res.status(200).json({ success: true, data: data });
    }).catch((err) => console.log(err));
};

module.exports = {
    createField,
    updateField,
    getFieldById,
    getAllFields,
};
