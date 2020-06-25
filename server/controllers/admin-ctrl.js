const Admin = require('../models/admin');

createAdmin = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide data',
        })
    };

    const admin = new Admin(body)

    if (!admin) {
        return res.status(400).json({ success: false, error: err })
    }

    admin
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: admin._id,
                message: 'An admin was created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'An admin was not created!',
            })
        })
}

updateAdmin = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Admin.findOne({ username: req.params.username }, (err, admin) => {
        if (err || !admin) {
            return res.status(404).json({
                err,
                message: 'Admin not found!',
            })
        }
        admin.username = body.username
        admin.password = body.password
        admin
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: admin._id,
                    message: 'Admin updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Admin not updated due to an error!',
                })
            })
    })
}

deleteAdmin = async (req, res) => {
    await Admin.findOneAndDelete({ username: req.params.username }, (err, admin) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!admin) {
            return res
                .status(404)
                .json({ success: false, error: `Admin not found` })
        }

        return res.status(200).json({ success: true, data: admin })
    }).catch(err => console.log(err))
}

getAdminByUsername = async (req, res) => {
    await Admin.findOne({ username: req.params.username }, (err, admin) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!admin) {
            return res
                .status(404)
                .json({ success: false, error: `Admin not found` })
        }
        return res.status(200).json({ success: true, data: admin })
    }).catch(err => console.log(err))
}

getAdmins = async (req, res) => {
    await Admin.find({}, (err, admin) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!admin.length) {
            return res
                .status(404)
                .json({ success: false, error: `Admins not found` })
        }
        return res.status(200).json({ success: true, data: admin })
    }).catch(err => console.log(err))
}

module.exports = {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByUsername,
    getAdmins,
}