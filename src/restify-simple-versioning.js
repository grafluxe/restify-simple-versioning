let errors = require("restify-errors");

/**
 * @author Leandro Silva
 * @copyright 2017 Leandro Silva (http://grafluxe.com)
 * @license MIT
 */

class Versioner {
  /**
   * An array of available API versions.
   * @type {Array}
   * @example
   * let versioner = require("restify-simple-versioning");
   * versioner.versions = [1, 2];
   */
  static set versions(val) {
    Versioner._versions = val;
  }

  static get versions() {
    return Versioner._versions || [1];
  }

  /**
   * Returns the current API version.
   * @type {Number}
   */
  static get currentVersion() {
    return Versioner._currentVer;
  }

  /**
   * Returns the API version as seen in the URI. If no version is used in
   * the URI, an empty string is returned.
   * @type {String}
   */
  static get uri() {
    return (Versioner._versionInURI ? "v" + Versioner._currentVer : "");
  }

  /**
   * Adds version path support to your URI. The version format is
   * the letter "v" followed by a number (e.g. v1). If no version
   * is added to the URI, the latest version will be used by default.
   * Additionally, the header 'API-Version' is included in each response.
   * @throws {InvalidVersionError} Throws if the version you requested does not exist.
   * @param {Object}   req  The Restify request param.
   * @param {Object}   res  The Restify result param.
   * @param {Function} next The Restify next method.
   */
  static addVersionRoute(req, res, next) {
    let parts = req.url.match(/^\/v(\d{1,})(\/.+)/);

    if (parts) {
      Versioner._versionInURI = true;
      Versioner._currentVer = Number(parts[1]);
      req.url = parts[2];
    } else {
      Versioner._versionInURI = false;
      Versioner._currentVer = Versioner.versions.reduce((curr, next) => Math.max(curr, next));
    }


    if (Versioner.versions.includes(Versioner._currentVer)) {
      res.header("API-Version", Versioner._currentVer);
      next();
    } else {
      next(new errors.InvalidVersionError({
        statusCode: 409,
        message: "The API version you requested does not exist."
      }));
    }
  }

}

module.exports = Versioner;
