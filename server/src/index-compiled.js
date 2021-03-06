const cors = require('cors'); // const createError = require('http-errors');


const express = require("express");

const bodyParser = require("body-parser");

const passport = require('passport'); // const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);


const MongoStore = require("connect-mongo");

const {
  dbUrl,
  port,
  jwtSecret
} = require('./config');

var app = express(); // app.options('*', cors())
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

const corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions)); // Create a database variable outside of the database connection callback to reuse the connection pool in your app.

const db = require('./db');

require('./passport')(passport); // app.use(cors({origin: '*'}));


app.use(passport.initialize());
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({
  // to support URL-encoded bodies
  extended: true
}));
app.use(express.json()); // to support JSON-encoded bodies

app.use(express.urlencoded({
  extended: true
})); // to support URL-encoded bodies

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Pass the global passport object into the configuration function

const adminRouter = require('./routes/admin-router');

const contribRouter = require('./routes/contrib-router');

const siteInfoRouter = require('./routes/siteInfo-router');

const modificationRouter = require('./routes/modification-router');

const siteCoordRouter = require('./routes/siteCoord-router');

app.use('/api', adminRouter);
app.use('/api', contribRouter);
app.use('/api', siteInfoRouter);
app.use('/api', modificationRouter);
app.use('/api', siteCoordRouter);
app.listen(port, () => console.log(`Server running on port ${port}`)); // Generic error handler used by all endpoints.

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({
    "error": message
  });
} // app.use(
//     session({
//         secret: jwtSecret,
//         resave: false,
//         saveUninitialized: true,
//         store: new MongoStore({ mongooseConnection: db })
//     })
// );
// app.use('/api', adminRouter)
// app.use('/api', contribRouter)
// app.use('/api', siteInfoRouter)
// app.use('/api', modificationRouter)
// app.use('/api', siteCoordRouter)
// catch 404 and forward to error handler
// app.use((req, res, next) =>{
//   next(createError(404));
// });
// error handler
// app.use((err, req, res, next) =>{
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// app.use((req, res, next) =>{
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use(passportManager.initialize());
// app.use(passportManager.session());
