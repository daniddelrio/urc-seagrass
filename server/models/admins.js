const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiteData = new Schema({
    site: { type: Schema.Types.ObjectId, required: true },
    year: { type: Number, required: true },
    status: { type: String },
    seagrassCount: { type: Number },
    carbonPercentage: { type: Number },

}, { timestamps: true }, );

module.exports = mongoose.model('siteData', SiteGeoJSON);