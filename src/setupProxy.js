const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target:
        process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
          ? "http://localhost:3000/"
          : "http://localhost:3000/",
      changeOrigin: true,
    }),
  );
};
