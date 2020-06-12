var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
var cors = require('cors');

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

var distDir = __dirname + "/dist/";
 app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

const adminRouter = require('./routes/admin-router')
const contribRouter = require('./routes/contrib-router')
const siteInfoRouter = require('./routes/siteInfo-router')
const modificationRouter = require('./routes/modification-router')

app.use(cors({origin: '*'}));

//Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb+srv://urc-user:ComPSaTIsL0v3%21@urc-seagrass-db-qvkjr.mongodb.net/test?authSource=admin", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Connected to mongodb successfully!");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 4200, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }

app.get("/api/test", function(req, res) {
  console.log('API sucessfully connected');
});

app.use('/api', adminRouter)
app.use('/api', contribRouter)
app.use('/api', siteInfoRouter)
app.use('/api', modificationRouter)

  