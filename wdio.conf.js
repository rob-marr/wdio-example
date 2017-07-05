const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiString = require('chai-string')
const chaiUrl = require('chai-url')
const chaiDatetime = require('chai-datetime')

const { spawn } = require('child_process')

let local = {}
try {
  /* enable local overrides via wdio.local.json */
  /* see wdio.local.example.json */
  /* eslint vars-on-top: 0, global-require: 0, import/no-unresolved: 0 */
  local = require('./wdio.local.js')
} catch (err) {
  // ignore errors
}

const baseUrl = process.env.SELENIUM_BASE_URL || 'http://localhost:1337'

let app
exports.config = Object.assign({
  specs: ['./specs/**/*.js'],
  exclude: [],
  maxInstances: 2,
  capabilities: [{
    browserName: 'chrome',
    chromeOptions: {
      binary: '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      // disables ssl warnings for dev envs
      args: ['disable-web-security', 'headless']
    }
  }, {
    browserName: 'chrome',
    chromeOptions: {
      // disables ssl warnings for dev envs
      args: ['disable-web-security']
    }
  }, {
    browserName: 'firefox'
  }],
  logLevel: 'silent',
  coloredLogs: true,
  screenshotPath: 'reports/screenshots',
  baseUrl,
  waitforTimeout: 5000,
  framework: 'mocha',
  reporters: ['spec', 'allure'],
  services: ['selenium-standalone'],
  mochaOpts: {
    timeout: 5000
  },
  onPrepare () {
    app = spawn('node', ['server.js'], { stdio: 'inherit' })
  },
  before () {
    chai.use(chaiAsPromised)
    chai.use(chaiString)
    chai.use(chaiUrl)
    chai.use(chaiDatetime)
    global.expect = chai.expect
    global.should = chai.Should()
  },
  onComplete () {
    app.kill()
  }
}, local)