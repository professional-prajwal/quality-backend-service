const path = require('path'),

  async = require('async'),
  chalk = require('chalk'),
  Mocha = require('mocha'),
  packity = require('packity'),
  recursive = require('recursive-readdir'),

  PROJECT_ROOT = path.join(__dirname, '..'),

  /**
   * The source directory for system test specs.
   *
   * @type {String}
   */
  SPEC_SOURCE_DIR = path.join(PROJECT_ROOT, 'test', 'system');

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('\nRunning system tests...\n'));

  async.series([

    /**
     * Enforces sanity checks on installed packages via packity.
     *
     * @param {Function} next - The callback function invoked when the packge sanity check has concluded.
     */
    function (next) {
      console.info('checking installed packages...\n');
      packity({ path: PROJECT_ROOT }, packity.cliReporter({}, next));
    },

    /**
     * Runs system tests on SPEC_SOURCE_DIR using Mocha.
     *
     * @param {Function} next - The callback invoked to mark the completion of the test run.
     */
    function (next) {
      console.info('\nrunning system specs using mocha...');

      let mocha = new Mocha({ timeout: 1000 * 60 });

      recursive(SPEC_SOURCE_DIR, function (err, files) {
        if (err) { return next(err); }

        files.filter(function (file) {
          return file.substr(-8) === '.test.js';
        }).forEach(function (file) {
          mocha.addFile(file);
        });

        // start the mocha run
        return mocha.run(next);
      });
    }
  ], exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
(require.main === module) && module.exports(process.exit);
