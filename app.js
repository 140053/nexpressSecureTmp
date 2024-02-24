const express = require("express");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redis = require("redis");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require('body-parser')
const multer = require("multer");
var compression = require('compression')
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(helmet());
app.disable("x-powered-by");


// compress responses
app.use(compression())

//Templating config
//templating engine
app.use(expressLayouts);
app.set('layout', './layouts/default')

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


//path to the view 
app.set('views',path.join(__dirname,'src/views'));
app.set('view engine', 'ejs');

//static files
//app.use('/pdfjs',express.static(path.join(__dirname,'app/custom_lib')));
app.use('/assets',express.static(path.join(__dirname,'node_modules')));
app.use(express.static(path.join(__dirname, 'src/public')));

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


// not authenticated routes
app.use('/', require('./src/routes/home'));



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