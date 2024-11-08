const { i18n } = require("./next-i18next.config");

module.exports = {
  plugins: {
    autoprefixer: {
      // Customize browser support if needed
      overrideBrowserslist: ['> 1%', 'last 2 versions'],
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/server/public/files/**",
      },
      {
        protocol: "https",
        hostname: "onlyfriend.ch",
        port: "",
        pathname: "/server/public/files/**",
      },
      {
        protocol: "https",
        hostname: "onlyfriend.ch",
        port: "",
        pathname: "/server/public/files/**",
      },
    ],
  },
};
