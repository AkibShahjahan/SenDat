var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {


  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var text = quill.getText();
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var mydata = $.param({
                "title": $scope.title,
                "writing": text,
                "coursecode": $scope.coursecode,
                "delta": delta
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
    var len = url.length;
    for(var i = len-1; i > 0; i--) {
      if(url[i] === "/") break;
      id = url[i] + id;
    }
    return id.toUpperCase();
  }


  $scope.gettingClient = function() {
    $scope.coursecode = getCourseCode();

    $http({
      method: "GET",
          url: 'http://localhost:3000/contents/courses/' + $scope.coursecode.toUpperCase()
      })
      .then(function(response) {
        $scope.notesList = response.data;
      },
      function(response) {
          alert("great failure");
    });
  }
}]);
