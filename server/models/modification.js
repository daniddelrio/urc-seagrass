const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Modification = new Schema({
    siteInfo: { type: Schema.Types.ObjectId, ref: 'siteData' },
    changes: [{ field: String, newValue: Number }],
}, { timestamps: true }, );

module.exports = mongoose.model('modification', Modification);