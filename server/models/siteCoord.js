const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SiteCoords = new Schema({
    properties: {
        siteCode: String,
        areaName: String,
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
        },
        coordinates: [mongoose.Mixed],
    },
});

module.exports = mongoose.model("siteCoords", SiteCoords);
