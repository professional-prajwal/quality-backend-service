const _ = require('lodash'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),

  iv = '1ff093ffdbc91ea0daa5023248ee6eb0';

module.exports = {
  generateAuthCookie (user, team, role = 'admin') {
    let key = Buffer.from(app.config.postmanSession.encryption.key, 'hex'),
      token = jwt.sign({
        // eslint-disable-next-line max-len
        token: '24057c9881235dff027da14d0ed8d55ed716e6d3767ef090222b7a77e804ec7ad8d0cc68d04b993b5254eae219515426084a37044c0f5c4aca7bda57ca904f09',
        identity: {
          user,
          team
        },
        data: {
          user: {
            name: 'James Holden',
            email: 'holden@rocinante.com',
            username: 'jim',
            role,
            roles: _([role, 'user']).compact().uniq().value(),
            teamName: 'Rocinante',
            enabled: true
          },
          account: {
            planName: 'sync-monthly-base',
            planExpires: '2017-12-01T 00:00:00',
            isSyncActive: true
          }
        }
      }, app.config.postmanSession.jwt.key),
      cipher = crypto.createCipheriv('aes-256-ctr', key, Buffer.from(iv, 'hex')),
      cookieValue = cipher.update(token, 'utf8', 'hex');

    cookieValue += cipher.final('hex');

    return [
      app.config.postmanSession.session.cookie.name,
      '=',
      iv.toString('hex'),
      cookieValue
    ].join('');
  }
};
