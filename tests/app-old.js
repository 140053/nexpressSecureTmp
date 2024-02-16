// app.js

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
//const csurf = require('csurf');
const expressLayouts = require("express-ejs-layouts");




const multer = require("multer");
//const knexConfig = require('./knexfile');


const app = express();
app.use(helmet());
app.disable('x-powered-by');
//const db = knex(knexConfig.development);

// Use cookie-parser middleware
app.use(cookieParser());

// Use a cookie parsing middleware
//session
const expD = new Date(Date.now() + 60 * 60 * 1000);
app.use(
    session({
        name: 'session',
        keys: ['qwertyuiop', 'asdfghjkl'],
        cookie: {
            secure: true,
            httpOnly:true,
            //domain: '',
            //path: '',
            expires: expD
        }
    })
    /*
  session({
    secret: "libman",
    resave: false,
    saveUninitialized: true,
  })
  */
);

// Configuration
//require("dotenv").config(); // Load environment variables from .env
const PORT = process.env.PORT || 3000;

//templating engine
//app.use(expressLayouts);
//app.set("layout", "./layouts/default");

// Middleware
app.use(express.urlencoded({ extended: true }));
//app.use(csurf({ cookie: true })); // CSRF protection
//app.use("/assets", express.static(path.join(__dirname, "node_modules")));
//app.use(express.static(path.join(__dirname, "public")));
////app.use(helmet());
//app.use(loggerMiddleware);
//app.use(compression()); // Gzip compression

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
/*

app.use("/", require("./routes/droute"));

//cataloging1
//app.use('/catalog', require("./routes/rcataloging"));
//login system
app.use("/lsystem", require("./routes/lsystem"));
//patron
app.use("/patron", require("./routes/patron"));
//lending
app.use("/lending", require("./routes/lending"));

//Reports
app.use("/reports/", require("./routes/reports"));
//file Upload
app.use("/file", require("./routes/fileUpload"));

//api
app.use("/api", require("./routes/api"));

*/
//for none existed route
app.use("*", function (req, res) {
    /*
  res.render("pages/error/notFound", {
    title: "404 Not Found",
    layout: "layouts/error",
  });
  */
 res.status(404).send("Sorry Not found");
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
