const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Modification = require("./modification");
const { takeModifications } = require('../config');

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
                paramValues: [Number]
            }
        ]
    },
    { timestamps: true }
);

SiteData.pre("save", function(next) {
    // Average all the paramValues
    this.parameters.forEach(param => {
        if(param.paramValues.length > 0)
            param.paramAverage = param.paramValues.reduce((a, b) => a+b) / (param.paramValues.length);
    })
    next();
});

// If a site is modified, create a Modification in order to log
SiteData.post("findOneAndUpdate", function(result) {
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
                console.log("A modification couldn't be created!");
            }

            modification
                .save()
                .then(() => {
                    console.log("A modification was added!");
                })
                .catch((error) => {
                    console.log("A modification was not added!");
                    console.log(error);
                });
        }
    }
});

module.exports = mongoose.model("siteData", SiteData);
