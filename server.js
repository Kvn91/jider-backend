require("dotenv").config();

const express = require("express");
const app = express();
const https = require("https");
const http = require("http");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const connectDb = require("./config/dbConnection");
const corsOptions = require("./config/corsOptions");
const sslOptions = require("./config/ssl/sslOptions");

const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logEvents").logger;
const verifyJWT = require("./middleware/verifyJWT");

const PORT = process.env.PORT || 3500;
// const PORT_HTTPS = process.env.PORT_HTTPS || 443;

connectDb();
app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
// Apply authentication
// app.use(verifyJWT);
app.use("/scenarios", require("./routes/api/scenarios"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  http
    .createServer(app)
    .listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  // https
  //   .createServer({ ...sslOptions }, app)
  //   .listen(PORT_HTTPS, () =>
  //     console.log(`Server running on PORT ${PORT_HTTPS}`)
  //   );
});

mongoose.connection.on("error", (err) => {
  console.error(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
