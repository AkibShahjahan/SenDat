var app = angular.module("app", ["ngMaterial" , "angucomplete-alt"]);

app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  $scope.gettingClient = function() {
    $http({
      method: "GET",
          url: 'http://www.senndat.com/api/note/' + getId()
      })
      .then(function(response) {
          $scope.title = response.data.title;
          quill.setContents(JSON.parse(response.data.delta));
          $scope.coursecode = response.data.coursecode;
          $scope.switchtext = response.data.privacyLevel;
            $http({
              method: "GET",
                  url: 'http://www.senndat.com/api/notes/course/' + $scope.coursecode.toUpperCase()
              })
              .then(function(response) {
                $scope.notesList = response.data;
                $scope.length = 3;
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
      url: "http://www.senndat.com/api/note/" + id
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
    if(x.originalObject.type === "coursecode") {
      $window.location.href = 'http://www.senndat.com/courses/' + x.originalObject.title;
    } else if(x.originalObject.type === "title") {
      $window.location.href = 'http://www.senndat.com/courses/' + x.originalObject.coursecode.toUpperCase() + "/" + x.originalObject.id;
    }
  }

}]);
