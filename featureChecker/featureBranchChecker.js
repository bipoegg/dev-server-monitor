'use strict'

// var DBClient = require('../DB/dbClient');

var exec = require('child_process').exec;

var mongoose = require('mongoose');
var FeatureBranch = mongoose.model('FeatureBranch');

const Config = require('../config/config');
const expiredDay =  3 * 86400; // 3 days.

async function checkBranch(branchName) {
  var expired = false;
  // get last commit log time.
  var cmd = 'git -C '+ Config.featureBranch.repoFolder + ' log -1 ' + branchName + ' --pretty=format:%ct';

  await exec(cmd, function(error, stdout, stderr) {

    if (!error && !stderr) {
      if ( Date.now() - stdout >= expiredDay) {
        console.log('Branch is expired: ', branchName);
        expired = true;
      }
    } else {
      console.log(error);
      console.log(stderr);
    }

    return expired;
  });
}

async function checkExpired(server) {

  // get feature branch from db
  FeatureBranch.getRunningBranch(function (err, featureBranches) {

    if (!err) {
      // get each branch last commit time;
      var needStopList = [];
      for (var i in featureBranches) {
        var needStop = checkBranch(featureBranches[i].branchName);
        if (needStop) {
          needStopList.push(featureBranches[i]);
        }
      }

      // stop feature server for those expired part
      for (var i in needStopList) {
        var needStoppedBranch = needStopList[i];
        console.log('Stop instance Id: ', needStoppedBranch.instanceId);

        // TODO: need to implement awsServer stop function successfully.
        if (server) {
          server.stop(needStoppedBranch.instanceId);
        }

        needStoppedBranch.status = 'autoStopped';
        needStoppedBranch.save(function (err) {
          if(err) {
            console.log('update instance list error: ', err);
          }
        })
      }
    }
  });
}

module.exports = {
  checkExpired
}