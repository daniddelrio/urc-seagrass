const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Modification = require('./modification')

const SiteData = new Schema({
    siteCode: { type: String, required: true },
    year: { type: Number, required: true },
    status: { type: String },
    seagrassCount: { type: Number },
    carbonPercentage: { type: Number },

}, { timestamps: true }, );

// If a site is modified, create a Modification in order to log
SiteData.post('findOneAndUpdate', function(result) {
    let isModifiedAtAll = false;
    const changes = [];
    if (this._update["$set"].status) {
    	isModifiedAtAll = true;
    	changes.push({
    		field: 'status',
    		newValue: this._update["$set"].status
    	});
    } 
    if (this._update["$set"].seagrassCount) {
        isModifiedAtAll = true;
        changes.push({
            field: 'seagrassCount',
            newValue: this._update["$set"].seagrassCount
        });
    } 
    if (this._update["$set"].carbonPercentage) {
    	isModifiedAtAll = true;
    	changes.push({
    		field: 'carbonPercentage',
    		newValue: this._update["$set"].carbonPercentage
    	});
    }

    // only submit a modification if a field was modified
    if(isModifiedAtAll) {

        const modificationBody = {
        	siteInfo: this._id,
        	changes: changes,
        };

        const modification = new Modification(modificationBody)

    	if (!modification) {
            console.log("A modification couldn't be created!")
    	}

    	modification
    	    .save()
    	    .then(() => {
    	        console.log("A modification was added!")
    	    })
    	    .catch(error => {
    	        console.log("A modification was not added!")
                console.log(error)
    	    })
    }
});

module.exports = mongoose.model('siteData', SiteData);