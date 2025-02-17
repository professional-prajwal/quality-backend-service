/**
 * You can apply this policy to your controller or actions in config/policies.ts
 * This can be accessed by its filename, minus the extension ("isAuthenticated")
 *
 * For more information on how policies work, see:
 * https://postmanlabs.atlassian.net/wiki/spaces/ENGFN/pages/4645913119/Photon+Documentation#Policies
 *
 * @param {Object} req - Photon request object
 * @param {Object} res - Photon response object
 * @param {Function} next - Error first callback
 */
module.exports = function (req: PhotonRequest, res:PhotonResponse,
  next: (error?: object | null, result?: object | null) => void) {
  // To ensure proper authentication checks, the installation of platform-heimdal
  // (available at https://github.com/postman-eng/platform-heimdal) is mandatory.
  if (req.postman && req.postman.isAuthenticated()) {
    return next();
  }

  return res.callback(new Error('UNAUTHENTICATED'), {});
};
