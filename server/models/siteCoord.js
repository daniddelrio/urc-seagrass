const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SiteCoords = new Schema({
    type: { type: String, default: "Feature" },
    properties: {
        siteCode: String,
        areaName: String,
        image: {
            data: Buffer, 
            contentType: String 
        }
    },
    geometry: {
        type: {
            type: String,
            enum: [
                "Point",
                "LineString",
                "Polygon",
                "MultiPoint",
                "MultiLineString",
                "MultiPolygon",
            ],
            required: true
        },
        coordinates: { type: [mongoose.Mixed], required: true},
    },
});

module.exports = mongoose.model("siteCoords", SiteCoords);
