const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contribution = new Schema({
    site: { type: Schema.Types.ObjectId, required: true },
    contributor: { type: String },
    date: { type: Date, required: true },
    seagrassCount: { type: Number },
    carbonPercentage: { type: Number },
    hasStatus: { type: Boolean, required: true, default: false },
    isApproved: { type: Boolean },
}, { timestamps: true }, );

module.exports = mongoose.model('contribution', Contribution);