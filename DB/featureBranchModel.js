'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeatureBranchSchema = new Schema({
  branchName: {
    type: String,
    trim: true
  },
  instanceId: {
    type: String,
    trim: false
  },
  status: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

var projection = {
  __v: false
};

FeatureBranchSchema.statics.getBranchByName = function(branchName, cb) {

  this.findOne({
    $and:[
      {branchName: branchName}
    ]}, projection
  ).exec(cb);
};

FeatureBranchSchema.statics.getRunningBranch = function(cb) {

  this.find({
    $and:[
      {status:{'$eq': 'running'}}
    ]}, projection
  ).exec(cb);
};

mongoose.model('FeatureBranch', FeatureBranchSchema);