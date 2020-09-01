const SiteCoord = require("../models/siteCoord");
const SiteData = require("../models/siteInfo");
const DataFields = require("../models/dataFields");

const getDataset = async (req, res) => {
    let headers = [
        { id: "type", title: "Type" },
        { id: "replicate", title: "Replicate" },
        { id: "contributor", title: "Contributor" },
        { id: "loggingDateTime", title: "Date and Time Logged" },
        { id: "measuringDate", title: "Measuring Date" },
        { id: "site", title: "Site" },
    ];
    let parameters = [];
    await DataFields.find({}, (err, fields) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!fields.length) {
            return res
                .status(404)
                .json({ success: false, error: `Fields not found` });
        }
        parameters = fields.map((field) => ({ [field._id]: field }));
        const parametersHeaders = fields.map((field) => ({
            id: field.value,
            title: field.label,
        }));
        headers = headers.concat(parametersHeaders);
    }).catch((err) => console.log(err));

    let sites = [];
    await SiteCoord.find({}, (err, siteCoord) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!siteCoord.length) {
            return res
                .status(404)
                .json({ success: false, error: `Sites not found` });
        }
        sites = siteCoord.map((coord) => {
            const { image, ...otherProps } = coord.properties;
            return {
                [coord._id]: { ...otherProps, ...coord.geometry },
            };
        });
    }).catch((err) => console.log(err));

    const data = [
        {
            name: "John",
            surname: "Snow",
            age: 26,
            gender: "M",
        },
        {
            name: "Clair",
            surname: "White",
            age: 33,
            gender: "F",
        },
        {
            name: "Fancy",
            surname: "Brown",
            age: 78,
            gender: "F",
        },
    ];

    let rows = [];
    await SiteData.find({}, (err, siteData) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!siteData.length) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }
        console.log(siteData);
        siteData.forEach((data) => {
            const currSite = sites[data.siteId];
            data.parameters.forEach((param, idx) => {
                rows = rows.concat(
                    param.paramValues.map((value) => ({
                        type: data.status,
                        replicate: idx + 1,
                        contributor: "",
                        loggingDateTime: new Date(),
                        measuringDate: new Date(),
                        site: currSite.siteCode,
                        
                    }))
                );
            });
        });
    }).catch((err) => console.log(err));

    return res.status(200).json({ success: true, data: [] });
};

module.exports = {
    getDataset,
};
