'use strict'

var mongoose = require('mongoose');
var FeatureBranch = mongoose.model('FeatureBranch');

async function healthCheck(server) {

  var runningList = [];

  // TODO: need to implement awsServer to get real describe status information
  runningList = server ? await server.getRunningServers() : [];

  FeatureBranch.getRunningBranch(function (err, runningBranch) {
    if (!err) {
      // get each branch last commit time;
      for (var i in runningBranch) {
        var currBranch = runningBranch[i];
        if (runningList.indexOf(currBranch.instanceId) === -1) {
          console.log('Feature server not running any more, name: ', currBranch.branchName);
          currBranch.status = 'stopped';
          currBranch.save(function (err) {
            if (err) {
              console.log('Save error: ', err);
            }
          })
        } else {
          console.log(currBranch.branchName, ' is still running');
        }
      }
    }
  });
}

module.exports = {
  healthCheck
}