const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const SiteGeoJSON = new Schema({
//     name: { type: String, required: true },
//     time: { type: [String], required: true },
//     rating: { type: Number, required: true },
// });

// module.exports = mongoose.model('siteGeoJSON', SiteGeoJSON);

const SiteData = new Schema({
    // site: [
    //     { type: Schema.Types.ObjectId, ref: 'siteGeoJSON' }
    // ],
    site: { type: Schema.Types.ObjectId, required: true },
    year: { type: Number, required: true },
    status: { type: String },
    seagrassCount: { type: Number },
    carbonPercentage: { type: Number },

}, { timestamps: true }, );

module.exports = mongoose.model('siteData', SiteData);