import express from "express";
import mongoose from "mongoose";
import bp from "body-parser";
import dotenv from "dotenv";

dotenv.config();


import loggerMiddleware from "./middleware/logger.middleware.js";
import postMiddleware from "./middleware/content-type.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authenticateTokenMiddleware from "./middleware/authenticate-token.middleware.js";

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


import usersRouter from "./routes/user.route.js";
import imagesRouter from "./routes/images.route.js";
import bankAccountsRouter from "./routes/bank-account.route.js";
import accountMovementsRouter from "./routes/account-movement.route.js";
import servicesRouter from "./routes/service.route.js";

import cors from "cors";
/*
var corsOptions = {
  origin: ['http://localhost:3000', 'https://project-3-backend-daniel.herokuapp.com/','https://project-3-frontend-daniel.herokuapp.com/'],
  credentials: true,
};

app.use(cors(corsOptions));
*/
//app.options('*', cors());


app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//Custom middlewares
app.use(loggerMiddleware);
app.post("/*", postMiddleware);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested, Content-Type, Accept Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "POST, PUT, PATCH, GET, DELETE"
    )
    return res.status(200).json({})
  }
  next()
})
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
*/
app.get("/", (req, res, next) => {
  res.send("Welcome to Daniel's backend server. Enjoy the api!");
});
app.use("/users", usersRouter);
app.use("/images", imagesRouter);
app.use("/bank-accounts", authenticateTokenMiddleware, bankAccountsRouter);
app.use("/movements", authenticateTokenMiddleware, accountMovementsRouter);
app.use("/services", authenticateTokenMiddleware, servicesRouter);
//app.use("/authors",authenticateTokenMiddleware.authenticateToken,authorsRouter);

app.use(errorMiddleware);
//console.log(require('crypto').randomBytes(64).toString('hex'));

export default app;