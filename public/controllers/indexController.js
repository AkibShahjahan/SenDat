var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria", "angucomplete-alt"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var text = quill.getText();
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var coursecode = $scope.coursecode;
    coursecode = coursecode.replace(/\s+/g,'');
    var mydata = $.param({
                "title": $scope.title,
                "writing": text,
                "coursecode" : $scope.coursecode,
                "delta": delta 
               });
    $http({
        url: 'http://localhost:3000/contents',
        method: "POST",
        data: mydata
    })
    .then(function(response) {
        alert(response.data);
        $window.location.href = response.data;
    },
    function(response) {
        alert("great failure");
    });
  }

  $scope.selectedObject = function(x) {
    if(x.originalObject.type === "coursecode") {
      $window.location.href = 'http://localhost:3000/courses/' + x.originalObject.title;
    } else if(x.originalObject.type === "title") {
      $window.location.href = 'http://localhost:3000/courses/' + x.originalObject.coursecode.toUpperCase() + "/" + x.originalObject.id;
    }
  }






}]);
