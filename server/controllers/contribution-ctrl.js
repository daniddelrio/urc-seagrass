const Contribution = require('../models/contribution');
const dataFields = require('../dataFields')

createContribution = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide data',
        })
    };

    const contrib = new Contribution(body)

    if (!contrib) {
        return res.status(400).json({ success: false, error: err })
    }

    contrib
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: contrib._id,
                message: 'A contribution was added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'A contribution was not added!',
            })
        })
}

updateContribution = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Contribution.findOne({ _id: req.params.id }, (err, contrib) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Contribution not found!',
            })
        }
        contrib.date = body.date
        dataFields.forEach(field => {
            contrib[field.value] = body[field.value]
        })
        if(body.isApproved != null) {
            body.hasStatus = true
            contrib.isApproved = body.isApproved
        }
        contrib
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: contrib._id,
                    message: 'Contribution updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Contribution not updated!',
                })
            })
    })
}

deleteContribution = async (req, res) => {
    await Contribution.findOneAndDelete({ _id: req.params.id }, (err, contrib) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!contrib) {
            return res
                .status(404)
                .json({ success: false, error: `Contribution not found` })
        }

        return res.status(200).json({ success: true, data: contrib })
    }).catch(err => console.log(err))
}

getContributionById = async (req, res) => {
    await Contribution.findOne({ _id: req.params.id }, (err, contrib) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!contrib) {
            return res
                .status(404)
                .json({ success: false, error: `Contribution not found` })
        }
        return res.status(200).json({ success: true, data: contrib })
    }).catch(err => console.log(err))
}

getContributionsByStatus = async (req, res) => {
    await Contribution.find({ 
        isApproved: req.params.status == "approved" ? true : 
        req.params.status == "denied" ? false : null,
        hasStatus: req.params.status != "nostatus"
    }, (err, contrib) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!contrib) {
            return res
                .status(404)
                .json({ success: false, error: `Contribution not found` })
        }
        return res.status(200).json({ success: true, data: contrib })
    }).catch(err => console.log(err))
}

getContributions = async (req, res) => {
    await Contribution.find({}, (err, contrib) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!contrib.length) {
            return res
                .status(404)
                .json({ success: false, error: `Contribution not found` })
        }
        return res.status(200).json({ success: true, data: contrib })
    }).catch(err => console.log(err))
}

module.exports = {
    createContribution,
    updateContribution,
    deleteContribution,
    getContributionById,
    getContributionsByStatus,
    getContributions,
}