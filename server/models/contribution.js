const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SiteData = require("./siteInfo");
const SiteCoord = require("./siteCoord");

const Contribution = new Schema(
    {
        siteId: { type: Schema.Types.ObjectId, ref: "siteCoords" },
        areaName: { type: String },
        siteCode: { type: String },
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
Contribution.post("save", function(doc, next) {
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
            SiteData.findOne({ siteId: siteId, year: year }, (err, data) => {
                if (err || !data) {
                    console.log("Site data not found. Creating a new record.");
                    const newParameters = parameters.map(param => {
                        let tempParam = param.toObject();
                        tempParam.paramValues = [tempParam.paramValue];
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
                        console.log("New site data not created");
                    }

                    siteData
                        .save()
                        .then(() => {
                            console.log("New site data was created!");
                        })
                        .catch((error) => {
                            // console.log(error);
                            console.log("New site data was not created!");
                        });
                } else {
                    data.parameters = data.parameters.map(param => {
                        const paramInData = parameters.find((dataParam) => new String(dataParam.paramId).valueOf() === new String(param.paramId).valueOf());
                        if(paramInData && paramInData.paramValue) {
                            param.paramValues.push(paramInData.paramValue)
                        }
                        return param;
                    })
                    data.save()
                        .then(() => {
                            console.log("Site updated");
                        })
                        .catch((error) => {
                            console.log(error);
                            console.log("Site not updated");
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
                    siteCode: contribution.siteCode,
                },
                geometry: {
                    type: coordinates.length > 1 ? "Point" : "Polygon",
                    coordinates:
                        coordinates.length > 1 ? coordinates : [coordinates],
                },
            };

            const siteCoord = new SiteCoord(siteCoordBody);

            if (!siteCoord) {
                console.log("New site not created");
            }

            siteCoord
                .save()
                .then(() => {
                    console.log("A new site was created!");

                    const dataBody = {
                        siteCode: newSiteName,
                        year,
                        status,
                        parameters,
                    };

                    const siteData = new SiteData(dataBody);

                    if (!siteData) {
                        console.log("New site data not created");
                    }

                    siteData
                        .save()
                        .then(() => {
                            console.log("New site data was created!");
                        })
                        .catch((error) => {
                            console.log("New site data was not created!");
                        });
                })
                .catch((error) => {
                    console.log("A new site was not created!");
                });
        }
    }

    next();
});

module.exports = mongoose.model("contribution", Contribution);
