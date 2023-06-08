const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://stackblitz-starters-3fgh7o.stackblitz.io/',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    })
  );
};
