const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SiteData = require('./siteInfo')

const Contribution = new Schema({
    site: { type: Schema.Types.ObjectId, required: true },
    contributor: { type: String },
    date: { type: Date, required: true },
    seagrassCount: { type: Number },
    carbonPercentage: { type: Number },
    hasStatus: { type: Boolean, required: true, default: false },
    isApproved: { type: Boolean },
}, { timestamps: true }, );

// If a contribution is approved, edit the site info given the site and year
Contribution.post('save', function(next) {
    var contribution = this;

    // only modify the site info if it has been modified (or is new)
    if (!contribution.isModified('isApproved')) return next();

    if(contribution.isApproved) {
    	const site = contribution.site
    	const year = contribution.date.year

    	SiteData.findOne({ site: site, year: year }, (err, data) => {
    	    if (err) {
    	        return res.status(404).json({
    	            err,
    	            message: 'Data not found!',
    	        })
    	    }
    	    if(contribution.seagrassCount) {
	    	    data.seagrassCount = contribution.seagrassCount
    	    }
    	    else if(contribution.carbonPercentage) {
	    	    data.carbonPercentage = contribution.carbonPercentage
    	    }
    	    data
    	        .save()
    	        .then(() => {
    	            return res.status(200).json({
    	                success: true,
    	                id: data._id,
    	                message: 'Site updated!',
    	            })
    	        })
    	        .catch(error => {
    	            return res.status(404).json({
    	                error,
    	                message: 'Site not updated!',
    	            })
    	        })
    	})

    	next();
    }
});


module.exports = mongoose.model('contribution', Contribution);