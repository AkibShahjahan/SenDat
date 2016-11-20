var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {
  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var mydata = $.param({
                "title": $scope.title,
                "writing": simplemde.value(),
                "course_code": $scope.courseCode
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
  var getCourseCode = function() {
    var url = $window.location.href + '';
    var id = "";
    var start = false;
    var len = url.length;
    var slashCount = 0;
    for(var i = 0; i<len; i++) {
      if(start) {
        id += url[i];
      } else if(url[i] === "/"){
        slashCount++;
        if(slashCount === 4) {
          start = true;
        }
      }
    }
    return id.toUpperCase();
  }
  $scope.gettingClient = function() {
    $scope.courseCode = getCourseCode();
    $http({
      method: "GET",
          url: 'http://localhost:3000/contents/courses/' + $scope.courseCode.toUpperCase()
      })
      .then(function(response) {
        $scope.notesList = response.data;
      },
      function(response) {
          alert("great failure");
    });
  }
}]);
