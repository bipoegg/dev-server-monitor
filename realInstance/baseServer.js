'use strict'

class baseServer {

  constructor () {
  };

  async create(branchName) {
    console.log('[Warning] need to implement your own create function');
  };

  async start(instanceId) {
    console.log('[Warning] need to implement your own start function');
  };

  async stop(instanceId) {
    console.log('[Warning] need to implement your own stop function');
  };

  async getRunningServers () {
    console.log('[Warning] need to implement your own get function');
  }
}


module.exports = baseServer;
