const middleware = require("../middleware");

const routers = app => {
  // List of available Routes
  app.use("/roles", require("./Roles"));
  app.use("/auth", require("./Auth"));
  app.use("/users", require("./Users"));
  app.use("/wallets", require("./Wallets"));
  app.use("/records", require("./Records"));
  app.use("/requests", require("./Requests"));
  app.use("/cashouts", require("./Cashouts"));
  app.use("/news", require("./News"));
  app.use("/children", require("./Children"));
  app.use("/mailer", require("./Mailer"));
  app.use("/requestsgame", require("./RequestsGame"));
  app.use("/limitRequest", require("./LimitRequests"));
  app.use("/currencytransfer", require("./CurrencyTransfer"));
  // app.use(middleware.notFound);
  // app.use(middleware.errorHandler);
};

module.exports = routers;
