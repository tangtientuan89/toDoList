const createError = require("http-errors");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
app.use(helmet());
const indexRouter = require("./routers/index");
const doListRouter = require("./routers/doList");
const adminRouter = require("./routers/admin");
const registerRouter = require("./routers/register");
const verifyRouter = require("./routers/verify");
const changePasswordRouter = require("./routers/changePassword");
const forgotPasswordRouter = require("./routers/forgotPassword");
const authenticationRouter = require("./routers/authentication");
const passport = require("passport");
const rateLimiter = require("./config/rateLimiter");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(rateLimiter);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use("/public", express.static(path.join(__dirname, "public")));

require("./config/passport2")(passport);

app.use("/", authenticationRouter);
app.use("/", indexRouter);
app.use("/", doListRouter);
app.use("/", adminRouter);
app.use("/", registerRouter);
app.use("/", verifyRouter);
app.use("/", changePasswordRouter);
app.use("/", forgotPasswordRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;