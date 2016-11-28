var app = angular.module("app", ["ngMaterial" , "angucomplete-alt"]);

app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  $scope.gettingClient = function() {
    $http({
      method: "GET",
          url: 'http://localhost:3000/contents/' + getId()
      })
      .then(function(response) {
          $scope.title = response.data.title;
          quill.setContents(JSON.parse(response.data.delta));
          $scope.coursecode = response.data.coursecode;
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
      },
      function(response) {
              alert(getId());
      });
  }

  $scope.setNew = function(id) {
    $http({
      method: "GET",
      url: "http://localhost:3000/contents/" + id
    })
    .then(function(response) {
        $scope.title = response.data.title;
        quill.setContents(JSON.parse(response.data.delta));
        $scope.coursecode = response.data.coursecode;
    }, 
    function(response) {
        alert("great failure");
    });
  }

  var getId = function() {
    var url = ($window.location + '');
    var id = "";
    var len = url.length;
    for(var i = len-1; i>=0; i--) {
      if(url[i] === "/") { break; }
      id = url[i] + id
    }
    return id;
  }

  $scope.selectedObject = function(x) {
    // alert(JSON.stringify(x));
    $window.location.href = 'http://localhost:3000/courses/' + x.originalObject.coursecode;
  }



}]);
