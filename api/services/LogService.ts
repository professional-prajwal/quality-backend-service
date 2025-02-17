import packageJSON = require('../../package.json');

const packageVersion = packageJSON.version,
  servicePropertyName = packageJSON.name.replace(/^@.*\//, ''),

  // eslint-disable-next-line node/no-process-env
  serviceSubsystem = process.env.SAILS_ENV || app.config.environment,
  UNKNOWN = 'unknown',
  STR_HEADER_UA = 'user-agent',
  TYPE_ERROR = 'error',
  TYPE_EVENTS = 'server-events',
  TYPE_LOGS = 'server-logs',
  STR_HEADER_XSRV = 'x-srv-name',
  STR_HEADER_XTRACE = 'x-srv-trace',
  STR_LEVEL_INFO = 'info',
  getLogObject = function (type: string, req?: PhotonRequest): { [key: string]: string } {
    const log: { [key: string]: string } = {
      type,
      service_env: app.config.environment,
      service_subsystem: serviceSubsystem,
      service_property: servicePropertyName,
      service_version: packageVersion
    };

    if (req) {
      log.user_ip = req.ip;
      log.user_agent = req.headers[STR_HEADER_UA];

      log.trace_service = req.headers[STR_HEADER_XSRV] || UNKNOWN;
      log.trace_id = req.headers[STR_HEADER_XTRACE] || UNKNOWN;

      log.sails_controller = (typeof req.options === 'object' ? req.options.controller : UNKNOWN) || UNKNOWN;
      log.sails_action = (typeof req.options === 'object' ? req.options.action : UNKNOWN) || UNKNOWN;
    }

    return log;
  };

export = {
  logError (error: Error, req: PhotonRequest) {
    const logObj: { [key: string]: string | object } = getLogObject(TYPE_ERROR, req);

    if (_.isString(error)) {
      logObj.error = {
        message: error
      };
    }
    else {
      logObj.error = error;
    }

    app.log.error(logObj);
  },

  logAnalyticsEvent (options: { [key: string]: string }, logLevel: string) {
    const logObj = getLogObject(TYPE_EVENTS);

    logObj.property = servicePropertyName;
    logObj.category = options.category;
    logObj.action = options.action;
    logObj.meta = options.meta;
    logObj.label = options.label;
    logObj.value = options.value;
    logObj.user = options.user;

    app.log[_.isString(logLevel) ? logLevel : STR_LEVEL_INFO](logObj);
  },

  logOpsEvent (options: { [key: string]: string }, logLevel: string) {
    const logObj = getLogObject(TYPE_LOGS);

    logObj.category = options.category;
    logObj.action = options.action;
    logObj.meta = options.meta;
    logObj.label = options.label;
    logObj.value = options.value;
    logObj.user = options.user;

    app.log[_.isString(logLevel) ? logLevel : STR_LEVEL_INFO](logObj);
  }
};
