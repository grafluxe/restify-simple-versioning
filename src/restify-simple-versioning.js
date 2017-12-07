let errors = require("restify-errors");

/**
 * @author Leandro Silva
 * @copyright 2017 Leandro Silva (http://grafluxe.com)
 * @license MIT
 */

class Versioner {
  static set versions(val) {
    Versioner._versions = val;
  }

  static get versions() {
    return Versioner._versions || [1];
  }

  static get currentVersion() {
    return Versioner._currentVer;
  }

  static addVersionRoute(req, res, next) {
    let parts = req.url.match(/\/v(\d{1,})(\/.+)/);

    if (!parts) {
      Versioner._currentVer = Versioner.versions.reduce((curr, next) => Math.max(curr, next));
    } else {
      Versioner._currentVer = Number(parts[1]);
      req.url = parts[2];
    }

    if (Versioner.versions.includes(Versioner._currentVer)) {
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
