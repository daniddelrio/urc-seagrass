const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Modification = require("./modification");
const { takeModifications } = require('../config');
const logger = require("../logger")

const SiteData = new Schema(
    {
        siteId: { type: Schema.Types.ObjectId, ref: "siteCoords", required: true },
        year: { type: Number, required: true },
        status: {
            type: String,
            enum: [
                "DISTURBED",
                "CONSERVED",
            ],
        },
        parameters: [
            {
                paramId: { type: Schema.Types.ObjectId, ref: "dataFields" },
                paramAverage: Number,
                paramValues: [
                    {
                        value: Number,
                        contribution: { type: Schema.Types.ObjectId, ref: "contribution" },
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

SiteData.pre("save", function(next) {
    // Average all the paramValues
    this.parameters.forEach(param => {
        if(param.paramValues.length > 0) {
            param.paramAverage = param.paramValues.reduce((a, b) => a+parseFloat(b.value), 0) / (param.paramValues.length);
        }
    })
    next();
});

SiteData.pre("findOneAndUpdate", function(next) {
    // Average all the paramValues
    this._update.$set.parameters.forEach(param => {
        if(param.paramValues.length > 0) {
            console.log(param.paramValues)
            param.paramAverage = param.paramValues.reduce((a, b) => a+parseFloat(b.value), 0) / (param.paramValues.length);
        }
    })
    next();
});

// If a site is modified, create a Modification in order to log
SiteData.post("findOneAndUpdate", async function(result) {
    if(takeModifications == true) {
        let isModifiedAtAll = false;
        const changes = [];

        if (this._update["$set"].status) {
            isModifiedAtAll = true;
            changes.push({
                field: "status",
                newValue: this._update["$set"].status,
            });
        }

        this._update["$set"].parameters.forEach((field) => {
            if (field) {
                isModifiedAtAll = true;
                changes.push({
                    field: field.paramId,
                    newValue: field.paramAverage,
                });
            }
        });

        // only submit a modification if a field was modified
        if (isModifiedAtAll) {
            const modificationBody = {
                siteId: result.siteId,
                year: result.year,
                changes: changes,
            };

            const modification = new Modification(modificationBody);

            if (!modification) {
                logger.error({
                    message: "A modification couldn't be created!",
                    siteBody: modificationBody,
                    type: "modification",
                });
            }

            await modification
                .save()
                .then((data) => {
                    logger.info({
                        message: "A modification was added!",
                        siteBody: data,
                        type: "modification",
                    });
                })
                .catch((error) => {
                    logger.error({
                        message: "A modification was not added!",
                        errorTrace: error,
                        type: "modification",
                    });
                });
        }
    }
});

module.exports = mongoose.model("siteData", SiteData);
