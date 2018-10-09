'use strict';

var mqtt = require('mqtt');

var host = 'localhost';

var mongoose = require('mongoose');
var FeatureBranch = mongoose.model('FeatureBranch');

const Config = require('../config/config');
var instanceServer = null;

function dbSave(dbDocument) {
  dbDocument.save(function (err) {
    if (err) {
      console.log('Save db error ', err);
    }
  })
}
function handleFeatureBranchEvent(msg) {


  FeatureBranch.getBranchByName(msg.feature, function (err, featureBranch) {
    if (err) {
      console.log('Get branch error: ', err);
    } else {

      if (featureBranch) {
        if (featureBranch.status != 'running') {
          // re-start Feature service;
          featureBranch.status = 'running';
          // TODO: need to implement awsServer start function successfully.
          if (instanceServer) {
            instanceServer.start(featureBranch.instanceId);
          }

          dbSave(featureBranch);
        }
      } else {
        // create new Feature service;
        featureBranch = new FeatureBranch();
        featureBranch.branchName = msg.feature;
        featureBranch.status = 'running';

        (async function() {
          featureBranch.instanceId = 'i-1234'; // fake instance id
          // TODO: need to implement awsServer to retrieve right server.
          // featureBranch.instanceId = instanceServer ? instanceServer.create(msg.feature) : 'i-1234';
          dbSave(featureBranch);
        })();
      }
    }
  });
}

function mqttSubscriber(server) {
  instanceServer = server;

  try {
    var url = 'mqtt://' + Config.mqtt.path;
    var opts = { username: Config.mqtt.userName, password: Config.mqtt.password, keepalive: 10, reconnectPeriod: 0 };

    var mqttClient = mqtt.connect(url, opts); // connect to CloudPlugs server

    mqttClient.on('connect', function() {
      console.log('MQTT client connected time : ' , Date.now());
    });

    mqttClient.on('close', function() {
      console.log('MQTT connection closed, now exiting. ');
    });

    mqttClient.on('error', function(err) {
      console.log('connect error', err);
    });

    mqttClient.on('message', function(topic, payload) {
      var msg = JSON.parse(payload);
      console.log('received data from topic "' + topic + ' : '+ JSON.stringify(msg));

      handleFeatureBranchEvent(msg);
    });

    mqttClient.subscribe('v1/feature');

  } catch(e) {
    console.log('MQTT error: ' + e);
  }
}

module.exports = {
  mqttSubscriber
}
