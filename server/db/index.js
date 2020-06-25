const mongoose = require('mongoose')
const { dbUrl } = require('../config')

mongoose
    .connect(dbUrl, { useNewUrlParser: true , useFindAndModify: false })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db