const SiteData = require("../models/siteInfo");
const dataFields = require('../dataFields')

createData = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide data",
        });
    }

    const data = new SiteData(body);

    if (!data) {
        return res.status(400).json({ success: false, error: err });
    }

    data.save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: data._id,
                message: "Data was added!",
            });
        })
        .catch((error) => {
            return res.status(400).json({
                error,
                message: "Data was not added!",
            });
        });
};

updateData = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    const dataFieldsObj = dataFields.reduce((obj, item) => ({...obj, ...(body[item.value] !== undefined && {
        [item.value]: body[item.value]
    })}), {})

    SiteData.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                ...(body.status !== undefined && { status: body.status }),
                ...dataFieldsObj
            },
        },
        { new: true },
        (err, data) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: "Data not found!",
                });
            }

            return res.status(200).json({ success: true, data: data });
        }
    );
};

deleteData = async (req, res) => {
    await SiteData.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }

        return res.status(200).json({ success: true, data: data });
    }).catch((err) => console.log(err));
};

getSiteDataById = async (req, res) => {
    await SiteData.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        return res.status(200).json({ success: true, data: data });
    }).catch((err) => console.log(err));
};

getSiteDataByYear = async (req, res) => {
    await SiteData.find({ year: req.params.year }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        return res.status(200).json({ success: true, data: data });
    }).catch((err) => console.log(err));
};

getAllSiteData = async (req, res) => {
    await SiteData.find({}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!data.length) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        return res.status(200).json({ success: true, data: data });
    }).catch((err) => console.log(err));
};

module.exports = {
    createData,
    updateData,
    deleteData,
    getAllSiteData,
    getSiteDataById,
    getSiteDataByYear,
};
