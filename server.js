// server.js

    // set up ========================
    var express  = require('express');
    var god      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan   = require('morgan');                         // log requests to the console (express4)
    var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
    var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)

    // configuration =================

    mongoose.connect('mongodb://ancalagon:fearandanger@proximus.modulusmongo.net:27017/uDopez4i');     // connect to mongoDB database on modulus.io

    god.use(express.static(__dirname + '/public'));                                                    // set the static files location /public/img will be /img for users
    god.use(morgan('dev'));                                                                           // log every request to the console
    god.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    god.use(bodyParser.json());                                     // parse application/json
    god.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    god.use(methodOverride());

    //Database configuration
    var ToDoSchema = mongoose.Schema({
        user_name : String ,
        color : String ,
        task : String ,
        assigned : Boolean ,
        completed : Boolean ,
        deadline : Number ,
        completed_on : Number ,
        priority : Number ,
        weightage : Number        
    
    }) ;

    var EmployeeSchema = mongoose.Schema({
        user_name : String ,
        password : String ,
        color : String ,
        profile_picture : String ,
        total_completed : Number ,
        total_incomplete : Number ,
        access_level : Number
    }) ;

    var ToDo = mongoose.model('ToDos',ToDoSchema) ;
    var Users = mongoose.model('Employees',EmployeeSchema) ;

    god.post('/api/userLogIn', function(request, response){
        console.log(request.body.userName) ;
        Users.find({"user_name" : request.body.userName},function(error, retrieved){
             if (error){
                response.send(error) ;
            }

            response.json(retrieved) ; 
        }) ;
    }) ;


    god.get('/api/checkedTodo', function(request, response){
        ToDo.find({"completed": "true" },function(error, todos) {
            if (error){
                response.send(error) ;
            }

            response.json(todos) ; 
        }) ;
    }) ;


    god.post('/api/todo' , function(request,response){
         ToDo.find({"user_name": request.body.userName, "completed" : false},function(error, todos) {
            if (error){
                response.send(error) ;
            }

            response.json(todos) ; 
        }) ;
    }) ;

    god.post('/api/todos' , function(request , response){
        //console.log(request.body.user_name) ;
        //console.log(request.body.task) ;
        
        ToDo.create({
            user_name : request.body.user_name ,
            task : request.body.task ,
            assigned : false ,
            completed : false ,
            assigned_on : 00000000 ,
            completed_on : 00000000
        }, function(error, todo) {
            if (error) {
                response.send(error) ;
            }
    
            // get and return all the todos after you create another
            ToDo.find({"completed":"false"}, function(error, todos) {
                if (error){
                    response.send(error) ;
                }
                response.json(todos) ;
            });
        });
    
    }) ;


    god.post('/api/checkTodos' , function(request , response){
        //console.log(request.body.user_name) ;
        //console.log(request.body.task) ;
        //console.log(request.body.id) ;
        //response.json(request.body.id) ;
        ToDo.update({"_id" : request.body.id},
            {$set:{"completed" : "true", "completed_on" : request.body.completed }},
            function(error,data){
                if (error) response.send(error) ;
            }) ;

        Users.update({"user_name" : request.body.user}, {$inc : {"total_incomplete" : -1, "total_completed" : 1}},function(error, retrieved){
             if (error){
                response.send(error) ;
            }

            //response.json(retrieved) ; 
            }) ;

        ToDo.find({"user_name" : request.body.user , "completed" : false}, function(error, todos) {
                if (error){
                    response.send(error) ;
                }
                response.json(todos) ;
            });
        
    
    }) ;

    //Front-end handling 

    god.get('*', function(request, response) {
        response.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    god.listen(8080) ;
    console.log("God listens on port 8080") ;

//db.todos.update({user_name : "ancalagon"},{$push:{todo_tasks : {task : "courageanddying", assigned : true}}}) 