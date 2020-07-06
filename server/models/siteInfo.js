const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Modification = require('./modification')
const dataFields = require('../dataFields')

const dataFieldsWithSchema = dataFields.reduce((obj, item) => (obj[item.value] = { type: Number }, obj), {})

const SiteData = new Schema({
    siteCode: { type: String, required: true },
    year: { type: Number, required: true },
    status: { type: String },
    ...dataFieldsWithSchema
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

    dataFields.forEach(field => {
        if (this._update["$set"][field.value]) {
            isModifiedAtAll = true;
            changes.push({
                field: field.value,
                newValue: this._update["$set"][field.value]
            });
        } 
    })

    // only submit a modification if a field was modified
    if(isModifiedAtAll) {

        const modificationBody = {
            siteCode: result.siteCode,
            year: result.year,
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