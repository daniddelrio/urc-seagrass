const Admin = require("../models/admin");
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config')
const logger = require("../logger")

const signIn = async (req, res) => {
    await Admin.findOne(
        {
            username: req.body.username,
        },
        (err, admin) => {
            if (err) throw err;

            if (!admin) {
                logger.error({
                    message: "Authentication failed. Admin not found.",
                    body: req.body,
                    type: "admin",
                });
                res.status(401).send({
                    success: false,
                    msg: "Authentication failed. Admin not found.",
                });
            } else {
                // check if password matches
                admin.comparePassword(req.body.password, (err, isMatch) => {
                    if (isMatch && !err) {

                        var expires = "1d";
                        // if admin is found and password is right create a token
                        var token = jwt.sign(admin.toJSON(), jwtSecret, {
                            expiresIn: expires,
                        });

                        const { isMaster, username } = admin;

                        logger.info({
                            message: "Authentication successful.",
                            body: { isMaster, username },
                            type: "admin",
                        });
                        // return the information including token as JSON
                        res.json({ success: true, token: token, expiresIn: expires, isMaster, username });
                    } else {
                        logger.error({
                            message: "Authentication failed. Wrong password.",
                            errorTrace: err,
                            type: "admin",
                        });
                        res.status(401).send({
                            success: false,
                            msg: "Authentication failed. Wrong password.",
                        });
                    }
                });
            }
        }
    ).select('+password');
};

const createAdmin = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Admin was not created because of lack of data",
            type: "admin",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide data",
        });
    }

    const admin = new Admin(body);

    if (!admin) {
        logger.error({
            message: "Admin not created due to an error",
            body: admin,
            type: "admin",
        });
        return res.status(400).json({ success: false, error: "Admin not created due to an error" });
    }

    await admin
        .save()
        .then((data) => {
            logger.info({
                message: "Admin was successfully created",
                body: data,
                type: "admin",
            });
            return res.status(201).json({
                success: true,
                id: admin._id,
                message: "An admin was created!",
            });
        })
        .catch((error) => {
            logger.error({
                message: "Admin creation was not successful.",
                errorTrace: error,
                type: "admin",
            });
            return res.status(400).json({
                error,
                message: "An admin was not created!",
            });
        });
};

const updateAdmin = async (req, res) => {
    const body = req.body;

    if (!body) {
        logger.error({
            message: "Admin was not updated because of lack of data",
            type: "admin",
        });
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }

    await Admin.findOne({ username: req.params.username }, (err, admin) => {
        if (err || !admin) {
            logger.error({
                message: "Admin to be updated was not found",
                errorTrace: err,
                type: "admin",
            });
            return res.status(404).json({
                err,
                message: "Admin not found!",
            });
        }
        admin.username = body.username;
        admin.password = body.password;
        if(body.isMaster) admin.isMaster = body.isMaster;
        admin
            .save()
            .then((data) => {
                logger.info({
                    message: "Admin updated",
                    body: data,
                    type: "admin",
                });
                return res.status(200).json({
                    success: true,
                    id: admin._id,
                    message: "Admin updated!",
                });
            })
            .catch((error) => {
                logger.error({
                    message: "Admin not updated due to an error",
                    errorTrace: error,
                    type: "admin",
                });
                return res.status(404).json({
                    error,
                    message: "Admin not updated due to an error!",
                });
            });
    });
};

const deleteAdmin = async (req, res) => {
    await Admin.findOneAndDelete(
        { username: req.params.username },
        (err, admin) => {
            if (err) {
                logger.error({
                    message: "Admin was not deleted",
                    errorTrace: err,
                    type: "admin",
                });
                return res.status(400).json({ success: false, error: err });
            }

            if (!admin) {
                logger.error({
                    message: "Admin was not deleted because it does not exist",
                    body: req.params.username,
                    type: "admin",
                });
                return res
                    .status(404)
                    .json({ success: false, error: `Admin not found` });
            }

            logger.info({
                message: "Admin was deleted",
                body: admin,
                type: "admin",
            });
            return res.status(200).json({ success: true, data: admin });
        }
    ).catch((err) => 
        logger.error({
            message: "Admin was not deleted",
            errorTrace: err,
            type: "admin",
        })
    );
};

const getAdminByUsername = async (req, res) => {
    await Admin.findOne({ username: req.params.username }, (err, admin) => {
        if (err) {
            logger.error({
                message: "Admin was not found",
                errorTrace: err,
                type: "admin",
            });
            return res.status(400).json({ success: false, error: err });
        }

        if (!admin) {
            logger.error({
                message: "Admin was not found",
                body: req.params.username,
                type: "admin",
            });
            return res
                .status(404)
                .json({ success: false, error: `Admin not found` });
        }
        logger.info({
                message: "Admin was found",
                body: admin,
                type: "admin",
            });
        return res.status(200).json({ success: true, data: admin });
    }).catch((err) =>
        logger.error({
            message: "Admin was not found",
            errorTrace: err,
            type: "admin",
        })
    );
};

const getAdmins = async (req, res) => {
    await Admin.find({}, (err, admin) => {
        if (err) {
            logger.error({
                message: "Admins were not found",
                errorTrace: err,
                type: "admin",
            });
            return res.status(400).json({ success: false, error: err });
        }
        if (!admin.length) {
            logger.error({
                message: "Admins were not found",
                type: "admin",
            });
            return res
                .status(404)
                .json({ success: false, error: `Admins not found` });
        }
        logger.info({
            message: "Admins were found",
            body: admin,
            type: "admin",
        });
        return res.status(200).json({ success: true, data: admin });
    }).catch((err) =>
        logger.error({
            message: "Admin was not found",
            errorTrace: err,
            type: "admin",
        })
    );
};

module.exports = {
    signIn,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminByUsername,
    getAdmins,
};
