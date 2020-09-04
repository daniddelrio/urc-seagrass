const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Modification = new Schema({
	// Site Info here is: Site Code + Year (e.g. CP2020)
    siteId: { type: Schema.Types.ObjectId, ref: "siteCoords" },
    year: { type: Number },
    changes: [{ field: String, newValue: mongoose.Mixed }],
}, { timestamps: true }, );

module.exports = mongoose.model('modification', Modification);