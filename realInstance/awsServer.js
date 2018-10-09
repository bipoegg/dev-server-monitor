'use strict'

var AWS = require('aws-sdk');
const BaseServer = require('./baseServer');

const Config = require('../config/config');

class awsServer extends BaseServer{

  constructor () {
    super();
    this.ec2 = new AWS.EC2(Config.aws.ec2);
  };

  createInstance(params) {
    return new Promise((resolve, reject) => {
      this.ec2.runInstances(params, (err, readData) => {
        if (err) {
          return reject(err);
        } else {
          resolve(readData);
        }
      });
    }).catch(error => console.log('caught', error));
  }

  async create(branchName) {

    //TODO: need to implement with those needed AWS setting.
    var params = {
      // Need setup AMI setting.
      /*
       * Need to enter AWS AMI related settings.
         BlockDeviceMappings: [{
          DeviceName: "/dev/sdh",
          Ebs: {
            VolumeSize: 100
          }
        }],
        ImageId: "ami-abc12345",
        InstanceType: "t2.micro",
        KeyName: "my-key-pair",
        MaxCount: 1,
        MinCount: 1,
        SecurityGroupIds: [
           "sg-1a2b3c4d"
        ],
        SubnetId: "subnet-6e7f829e",
       */
      TagSpecifications: [
        {
          ResourceType: "instance",
          Tags: [
            {
              Key: "Name",
              Value: branchName
            }
          ]
        }
      ]
    };

    var data = await this.createInstance(params);
    var instanceLength = data.Instances.length;
    return instanceLength > 0 ? data.Instances[0].InstanceId : '';
  };

  startExistInstance(params) {
    return new Promise((resolve, reject) => {
      this.ec2.startInstances(params, (err, readData) => {
        if (err) {
          return reject(err);
        } else {
          resolve(readData);
        }
      });
    }).catch(error => console.log('caught', error));
  }

  async start(instanceId) {

    var params = {
      InstanceIds: [
        instanceId
      ]
    };

    var data = await this.startExistInstance(params);
    return data ? data.CurrentState.Name === 'running' : false;
  };

  stopExistInstance(params) {
    return new Promise((resolve, reject) => {
      this.ec2.stopInstances(params, (err, readData) => {
        if (err) {
          return reject(err);
        } else {
          resolve(readData);
        }
      });
    }).catch(error => console.log('caught', error));
  }

  async stop(instanceId) {
    var params = {
      InstanceIds: [
        instanceId
      ]
    };

    var data = await this.stopExistInstance(params);
    return data ? data.CurrentState.Name === 'stopped' : false;
  };

  describeInstance(params) {
    return new Promise((resolve, reject) => {
      this.ec2.describeInstanceStatus(params, (err, readData) => {
        if (err) {
          return reject(err);
        } else {
          resolve(readData);
        }
      });
    }).catch(error => console.log('caught', error));
  }

  async getRunningServers () {

    var runningList = [];
    var params = {
      Filters: [
        {
          Name: "instance-state-name",
          Values: [
            "running"
          ]
        }
      ]
    };

    var data = await this.describeInstance(params);

    if (data) {
      for (var i in data.InstanceStatuses) {
        var currentState = data.InstanceStatuses[i];
        runningList.push(currentState.InstanceId);
      }
    }

    return runningList;
  }
}


module.exports = awsServer;
