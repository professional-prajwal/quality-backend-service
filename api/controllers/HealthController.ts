import os = require('os');

/**
 * Keep a copy of the package version
 *
 * @constant
 * @type {String}
 */
import packageJSON = require('../../package.json');

const applicationVersion = packageJSON.version,

  /**
   * This is the default response returned for successful health check
   *
   * @constant
   * @type {Object}
   */
  HEALTH_RESPONSE = { response: 'Who is there?' };

export = {
  /**
   * This method performs a series of wellness checks on the application models, and returns a status response
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */

  check (req: PhotonRequest, res: PhotonResponse): void {
    async.each([
      {
        adapter: 'mysql',
        model: Health
      }
    ],

    function (connection: {adapter: string, model: any},
      callback: (error?: Error | null, result?: object | null) => void) {
      async.waterfall([
        /**
         * Determines model read status.
         *
         * @param {Function} next - The function called to indicate that the model read check has completed.
         */
        function (next: (error?: object | null, result?: object | null) => void) {
          connection.model.findOne({ id: 1 }, function (err: Error, result: object) {
            if (err) {
              return next({
                error: err,
                adapter: connection.adapter
              });
            }

            return next(null, result || null);
          });
        },

        /**
         * Checks model write correctness.
         *
         * @param {Object} result An object returned by the model read check, indicating database contents.
         * @param {Function} next A function called when the model write check has completed.
         */
        function (result: object, next: (error?: object | null, result?: object | null) => void) {
          // if read had no result, we test by creating a new entry
          if (!result) {
            return connection.model.create({ id: 1 }).exec(function (err: Error) {
              return err ? next({ error: err, adapter: connection.adapter }) : next();
            });
          }

          // we test write by saving the result
          return connection.model.update({ id: 1 }, {}, function (err: Error) {
            return err ? next({ error: err, adapter: connection.adapter }) : next();
          });
        }
      ], callback);
    },

    /**
     * The handler method for the health check pipeline.
     *
     * @param {?Error} error An Error / null instance that determines that result of the model health check
     */
    function (error: Error | null | undefined) {
      return error ? res.callback(error, {}) : res.callback(null, HEALTH_RESPONSE);
    });
  },

  /**
   * This is a function to respond to api calls on root
   *
   * @param {Object} req The request object
   * @param {Object} res The response object
   */
  status (req: PhotonRequest, res: PhotonResponse): void {
    let uptime = -1,
      mem = -1,
      load: number[] = [];

    try {
      mem = os.freemem() / os.totalmem();
      load = os.loadavg();
      uptime = os.uptime();
    }
    // @todo: log the error here
    catch (err) { } // eslint-disable-line no-empty

    res.callback(null, {
      version: applicationVersion,
      uptime,
      mem,
      load
    });
  }
};
