const cors = require('cors');
// const createError = require('http-errors');
const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
// const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
const MongoStore = require("connect-mongo");
const compression = require('compression');
const helmet = require('helmet');

const { dbUrl, port, jwtSecret, corsOrigin } = require('./config');

var app = express();
const corsOptions ={
	origin: corsOrigin
}
app.use(cors(corsOptions));

// Compress HTTP responses
app.use(compression());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
const db = require('./db')

require('./passport')(passport);
app.use(passport.initialize());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended: true})); // to support URL-encoded bodies

// Protect app from well-known web vulnerabilities
app.use(helmet());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Pass the global passport object into the configuration function

const adminRouter = require('./routes/admin-router')
const contribRouter = require('./routes/contrib-router')
const siteCoordRouter = require('./routes/siteCoord-router')
const siteInfoRouter = require('./routes/siteInfo-router')
const modificationRouter = require('./routes/modification-router')
const dataFieldsRouter = require('./routes/dataFields-router')
const datasetRouter = require('./routes/dataset-router')

app.use('/api', adminRouter)
app.use('/api', contribRouter)
app.use('/api', siteCoordRouter)
app.use('/api', siteInfoRouter)
app.use('/api', modificationRouter)
app.use('/api', dataFieldsRouter)
app.use('/api', datasetRouter)

app.listen(port, () => console.log(`Server running on port ${port}`))
