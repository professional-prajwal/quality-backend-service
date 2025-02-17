const async = require('async'),
  chalk = require('chalk'),
  ESLint = require('eslint').ESLint,

  /**
   * The list of source code files / directories to be linted.
   *
   * @type {Array}
   */
  LINT_SOURCE_DIRS = [
    'api',
    'test',
    'npm'
  ];

module.exports = function (exit) {
  // banner line
  console.info(chalk.yellow.bold('\nLinting files using eslint...'));

  async.waterfall([

    /**
     * Instantiates an ESLint CLI engine and runs it in the scope defined within LINT_SOURCE_DIRS.
     *
     * @param {Function} next - The callback function whose invocation marks the end of the lint test run.
     */
    function (next) {
      const eslint = new ESLint({ cache: true });

      eslint
        .lintFiles(LINT_SOURCE_DIRS)
        .then((results) => {
          eslint
            .loadFormatter()
            .then(({ format }) => {
              console.info(format(results));
              next(ESLint.getErrorResults(results).length);
            });
        });
    }
  ], exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
(require.main === module) && module.exports(process.exit);
