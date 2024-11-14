const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const compression = require("compression");
//const session = require("express-session");
const session = require("cookie-session");
// const cron = require("./cron-job");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3307;
const HOST = process.env.SERVER_HOST || "127.0.0.1";
// Specific domain
const allowedOrigins = JSON.parse(process.env.ALLOW_ORIGINS);

require("./models");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "test",
    cookie: { maxAge: 3600000 },
  })
);

/* CROS middleware */
app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// Use compression to reduce res size
app.use(
  compression({
    // Level of compression
    level: 6,
    // Res with this header will not be compressed
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.use(express.json());
app.use(routes);

//cron.start();

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port: ${PORT} ${HOST}`);
});
