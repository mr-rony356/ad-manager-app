const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target:
        process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
          ? "https://api.onlyfriend.ch/"
          : "http://localhost:3000/",
      changeOrigin: true,
    }),
  );
};
