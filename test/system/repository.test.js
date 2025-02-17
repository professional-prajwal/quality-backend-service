/**
 * @fileOverview This test specs runs tests on the package.json file of repository. It has a set of strict tests on the
 * content of the file as well. Any change to package.json must be accompanied by valid test case in this spec-sheet.
 */
const fs = require('fs'),

  _ = require('lodash'),
  yaml = require('js-yaml'),
  semver = require('semver'),
  expect = require('chai').expect;

describe('project repository', function () {
  describe('package.json', function () {
    let json,
      content;

    try {
      content = fs.readFileSync('./package.json').toString();
      json = JSON.parse(content);
    }
    catch (e) {
      console.error(e);
      content = '';
      json = {};
    }

    it('should have readable JSON content', function () {
      expect(content).to.be.ok;
      expect(json).to.not.eql({});
    });

    describe('package.json JSON data', function () {
      it('should have valid name, description and author', function () {
        expect(json.name).to.match(/^@postman\/[a-z0-9-]+$/);
        expect(json.author).to.equal('Postman Labs <mail@postmanlabs.com>');
        expect(json.license).to.equal('UNLICENSED');
      });

      it('should have a valid version string in form of <major>.<minor>.<revision>', function () {
        // eslint-disable-next-line max-len, security/detect-unsafe-regex
        expect(json.version).to.match(/^((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?(?:\+([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/);
      });
    });

    describe('script definitions', function () {
      let props = {};

      it('should exist', function () {
        let prop;

        expect(json.scripts).to.be.ok;

        for (prop in json.scripts) {
          if (_.includes(json.scripts[prop], '.sh')) {
            props[prop] = {
              base: prop.substr(0, _.includes(prop, '-') ? prop.indexOf('-') : undefined),
              path: json.scripts[prop]
            };

            expect(fs.existsSync(props[prop].path)).to.be.ok;
          }
        }
      });

      it('should be defined as per standards `[script]: scripts/[name].sh`', function () {
        for (let prop in json.scripts) {
          if (_.includes(json.scripts[prop], '.sh')) {
            // eslint-disable-next-line security/detect-non-literal-regexp
            expect(json.scripts[prop]).to.match(new RegExp(props[prop].path, 'g'));
          }
        }
      });

      it('should have the hashbang defined', function () {
        let prop,
          fileContent;

        for (prop in json.scripts) {
          if (_.includes(json.scripts[prop], '.sh')) {
            fileContent = fs.readFileSync(props[prop].path).toString();
            expect((/^#!\/(bin\/bash|usr\/bin\/env\snode)[\r\n][\W\w]*$/g).test(fileContent)).to.be.ok;
          }
        }
      });
    });

    describe('dependencies', function () {
      it('should exist', function () {
        expect(json.dependencies).to.be.a('object');
      });

      it('should point to a valid and precise (no * or ^) semver', function () {
        _.forEach(json.dependencies, function (dep, name) {
          // eslint-disable-next-line security/detect-non-literal-regexp
          !name.startsWith('@postman/') && expect(dep).to.match(new RegExp('^((\\d+)\\.(\\d+)\\.(\\d+))(?:-' +
              '([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?(?:\\+([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?$'));
        });
      });
    });

    describe('devDependencies', function () {
      it('should exist', function () {
        expect(json.devDependencies).to.be.a('object');
      });

      it('should point to a valid and precise (no * or ^) semver', function () {
        _.forEach(json.devDependencies, function (devDep) {
          // eslint-disable-next-line security/detect-non-literal-regexp
          expect(devDep).to.match(new RegExp('^((\\d+)\\.(\\d+)\\.(\\d+))(?:-' +
              '([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?(?:\\+([\\dA-Za-z\\-]+(?:\\.[\\dA-Za-z\\-]+)*))?$'));
        });
      });

      it('should not overlap devDependencies', function () {
        expect(_.intersection(_.keys(json.devDependencies), _.keys(json.dependencies))).to.eql([]);
      });
    });

    describe('engines', function () {
      it('should exist and be valid', function () {
        expect(json.engines).to.not.be.empty;
      });

      it('should have a valid entry for node', function () {
        expect(json.engines.node).to.match(/^\^?\d+/);
      });

      it('should use the same current node version that is specified in package.json', function () {
        expect(semver.satisfies(process.version, json.engines.node)).to.equal(true);
      });
    });
  });

  describe('README.md', function () {
    it('should exist', function () {
      expect(fs.existsSync('./README.md')).to.be.ok;
    });

    it('should have readable content', function () {
      expect(fs.readFileSync('./README.md').toString()).to.be.ok;
    });
  });

  describe('LICENSE.md', function () {
    it('should exist', function () {
      expect(fs.existsSync('./LICENSE.md')).to.be.ok;
    });

    it('should have readable content', function () {
      expect(fs.readFileSync('./LICENSE.md').toString()).to.be.ok;
    });
  });

  describe('.gitignore file', function () {
    it('should exist', function () {
      expect(fs.existsSync('./.gitignore')).to.be.ok;
    });

    it('should have readable content', function () {
      expect(fs.readFileSync('./.gitignore').toString()).to.be.ok;
    });
  });

  describe('.npmignore file', function () {
    it('should not exist', function () {
      expect(fs.existsSync('./.npmignore')).not.to.be.ok;
    });
  });

  describe('Changelog.yaml', function () {
    const changelog = yaml.load(fs.readFileSync('./Changelog.yaml'));

    it('should be non-empty YAML', function () {
      expect(changelog, 'changelog is empty!').to.not.be.empty;
    });

    it('should match the Changelog schema', function () {
      _.forEach(changelog, (data, version) => {
        if (version === 'master') {
          expect(data).to.not.have.property('date', 'Unreleased versions must not have a date');
        }
        else {
          expect(version).to.match(/^\d+\.\d+\.\d+$/, `${version} is invalid semver!`);
          expect(data.date).to.be.an.instanceOf(Date, `${version} has an invalid release date!`);
        }

        _.forEach(data, (datum, key) => {
          expect(datum.length, `${version} has an empty ${key}`).to.not.eql(0);

          _.forEach(datum, (value, index) => {
            expect(value, `${version} has an empty ${key} at ${index}`).to.not.be.empty;
          });
        });
      });
    });
  });
});
