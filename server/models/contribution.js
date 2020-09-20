const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SiteData = require("./siteInfo");
const SiteCoord = require("./siteCoord");
const logger = require("../logger")

const Contribution = new Schema(
    {
        siteId: { type: Schema.Types.ObjectId, ref: "siteCoords" },
        areaName: { type: String },
        coordinates: [mongoose.Mixed],
        contributor: { type: String },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["DISTURBED", "CONSERVED"],
        },
        parameters: [
            {
                paramId: { type: Schema.Types.ObjectId, ref: "dataFields" },
                paramValue: Number,
            },
        ],
        hasStatus: { type: Boolean, default: false },
        isApproved: { type: Boolean },
    },
    { timestamps: true }
);

Contribution.pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
});

// If a contribution is approved, edit the site info given the site and year
Contribution.post("save", async function(doc, next) {
    var contribution = this;

    // only modify the site info if it has been modified (or is new)
    // if (!contribution.isModified('isApproved')) return next();

    // don't modify the site info if it is new
    if (this.wasNew) return next();

    if (contribution.isApproved != null && contribution.isApproved == true) {
        const siteId = contribution.siteId;
        const year = new Date(contribution.date).getFullYear();
        const coordinates = contribution.coordinates;
        const parameters = contribution.parameters;

        if (siteId) {
            await SiteData.findOne({ siteId: siteId, year: year }, async (err, data) => {
                if (err || !data) {
                    logger.info({
                        message: "Site data not found. Creating a new record.",
                        type: "contribution",
                    });
                    const newParameters = parameters.map(param => {
                        let tempParam = param.toObject();
                        tempParam.paramValues = [{
                            value: tempParam.paramValue,
                            contribution: contribution._id
                        }];
                        return tempParam;
                    })

                    const dataBody = {
                        siteId,
                        year,
                        status: contribution.status,
                        parameters: newParameters,
                    };

                    const siteData = new SiteData(dataBody);

                    if (!siteData) {
                        logger.info({
                            message: "New site data not created",
                            type: "contribution",
                        });
                    }

                    await siteData
                        .save()
                        .then((data) => {
                            logger.info({
                                message: "New site data was created!",
                                type: "contribution",
                            });
                        })
                        .catch((error) => {
                            logger.error({
                                message: "New site data was not created!",
                                errorTrace: error,
                                type: "contribution",
                            });
                        });
                } else {
                    // Parameters of the current contribution
                    parameters.forEach(param => {
                        const paramInData = data.parameters.find((dataParam) => new String(dataParam.paramId).valueOf() === new String(param.paramId).valueOf());
                        if(paramInData && paramInData.paramValues) {
                            paramInData.paramValues.push({
                                value: param.paramValue,
                                contribution: contribution._id
                            })
                        }
                        else {
                            data.parameters.push(
                                {
                                    paramId: param.paramId,
                                    paramValues: [
                                        {
                                            value: param.paramValue,
                                            contribution: contribution._id,
                                        }
                                    ]
                                }
                            )
                        }
                    })

                    await data.save()
                        .then((newData) => {
                            logger.info({
                                message: "Site updated",
                                type: "contribution",
                            });
                        })
                        .catch((error) => {
                            logger.error({
                                message: "Site not updated!",
                                errorTrace: error,
                                type: "contribution",
                            });
                        });
                }
            });
        } else if (coordinates) {
            const newSiteName =
                contribution.areaName ||
                `${!contribution.contributor || "Anonymous"} ${
                    contribution.date
                } ${contribution.coordinates[0]}`;
            const siteCoordBody = {
                type: "Feature",
                properties: {
                    areaName: newSiteName,
                },
                geometry: {
                    type: coordinates.length > 1 ? "Point" : "Polygon",
                    coordinates:
                        coordinates.length > 1 ? coordinates : [coordinates],
                },
            };

            const siteCoord = new SiteCoord(siteCoordBody);

            if (!siteCoord) {
                logger.error({
                    message: "New site was not created!",
                    siteBody: siteCoordBody,
                    type: "contribution",
                });
                next();
            }

            await siteCoord
                .save()
                .then(async (res) => {
                    const newParameters = parameters.map(param => {
                        let tempParam = param.toObject();
                        tempParam.paramValues = [{
                            value: tempParam.paramValue,
                            contribution: contribution._id
                        }];
                        return tempParam;
                    });

                    const dataBody = {
                        siteId: res._id,
                        year,
                        status: contribution.status,
                        parameters: newParameters,
                    };

                    const siteData = new SiteData(dataBody);

                    await siteData
                        .save()
                        .then((newData) => {
                            logger.info({
                                message: "New site data was created!",
                                type: "contribution",
                            });
                        })
                        .catch((error) => {
                            logger.error({
                                message: "New site data was not created!",
                                errorTrace: error,
                                type: "contribution",
                            });
                        });
                })
                .catch((error) => {
                    logger.error({
                        message: "A new site was not created!",
                        errorTrace: error,
                        type: "contribution",
                    });
                });
        }
    }

    next();
});

module.exports = mongoose.model("contribution", Contribution);
