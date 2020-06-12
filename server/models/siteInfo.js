const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Modification = require('./modification')

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

// If a site is modified, create a Modification in order to log
SiteData.post('save', function(next) {
    var siteData = this;

    const isModifiedAtAll = false;
    const changes = [];
    if (siteData.isModified('seagrassCount')) {
    	isModifiedAtAll = true;
    	changes.append({
    		field: 'seagrassCount',
    		newValue: this.seagrassCount
    	});
    } 
    if (siteData.isModified('carbonPercentage')) {
    	isModifiedAtAll = true;
    	changes.append({
    		field: 'carbonPercentage',
    		newValue: this.carbonPercentage
    	});
    }

    // only submit a modification if a field was modified
    if(!isModifiedAtAll) {
    	return next();
    }

    const modificationBody = {
    	siteInfo: this._id,
    	changes: changes,
    };

    const modification = new Modification(modificationBody)

	if (!modification) {
	    return res.status(400).json({ success: false, error: err })
	}

	modification
	    .save()
	    .then(() => {
	        return res.status(201).json({
	            success: true,
	            id: modification._id,
	            message: 'A modification was added!',
	        })
	    })
	    .catch(error => {
	        return res.status(400).json({
	            error,
	            message: 'A modification was not added!',
	        })
	    })

	next();
});

module.exports = mongoose.model('siteData', SiteData);