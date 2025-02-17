/**
 * @fileOverview This test specs runs tests on the Photon model definitions
 */
const fs = require('fs'),
  path = require('path'),

  expect = require('chai').expect;

describe('model definition', function () {
  let models;

  // read all files and push it to an object for further testing
  models = fs.readdirSync('api/models').map(function (file) {
    return (/\.js$/).test(file) && {
      name: file.replace(/\.js$/, ''),
      model: require('../../' + path.join('api/models', file))
    };
  }).filter(Boolean);

  // run common test for all modules
  models.forEach(function (definition) {
    describe(definition.name, function () {
      it('should have an attributes object', function () {
        expect(definition.model.attributes).to.be.ok;
      });
    });
  });
});
