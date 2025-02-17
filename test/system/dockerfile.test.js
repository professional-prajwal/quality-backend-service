/**
 * @fileOverview This test specs runs tests on the Dockerfile file of repository. It has a set of strict tests on the
 * content of the file as well. Any change to Dockerfile must be accompanied by valid test case in this spec-sheet.
 */
const fs = require('fs'),

  expect = require('chai').expect,

  pkg = require('../../package.json');

describe('dockerfile', function () {
  let dockerfile,
    ignorefile;

  try {
    dockerfile = fs.readFileSync('./Dockerfile').toString();
    ignorefile = fs.readFileSync('./.dockerignore').toString();
  }
  catch (e) {
    console.error(e);
  }

  it('should have an existent ./Dockerfile with content', function () {
    expect(dockerfile).to.be.ok;
  });

  it('should have an existent ./.dockerignore with content', function () {
    expect(ignorefile).to.be.ok;
  });

  it('should not include node_modules or bower_components in ./.dockerignore', function () {
    expect((/(^|\n)\/?node_modules/g).test(ignorefile)).to.be.false;
    expect((/(^|\n)\/?bower_components/g).test(ignorefile)).to.be.false;
  });

  describe('general sanity', function () {
    it('should use a valid base image', function () {
      const nodeMajorVersion = pkg.engines.node.match(/\d+/)[0];

      expect(dockerfile).to
        // eslint-disable-next-line max-len
        .contain(`FROM 494522899761.dkr.ecr.us-east-1.amazonaws.com/platform/node:${nodeMajorVersion}`);
    });

    it('should use rebuild after installing dependencies', function () {
      expect(dockerfile).to
        .contain('RUN npm install --only=production && npm rebuild');
    });

    it('should use a valid entrypoint-command combination', function () {
      expect(dockerfile).to.contain('ENTRYPOINT ["npm"]');
      expect(dockerfile).to.contain('CMD ["run", "docker"]');
    });
  });
});
