'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {
  // Insert routes below
  app.use('/api/images', require('./api/image'));
  app.use('/api/routes', require('./api/routes'));
  app.use('/api/config', require('./api/config'));

  // All undefined asset or api routes should return a 404
  // This needs to be rewritten for Express 5 compatibility
  // Original: /:url(api|auth|components|app|bower_components|assets)/{*splat}
  // We'll use a middleware function to check the URL pattern
  app.use(function(req, res, next) {
    var url = req.url;
    // Check if URL starts with any of the asset/api paths
    var assetPaths = ['/api', '/auth', '/components', '/app', '/bower_components', '/assets'];
    var shouldReturn404 = assetPaths.some(function(path) {
      return url.startsWith(path) && url.length > path.length && url[path.length] === '/';
    });

    if (shouldReturn404) {
      return errors[404](req, res, next);
    }
    next();
  });

  // All other routes should redirect to the index.html
  app.route('/{*splat}').get(function(req, res) {
    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  });
};
