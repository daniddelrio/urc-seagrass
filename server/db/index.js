const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://urc-user:ComPSaTIsL0v3%21@urc-seagrass-db-qvkjr.mongodb.net/test?authSource=admin', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db