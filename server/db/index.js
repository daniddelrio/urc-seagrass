const mongoose = require('mongoose')
const { dbUrl } = require('../config')
const logger = require("../logger")

mongoose
    .connect(dbUrl, { useNewUrlParser: true , useFindAndModify: false })
    .catch(e => {
        logger.error({
        	message: 'DB Connection error',
        	errorTrace: e,
        	type: "db"
        })
    })

const db = mongoose.connection

module.exports = db