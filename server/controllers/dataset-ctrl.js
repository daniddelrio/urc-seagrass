const SiteCoord = require("../models/siteCoord");
const SiteData = require("../models/siteInfo");
const DataFields = require("../models/dataFields");
const Contribution = require("../models/contribution");

const formatDateTime = (datetime, hasTime) => {
    const month = datetime.getMonth() + 1;
    const day = datetime.getDate();
    const year = datetime.getFullYear();
    if (hasTime) {
        return `${month}/${day}/${year} ${datetime.getHours()}:${datetime.getMinutes()}`;
    }

    return `${month}/${day}/${year}`;
};

const getDataset = async (req, res) => {
    let headers = [
        { key: "type", label: "Type" },
        { key: "replicate", label: "Replicate" },
        { key: "contributor", label: "Contributor" },
        { key: "loggingDateTime", label: "Date and Time Logged" },
        { key: "measuringDate", label: "Measuring Date" },
        { key: "site", label: "Site" },
        { key: "year", label: "Year" },
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
            key: field.value,
            label: field.label,
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
                [coord._id]: { ...otherProps, ...coord.geometry, _id: coord._id },
            };
        }, {});
    }).catch((err) => console.log(err));

    let siteDataObj = [];
    let dataWithoutContribs = [];
    await SiteData.find({}, (err, siteData) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!siteData.length) {
            return res
                .status(404)
                .json({ success: false, error: `Site data not found` });
        }

        siteDataObj = siteData;
        // siteDataObj = siteData.reduce((accumulator, data) => {
        //     return {
        //         ...accumulator,
        //         [data.siteId + " " + data.year]: data.toObject(),
        //     };
        // }, {});

        siteData.forEach((data) => {
            const paramsWithoutContribs = data.parameters
                .map((param) => ({
                    ...param.toObject(),
                    paramValue:
                        param.paramValues.find(
                            (paramValue) => !paramValue.contribution
                        ) &&
                        param.paramValues.find(
                            (paramValue) => !paramValue.contribution
                        ).value,
                }))
                .filter((param) => param.paramValue);
            // Make a "contrib" out of the data without links to the contrib
            if (paramsWithoutContribs.length > 0) {
                dataWithoutContribs.push({
                    ...data.toObject(),
                    date: new Date(data.year, 1, 1),
                    parameters: paramsWithoutContribs,
                    isFromAdmin: true,
                });
            }
        });
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

        contribs = contribs.concat(dataWithoutContribs);

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

        const getDataObject = (currContrib) =>
            siteDataObj.find(
                (data) =>
                    (currContrib.date && data.year === currContrib.date.getFullYear()) &&
                    (currContrib.siteId ? new String(data.siteId).valueOf() ===
                        new String(currContrib.siteId).valueOf() :
                        new String(currContrib.areaName).valueOf() ===
                            new String(
                                sites[data.siteId].areaName
                            ).valueOf())
            );

        const filteredContribs = contribs.filter(contrib => !!getDataObject(contrib));

        filteredContribs.forEach((contrib, idx) => {
            // Find first based on siteId and year, but if siteId can't be found in contrib, look for the area name
            const currData = getDataObject(contrib);
            // const currData =
            //     siteDataObj[contrib.siteId + " " + contrib.date.getFullYear()];

            if (currData) {
                const currSite = sites[currData.siteId];

                // Check previous row to see whether to add replicate or reset
                const prevContrib = idx > 0 && filteredContribs[idx - 1];
                const prevData = getDataObject(prevContrib)
                const prevSite = prevData && sites[prevData.siteId];
                if (
                    idx > 0 &&
                    (prevSite
                        ? new String(currSite._id).valueOf() ===
                          new String(prevSite._id).valueOf()
                        : new String(currData.siteId).valueOf() ===
                          new String(prevContrib.siteId).valueOf()) &&
                    contrib.date.getFullYear() ===
                        prevContrib.date.getFullYear()
                ) {
                    currReplicate++;
                } else {
                    currReplicate = 1;
                }

                rows.push({
                    type: currData.status,
                    replicate: currReplicate, // change
                    contributor: contrib.contributor || "Anonymous",
                    loggingDateTime: formatDateTime(contrib.createdAt, true),
                    measuringDate: contrib.isFromAdmin
                        ? ""
                        : formatDateTime(contrib.date, false),
                    site:
                        currSite.siteCode ||
                        currSite.areaName ||
                        currSite.coordinates,
                    year: contrib.date.getFullYear(),
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

    return res
        .status(200)
        .json({ success: true, headers: headers, data: rows });
};

module.exports = {
    getDataset,
};
