const SiteCoord = require("../models/siteCoord");
const SiteData = require("../models/siteInfo");
const DataFields = require("../models/dataFields");
const Contribution = require("../models/contribution");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: "out.csv",
    header: [
        { id: "name", title: "Name" },
        { id: "surname", title: "Surname" },
        { id: "age", title: "Age" },
        { id: "gender", title: "Gender" },
    ],
});

const getDataset = async (req, res) => {
    let headers = [
        { id: "type", title: "Type" },
        { id: "replicate", title: "Replicate" },
        { id: "contributor", title: "Contributor" },
        { id: "loggingDateTime", title: "Date and Time Logged" },
        { id: "measuringDate", title: "Measuring Date" },
        { id: "site", title: "Site" },
    ];
    let parameters = {};
    await DataFields.find({}, (err, fields) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!fields.length) {
            return res
                .status(404)
                .json({ success: false, error: `Fields not found` });
        }
        parameters = fields.reduce(
            (accumulator, field) => ({ ...accumulator, [field._id]: field }),
            {}
        );
        const parametersHeaders = fields.map((field) => ({
            id: field.value,
            title: field.label,
        }));
        headers = headers.concat(parametersHeaders);
    }).catch((err) => console.log(err));

    let sites = {};
    await SiteCoord.find({}, (err, siteCoord) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!siteCoord.length) {
            return res
                .status(404)
                .json({ success: false, error: `Sites not found` });
        }
        sites = siteCoord.reduce((accumulator, coord) => {
            const { image, ...otherProps } = coord.properties;
            return {
                ...accumulator,
                [coord._id]: { ...otherProps, ...coord.geometry },
            };
        }, {});
    }).catch((err) => console.log(err));

    let siteDataObj = {};
    await SiteData.find({}, (err, siteData) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!siteData.length) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }

        siteDataObj = siteData.reduce((accumulator, data) => {
            return {
                ...accumulator,
                [data.siteId + " " + data.year]: { ...data.toObject() },
            };
        }, {});
    }).catch((err) => console.log(err));

    let rows = [];
    await Contribution.find({ isApproved: true }, (err, contribs) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!contribs.length) {
            return res
                .status(404)
                .json({ success: false, error: `Contributions not found` });
        }

        contribs.sort(function(a, b) {
            let dateA = a.date;
            let dateB = b.date;
            let yearA = dateA.getFullYear();
            let yearB = dateB.getFullYear();
            let siteIdA = new String(a.siteId).valueOf(); // ignore upper and lowercase
            let siteIdB = new String(b.siteId).valueOf(); // ignore upper and lowercase

            if (yearA < yearB) {
                return 1;
            }
            if (yearA > yearB) {
                return -1;
            }

            if (yearA == yearB) {
                if (siteIdA < siteIdB) {
                    return -1;
                }
                if (siteIdA > siteIdB) {
                    return 1;
                }

                if (siteIdA === siteIdB) {
                    if (dateA < dateB) {
                        return -1;
                    }
                    if (dateA > dateB) {
                        return 1;
                    }
                }
            }

            return 0;
        });

        let currReplicate = 1;

        contribs.forEach((contrib, idx) => {
            const currData =
                siteDataObj[contrib.siteId + " " + contrib.date.getFullYear()];

            if (currData) {
                const currSite = sites[contrib.siteId];

                // Check previous row to see whether to add replicate or reset
                if (
                    idx > 0 &&
                    new String(contrib.siteId).valueOf() ===
                        new String(contribs[idx - 1].siteId).valueOf() &&
                    contrib.date.getFullYear() ===
                        contribs[idx - 1].date.getFullYear()
                ) {
                    currReplicate++;
                }
                else {
                    currReplicate = 1;
                }

                rows.push({
                    type: currData.status,
                    replicate: currReplicate, // change
                    contributor: contrib.contributor || "Anonymous",
                    loggingDateTime: contrib.createdAt,
                    measuringDate: contrib.date,
                    site:
                        currSite.siteCode ||
                        currSite.areaName ||
                        currSite.coordinates,
                    ...contrib.parameters.reduce(
                        (accumulator, param) => ({
                            ...accumulator,
                            [parameters[param.paramId].value]: param.paramValue,
                        }),
                        {}
                    ),
                });
            }
        });
    }).catch((err) => console.log(err));

    return res.status(200).json({ success: true, data: rows });
};

module.exports = {
    getDataset,
};
