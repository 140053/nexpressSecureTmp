'use strict'

//object constructor
var controller = function(task){
    this.task = task.task;
    this.status = task.status;
    this.created_at = new Date();
};


controller.home = function(req, res){
    //const title = typeof req.query.title === 'string' ? req.query.title : 'Search';
    res.render('pages/home',{
        title: "Home",
        hastdata:false,
        data: [],
        LoggedU: [],
        auth: []
    });
}


module.exports = controller;