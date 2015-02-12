// public/core.js
var scotchTodo = angular.module('scotchTodo', ['ngCookies']);
/*
var cache = $cacheFactory('myCache');
cache.put("hello", "world");
cache.get("hello");
*/


function mainController($scope, $http, $cookieStore) {
    //cache = $cacheFactory('tcache') ;
    //console.log(cache.info()) ;
    $scope.loggedIn = false ;
    $scope.taskData = {} ;
    $scope.logInData = {} ;
    $scope.adminData = {} ;
    //$scope.taskData.user_name = "ancalagon" ;
    // when landing on the page, get all todos and show them
    getCkTD() ;

    console.log($cookieStore.get("loggedIn")) ;
    if($cookieStore.get("loggedIn") === "true"){
        console.log("Caching available ... ") ;
        $scope.loggedIn = true ;
        $scope.taskData.user_name = $cookieStore.get("user") ;
        $scope.logInData.userName = $cookieStore.get("user") ;
        $scope.taskData.color = $cookieStore.get("color") ;
        $scope.logInData.color = $cookieStore.get("color") ;
        getposts() ;
    }
    else{
        console.log("Caching not available") ;
    }

    $scope.logIn = function() {
        var send_data = {"userName" : $scope.logInData.userName } ;
        $http.post('api/UserLogIn', send_data)
            .success(function(data){
                if(data[0].password == $scope.logInData.password){
                    $scope.logInData.color = data[0].color ;
                    $scope.logInData.completed = data[0].total_completed ;
                    console.log(data[0].total_completed) ;
                    $scope.taskData.user_name = data[0].user_name ;
                    if($scope.logInData.userName == "admin"){
                        $scope.loggedIn = "admin" ;
                    }
                    else{
                        $scope.loggedIn = true ;
                        $cookieStore.put("loggedIn","true") ;
                    }
                    $cookieStore.put("user", data[0].user_name) ;
                    $cookieStore.put("color", data[0].color) ;
                    
                    console.log("Hooray :D :D , we stored cache data") ;
                    getposts() ;
                }
                else{
                    console.log("Ohh no, you suck :( ") ;
                }
                //console.log(data[0].password + data.user_name) ;
            })

            .error(function(){
                console.log("Error : "+ data) ;
            }) ;
    } ;

    $scope.logUserOut = function(){
        $cookieStore.put("loggedIn","false") ;
        $scope.loggedIn = false ;
    } ;


    function getCkTD(){
        $http.get('/api/checkedTodo')
        .success(function(data){
            $scope.checkedTodos = data ;
        })
        .error(function(data){
            console.log("Error ") ;
        }) ;
    } ;

    /**
    $http.get('/api/checkedTodo')
        .success(function(data){
            $scope.checkedTodos = data ;
        })
        .error(function(data){
            console.log("Error ") ;
        }) ;
    **/
function getposts(){
    $http.post('/api/todo', $scope.logInData)
        .success(function(data) {
            $scope.todos = data ;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        }) ;
}


    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.taskData)
            .success(function(data) {
                $scope.taskData.task = " "; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            }) ;
    } ;

    // delete a todo after checking it
    $scope.completeTodo = function(id) {
        var date = new Date() ;
        date = date.getTime() ;
        var query = {"id" : id, "completed" : date, "user" : $scope.logInData.userName } ;
        $http.post('/api/checkTodos', query)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data) ;
            }) ;
            getCkTD() ;
    };

}