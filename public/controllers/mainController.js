var app = angular.module("app", ["ngMaterial"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  $scope.gettingClient = function() {
    $http({
      method: "GET",
          url: 'http://localhost:3000/contents/' + getId()
      })
      .then(function(response) {
        $scope.title = response.data.title;
          $scope.content = response.data.writing;
      },
      function(response) {
          alert("great failure");
      });
  }

  var getId = function() {

    var url = ($window.location + '');
    var id = "";
    var start = false;
    var len = url.length;
    var slashCount = 0;
    for(var i = 0; i<len; i++) {
      if(start) {
        id += url[i];
      } else if(url[i] === "/"){
        slashCount++;
        if(slashCount === 3) {
          start = true;
        }
      }
    }
    return id;
  }


}]);
