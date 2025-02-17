const fs = require('fs'),
  path = require('path'),

  expect = require('chai').expect,

  PROJECT_ROOT = path.join(__dirname, '..', '..');

describe('Photon config', function () {
  describe('singleton config files', function () {
    const configFile = path.join(PROJECT_ROOT + '/config.ts');

    expect(fs.existsSync(configFile)).to.not.be.false;
  });
});
