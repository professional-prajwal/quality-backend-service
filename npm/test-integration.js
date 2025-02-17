// ---------------------------------------------------------------------------------------------------------------------
// This script is intended to execute all integration tests.
// ---------------------------------------------------------------------------------------------------------------------
/* eslint-env node, es6 */

// set directories and files for test and coverage report
const path = require('path'),
  { mkdirSync } = require('fs'),

  NYC = require('nyc'),
  chalk = require('chalk'),
  recursive = require('recursive-readdir'),

  COV_REPORT_PATH = '.coverage',
  SPEC_SOURCE_DIR = path.join(__dirname, '..', 'test', 'integration');

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('Running integration tests using mocha on node...'));

  mkdirSync(COV_REPORT_PATH, { recursive: true });

  const Mocha = require('mocha'),
    nyc = new NYC({
      sourceMaps: true,
      hookRequire: true,
      reportDir: COV_REPORT_PATH,
      tempDirectory: COV_REPORT_PATH,
      reporter: ['text', 'lcov', 'text-summary'],
      extension: ['.js', '.ts'],
      cache: true
    });

  nyc.wrap();

  // add all spec files to mocha
  recursive(SPEC_SOURCE_DIR, function (err, files) {
    if (err) {
      console.error(err);

      return exit(1);
    }

    const mocha = new Mocha({ timeout: 1000 * 60 });

    // add bootstrap file
    mocha.addFile(path.join(SPEC_SOURCE_DIR, '_bootstrap.js'));

    files.filter(function (file) { // extract all test files
      return file.substr(-8) === '.test.js';
    }).forEach(mocha.addFile.bind(mocha));

    return mocha.run(function (runError) {
      runError && console.error(runError.stack || runError);

      nyc.reset();
      nyc.writeCoverageFile();
      nyc.report();

      nyc.checkCoverage({
        statements: 61,
        lines: 61,
        branches: 29,
        functions: 62
      });

      exit(runError ? 1 : 0);
    });
  });
};

// ensure we run this script exports if this is a direct stdin.tty run
(require.main === module) && module.exports(process.exit);
