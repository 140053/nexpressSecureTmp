const express = require('express');
const route = express.Router();
//const task = require('../controller/appController');
//const middleware = require('../middleware/auth');

/*
route.use(function(req,res,next){
    if(req.session.Logged_status == true){
       res.locals.ukey = req.session.uuid;
    }
    next();
});
*/

const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
  }
  
route.use(myLogger)
  

//home page
route.get('/',/*middleware.authenticated, task.indexv1*/ (req, res) => {
    res.send("as")
});



module.exports = route;