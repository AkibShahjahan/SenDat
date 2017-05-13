var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria", "angucomplete-alt"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  $scope.privacyAction = function(privacy){
    if(privacy){
       $scope.privacy = "PUBLIC";
    }else{
       $scope.privacy = "PRIVATE";
       $scope.coursecode = "";
    }
  }

  $scope.privacy = "PUBLIC";
  $scope.privacyToggle = true;

  $scope.gettingUserNotes = function(fbId) {
    $http({
      method: "GET",
          url: 'http://localhost:3000/api/usernotes/' + fbId
      })
      .then(function(response) {
        $scope.notesList = response.data.notes;
      },
      function(response) {
          alert("great failure");
    });
  }

  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var text = quill.getText();
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var coursecode = $scope.coursecode;
    coursecode = coursecode.replace(/\s+/g,'');
    if (coursecode == ""){
      coursecode = "private";
    }
    var mydata = $.param({
                "title": $scope.title,
                "writing": text,
                "coursecode" : coursecode,
                "delta": delta,
                "privacyLevel": $scope.privacy
               });
    $http({
        url: 'http://localhost:3000/api/note',
        method: "POST",
        data: mydata
    })
    .then(function(response) {
        $window.location.href = 'http://localhost:3000/courses/' + coursecode + "/" + response.data;
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
