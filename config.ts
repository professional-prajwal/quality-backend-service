import { PhotonConfig } from '@postman/photon';

const config: PhotonConfig = {
  port: 1337,

  apm: {
    enabled: true, // Default is true
    key: undefined, // Mandatory
    log: {
      level: 'error' // Signifies newrelic agent's log type (info, error, debug, trace)
    }
  },

  datastores: {
    mySql: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'qualitybackend',
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
      multipleStatements: true
    }
  },

  exceptionReporter: {
    enabled: false,
    logDir: '.tmp',
    reporters: {
      slack: {
        enabled: false
      },
      sentry: {
        enabled: false,
        dsn: undefined
      }
    }
  },

  models: {
    attributes: {
      createdAt: { type: 'string', autoCreatedAt: true },
      updatedAt: { type: 'string', autoUpdatedAt: true }
    },
    migrate: 'safe'
  },

  postmanSession: {
    service: 'qualitybackend',
    session: {
      cookie: {
        enabled: false,
        name: 'postman.sid',
        allowedDomains: ['.getpostman.com', '.postman.co'],
        options: {
          secure: true,
          httpOnly: true,
          maxAge: 31536000
        }
      },
      token: {
        enabled: true,
        query: 'access_token'
      }
    },
    encryption: {
      key: undefined
    },
    jwt: {
      key: undefined
    },
    identityService: {
      url: 'https://identity.postman-beta.tech'
    }
  },

  req: {
    http: {
      json: true,
      timeout: 5000
    },
    identify: true,
    trace: true,
    log: {
      enabled: true
    }
  },

  /**
   * Route Mappings
   * (app.config.routes)
   *
   * Your routes map URLs to views and controllers.
   *
   * If Photon receives a URL that doesn't match any of the routes below,
   * the default 404 handler is triggered.
   */
  routes: {
    // HealthController
    'GET /': {
      action: 'HealthController.status'
    },
    'GET /knockknock': {
      action: 'HealthController.check'
    }
  },

  x: {
    enabled: false,
    internal: true,
    auths: {
      primary: {
        username: 'ba40446a32',
        password: '688d4c3c3e'
      }
    }
  }
};

module.exports = config;
