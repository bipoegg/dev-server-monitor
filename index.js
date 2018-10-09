'use strict'

var mongoose = require('mongoose');
var Db = require('./DB/dbConnectionHandler')();

var featureBranchModel = require('./DB/featureBranchModel');

const Config = require('./config/config');

// Check if feature branch expired
var FeatureBranchChecker = require('./featureChecker/featureBranchChecker');

// Receive message from Chat to auto create new instance
var MQttHandler = require('./instanceHandler/mqttNewInstanceHandler');

// Check instance if running.
var InstanceHealthChecker = require('./instanceHandler/instanceHealthChecker');

// Check instance if running.
var AWSServer = require('./realInstance/awsServer');
var server = new AWSServer();

function initService() {

  mongoose.connect(Config.db.path, Config.db.option);
  Db.handleDbReconnect(Config.db.path, Config.db.option);

  MQttHandler.mqttSubscriber(server);
  setInterval( ()=>{ FeatureBranchChecker.checkExpired(server); }, Config.period.devBranchCheck);
  setInterval( ()=>{ InstanceHealthChecker.healthCheck(server); }, Config.period.healthCheck);
}

initService();

