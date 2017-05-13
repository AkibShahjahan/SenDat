var app = angular.module("app", ["ngMaterial" , "angucomplete-alt"]);

app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

   $scope.privacyAction = function(privacy){
    if(privacy){
       $scope.privacy = "PUBLIC";
    }else{
       $scope.privacy = "PRIVATE";
    }
  }

  $scope.privacy = "PUBLIC";
  $scope.privacyToggle = true;

  $scope.gettingClient = function() {
    $scope.id = getId();
    $scope.titlereadonly = true;
    $scope.switchdisabled = true;
    $http({
      method: "GET",
          url: 'http://localhost:3000/api/note/' + getId()
      })
      .then(function(response) {
          $scope.title = response.data.title;
          quill.setContents(JSON.parse(response.data.delta));
          quill.enable(false);
          $scope.coursecode = response.data.coursecode;
          $scope.buttontitle = "Edit";
          $scope.privacy = response.data.privacyLevel;
            $http({
              method: "GET",
                  url: 'http://localhost:3000/api/notes/course/' + $scope.coursecode.toUpperCase()
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
  $scope.editContent = function() {
    quill.enable(true);
    quill.focus();
    $scope.titlereadonly = false;
    $scope.switchdisabled = false;
    $scope.buttontitle = "Publish";
  }


  $scope.proceed = function(id) {
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var writing = quill.getText();
    var title = $scope.title;
    var mydata = $.param({
                "title" : title,
                "writing" : writing,
                "delta" : delta,
                "privacyLevel": $scope.privacy
               });
    var url = 'http://localhost:3000/api/note/update/' + id
    $http({
        url: url,
        method: "POST",
        data: mydata,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    })
    .then(function(response) {
        quill.enable(false);
        $scope.buttontitle = "Edit";
        $scope.titlereadonly = true;
        $scope.switchdisabled = true;
    },
    function(response) {
        console.log(JSON.stringify(response));
        alert("great failure");
    });
  }

  $scope.togglefunction = function(){
    if($scope.buttontitle === "Publish"){
      $scope.proceed($scope.id);
    }
    if($scope.buttontitle === "Edit"){
      $scope.editContent();
    }
    
  }

  $scope.setNew = function(id) {
    $http({
      method: "GET",
      url: "http://localhost:3000/api/note/" + id
    })
    .then(function(response) {
        $scope.title = response.data.title;
        quill.setContents(JSON.parse(response.data.delta));
        quill.enable(false);
        $scope.buttontitle = "Edit";
        $scope.coursecode = response.data.coursecode;
        $scope.id = id;

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
      $window.location.href = 'http://localhost:3000/courses/' + x.originalObject.title;
    } else if(x.originalObject.type === "title") {
      $window.location.href = 'http://localhost:3000/courses/' + x.originalObject.coursecode.toUpperCase() + "/" + x.originalObject.id;
    }
  }

}]);
