module.exports = function flash(options) {
  options = options || {};
  var safe = (options.unsafe === undefined) ? true : !options.unsafe;

  return function(req, res, next) {
    if (req.flash && safe) { return next(); }
    req.flash = _flash;
    next();
  }
}