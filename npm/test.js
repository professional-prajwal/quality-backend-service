const async = require('async'),
  chalk = require('chalk'),
  prettyms = require('pretty-ms'),

  startedAt = Date.now(),

  name = require('../package.json').name;

module.exports = function (exit) {
  async.series([
    require('./test-lint'),
    require('./test-system'),
    require('./test-unit'),
    require('./test-integration')

  ], function (code) {
    // eslint-disable-next-line max-len
    console.info(chalk[code ? 'red' : 'green'](`\n${name}: duration ${prettyms(Date.now() - startedAt)}\n${name}: ${code ? 'not ok' : 'ok'}!`));
    exit(code ? 1 : 0);
  });
};

(require.main === module) && module.exports(process.exit);
