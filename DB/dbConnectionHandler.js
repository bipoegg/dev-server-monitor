'use strict';

var dateFormat = require('dateformat');
var mongoose = require('mongoose');

var reconnectInterval = 1;
const retryUpperBound = 60; // one minute for now

const dateFormatString = 'dd/mmm/yyyy:hh:MM:ss';


module.exports = function() {
  var self = {};

  self.handleDbReconnect = function(dbPath, dbOption) {
    var db = mongoose.connection;
    db.on('connecting', function() {
      var now = new Date();
      console.log('[' + dateFormat(now, dateFormatString, true) + ' +0000] connecting to MongoDB...');
    });
    db.on('error', function(error) {
      var now = new Date();
      console.error('[' + dateFormat(now, dateFormatString, true) + ' +0000] Error in MongoDb connection: ' + error);
      mongoose.disconnect();
    });
    db.on('connected', function() {
      reconnectInterval = 1;
      var now = new Date();
      console.log('[' + dateFormat(now, dateFormatString, true) + ' +0000] MongoDB connected!');
    });
    db.once('open', function() {
      var now = new Date();
      console.log('[' + dateFormat(now, dateFormatString, true) + ' +0000] MongoDB connection opened!');
    });
    db.on('reconnected', function () {
      var now = new Date();
      console.log('[' + dateFormat(now, dateFormatString, true) + ' +0000] MongoDB reconnected!');
    });
    db.on('disconnected', function() {
      var now = new Date();
      console.log('[' + dateFormat(now, dateFormatString, true) + ' +0000] MongoDB disconnected!');

      setTimeout(function () {

        mongoose.connect(dbPath, dbOption);
      }, reconnectInterval * 1000);

      if (reconnectInterval < retryUpperBound) {
        reconnectInterval *= 2;
      }
    });
  }

  return self;
};
