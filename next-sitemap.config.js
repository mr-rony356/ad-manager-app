/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.FRONTEND_URL,
  generateRobotsTxt: true,
  exclude: ["/admin/*"],
};
