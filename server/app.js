/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var seo = require('mean-seo');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  //serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io'
});
require('./config/socketio')(socketio);
require('./config/express')(app);

app.use(seo({
    cacheClient: 'disk', // Can be 'disk' or 'redis'
    cacheDuration: 2 * 60 * 60 * 24 * 1000, // In milliseconds for disk cache
}));

require('./routes')(app);
require('./config/conference')(app,socketio);
// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  console.log("In production mode:");
  console.log("Make sure to add <script src=\"socket.io/socket.io.js\"></script>");
  console.log("Make sure to update module.exports.DOMAIN");
});

// Expose app
exports = module.exports = app;


