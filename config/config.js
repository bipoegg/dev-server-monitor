module.exports = {

  /**
   * db setting
   */
  db: {
    path: 'mongodb://localhost:27017/featureBranch',
    option: {
      useNewUrlParser: true
    }
  },

  /**
   * mqtt setting
   */
  mqtt: {
    path: 'localhost',
    userName: 'cloud',
    password: 'cloud'
  },

  /**
   * aws setting
   */
  aws: {
    ec2: {
      apiVersion: '2016-11-15',
      region: 'us-west-2',
      accessKeyId: '',
      secretAccessKey: ''
    }
  },

  /**
   * git repository setting
   */
  featureBranch:{
    // The checked repository folder.
    repoFolder: '~/featureBranchFolder'
  },

  /**
   * check period
   */
  period: {
    healthCheck : 50000,
    devBranchCheck: 50000
  }
};