const express = require("express");
const mongoose = require("mongoose");
const bp = require('body-parser');
const dotenv = require("dotenv");

dotenv.config();


const loggerMiddleware = require("./middleware/logger.middleware");
const postMiddleware = require("./middleware/content-type.middleware");
const errorMiddleware = require("./middleware/error.middleware");
const authenticateTokenMiddleware = require("./middleware/authenticate-token.middleware");

const app = express();


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connection to mongodb opened`);
  })
  .catch((err) => {
    console.log("Error connecting to mongo: ", err);
  });


const usersRouter = require("./routes/user.route");
const imagesRouter = require("./routes/images.route");
const bankAccountsRouter = require("./routes/bank-account.route");
const accountMovementsRouter = require("./routes/account-movement.route");
const servicesRouter = require("./routes/service.route");

const cors = require("cors");
app.use(cors());


app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//Custom middlewares
app.use(loggerMiddleware.loggerHandler);
app.post("/*",postMiddleware.contentHandler)


app.get("/", (req, res, next) => {
  res.send("Welcome to Daniel's backend server. Enjoy the api!");
});
app.use("/users", usersRouter);
app.use("/images", imagesRouter);
app.use("/bank-accounts", bankAccountsRouter);
app.use("/movements", accountMovementsRouter);
app.use("/services", servicesRouter);
//app.use("/authors",authenticateTokenMiddleware.authenticateToken,authorsRouter);

app.use(errorMiddleware.errorHandler);
//console.log(require('crypto').randomBytes(64).toString('hex'));

module.exports = app;