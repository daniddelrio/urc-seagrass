const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SiteData = require('./siteInfo')
const SiteCoord = require('./siteCoord')
const dataFields = require('../dataFields')

const dataFieldsWithSchema = dataFields.reduce((obj, item) => (obj[item.value] = { type: Number }, obj), {})

const Contribution = new Schema({
    site: { type: String },
    coordinates: [mongoose.Mixed],
    contributor: { type: String },
    date: { type: Date, required: true },
    ...dataFieldsWithSchema,
    hasStatus: { type: Boolean, default: false },
    isApproved: { type: Boolean },
}, { timestamps: true }, );

Contribution.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

// If a contribution is approved, edit the site info given the site and year
Contribution.post('save', function(doc, next) {
    var contribution = this;

    // only modify the site info if it has been modified (or is new)
    // if (!contribution.isModified('isApproved')) return next();

    // don't modify the site info if it is new
    if (this.wasNew) return next();

    if(contribution.isApproved != null) {
    	const site = contribution.site
    	const year = new Date(contribution.date).getFullYear()
        const coordinates = contribution.coordinates

        if(site) {
            SiteData.findOne({ siteCode: site, year: year }, (err, data) => {
                if (err) {
                    console.log("Data not found")
                }
                dataFields.forEach(field => {
                    if(contribution[field.value]) {
                        data[field.value] = contribution[field.value]
                    }
                })
                data
                    .save()
                    .then(() => {
                        console.log("Site updated")
                    })
                    .catch(error => {
                        console.log("Site not updated")
                    })
            })
        }
        else if(coordinates) {
            const siteCoordBody = {
                type: "Feature",
                geometry: {
                    type: coordinates.length == 1 ? "Point" : "Polygon" ,
                    coordinates: coordinates.length == 1 ? coordinates : [coordinates],
                },
            };

            const siteCoord = new SiteCoord(siteCoordBody)

            if (!siteCoord) {
                console.log("New site not created")
            }

            siteCoord
                .save()
                .then(() => {
                    console.log("A new site was created!")
                })
                .catch(error => {
                    console.log("A new site was not created!")
                })
        }

    	next();
    }
});


module.exports = mongoose.model('contribution', Contribution);