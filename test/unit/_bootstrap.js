const path = require('path'),

  chai = require('chai'),
  request = require('supertest'),
  photon = require('@postman/photon'),
  // eslint-disable-next-line new-cap
  photonServer = new photon.server(),
  PROJECT_ROOT = path.join(__dirname, '..', '..');

let previousEnvironment;

before(function (done) {
  previousEnvironment = process.env;
  process.env.NODE_ENV = 'test';

  /* 1. Creating a test database is not required, as the ORM handles it's creation of the test database.
     2. Explicitly override to set automigrations to drop.
        This infers the models and recreates the tables from scratch, ensuring deterministic test behavior. */
  process.env.MODELS_MIGRATE = 'drop';
  global.expect = chai.expect;

  photonServer.lift({
    environment: 'test',
    appPath: PROJECT_ROOT
  }).then((app) => {
    const SERVER_ADDRESS = `http://127.0.0.1:${app.config.port}`;

    // make a global server function to send request
    global.server = function () {
      const supertestRequest = request(SERVER_ADDRESS),
        originalPostRequest = supertestRequest.post;

      supertestRequest.post = function (...args) {
        return originalPostRequest(args)
          .set('Content-Type', 'application/json');
      };

      return supertestRequest;
    };

    done();
  })
    .catch((e) => {
      console.error('error loading app: ', e);
      done(e);
    });
});

describe('test-runner', function () {
  it('should have exposed the required globals', function () {
    if (typeof expect === 'undefined') {
      throw new Error('unit _bootstrap has not globalized chai.expect');
    }
    if (typeof server === 'undefined') {
      throw new Error('unit _bootstrap has not globalized `server` function to lift server');
    }
  });

  it('should lift the service', function (done) {
    server().get('/knockknock')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end(done);
  });
});

after(function () {
  process.env = previousEnvironment;
  delete global.server;
  delete global.expect;
  photonServer.close();
});
