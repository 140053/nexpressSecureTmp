const express = require("express");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redis = require("redis");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const multer = require("multer");
require('dotenv').config();
const app = express();
app.use(helmet());
app.disable("x-powered-by");

// Use cookie-parser middleware
app.use(cookieParser());

// Session setup
const expD = new Date(Date.now() + 60 * 60 * 1000);
app.use(
  session({
    name: "session",
    keys: ["qwertyuiop", "asdfghjkl"],
    cookie: {
      secure: true,
      //httpOnly: true,
      expires: expD,
    },
    resave: false, // Set resave to false unless you know you need it to be true
    saveUninitialized: false, // Set saveUninitialized to false unless you want to create sessions for unauthenticated users
    secret: process.env.SESSION_SECRET || 'your-secret-string'
  })
);

// Redis client setup
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

// Rate limiter setup
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate-limiter",
  points: 10, // Number of requests
  duration: 60, // Per second(s)
});



app.get('/', (req, res) => {
  res.send('Welcome')
})

// Apply the rate limiter middleware globally
app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
});

//for none existed route
app.use("*", function (req, res) { 
  res.status(404).send("Sorry Not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
//const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => {
 // console.log(`Server is running on port ${PORT}`);
//});
// Start server
const startServer = () => {
  const PORT = process.env.PORT ||  3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};


// Only start the server if this file is executed directly
if (require.main === module) {
  startServer();
}

// Export the app instance for testing
module.exports = app;