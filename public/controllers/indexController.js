var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {
  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var mydata = $.param({
                "title": $scope.title,
                "writing": simplemde.value(),
                "coursecode" : $scope.coursecode
               });
    $http({
        url: 'http://localhost:3000/contents',
        method: "POST",
        data: mydata
    })
    .then(function(response) {
        $window.location.href = response.data;
    },
    function(response) {
        alert("great failure");
    });
  }

  $scope.redirect = function (){
    var coursecode = $scope.coursecode;
    coursecode = coursecode.toLowerCase();
    coursecode = coursecode.replace(/\s/g, '');
    $window.location.href = "http://localhost:3000/courses/"+ coursecode;

  }




}]);
