var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria", "angucomplete-alt"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  $scope.changeText = function(model){
                          if(model){
                             $scope.text = "Public";
                          }else{
                             $scope.text = "Private"
                          }
                      }

  $scope.text = "Private";

  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var text = quill.getText();
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var mydata = $.param({
                "title": $scope.title,
                "writing": text,
                "coursecode": $scope.coursecode.toUpperCase().replace(/\s+/g, ''),
                "delta": delta,
                "privacyLevel": $scope.text  // TODO
                  });
    $http({
        url: 'http://localhost:3000/api/note',
        method: "POST",
        data: mydata
    })
    .then(function(response) {
        $window.location.href = 'http://localhost:3000/courses/' + $scope.coursecode + "/" + response.data;
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
    $scope.coursecode_display = getCourseCode();

    $http({
      method: "GET",
          url: 'http://localhost:3000/api/notes/course/' + $scope.coursecode.toUpperCase()
      })
      .then(function(response) {
        $scope.notesList = response.data;
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
