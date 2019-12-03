module.exports = {
  maxInstances: 10,
  waitforTimeout: 60000,
  services: ['selenium-standalone'],
  mochaOpts: {
    timeout: 60000
  }
}
