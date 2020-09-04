const dotenv = require('dotenv');
const path = require('path'); 
dotenv.config();

module.exports = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  takeModifications: process.env.TAKE_MODIFICATIONS,
  imageUploadPath: path.join(__dirname, 'sitePictures'),
};