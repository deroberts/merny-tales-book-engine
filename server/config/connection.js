const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(
  //make sure my key value is correct
  process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection;
