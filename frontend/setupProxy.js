const { createProxyMiddleware } = require("http-proxy-middleware");
const create = (app) => {
  app.use(
    ["/api"],
    createProxyMiddleware({
      target: "http://localhost:8080",
    })
  );
};
module.exports = create;
