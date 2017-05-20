var app = angular.module("app", ["ngMaterial", "ng","ngAnimate","ngAria", "angucomplete-alt"]);
app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  var oldcoursecode = ""
  $scope.changeText = function(model){
                          if(model){
                             $scope.text = "PUBLIC";
                             $scope.coursecode = oldcoursecode;
                             $scope.coursecodereadonly = false;

                          }else{
                             $scope.text = $scope.coursecode = "PRIVATE";
                             $scope.coursecodereadonly = true;

                          }
                      }

  $scope.text = "PUBLIC";
  $scope.model = true

  $scope.proceed = function() {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var text = quill.getText();
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var coursecode = $scope.coursecode;
    coursecode = coursecode.replace(/\s+/g,'');
    if (coursecode == ""){
      coursecode = "PRIVATE";
    }
    console.log(coursecode)
    var mydata = $.param({
                "title": $scope.title,
                "writing": text,
                "coursecode": coursecode,
                "delta": delta,
                "privacyLevel": $scope.text  // TODO
                });
    $http({
        url: '/api/note',
        method: "POST",
        data: mydata
    })
    .then(function(response) {
        if (coursecode == "PRIVATE"){
          $window.location.href = '/'
        } else{
          $window.location.href = '/courses/' + coursecode + "/" + response.data;
        }


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
    oldcoursecode = $scope.coursecode_display = getCourseCode();
    $scope.coursecodereadonly = false;


    $http({
      method: "GET",
          url: '/api/notes/course/' + $scope.coursecode.toUpperCase()
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
      $window.location.href = '/courses/' + x.originalObject.title;
    } else if(x.originalObject.type === "title") {
      $window.location.href = '/courses/' + x.originalObject.coursecode.toUpperCase() + "/" + x.originalObject.id;
    }
  }
}]);
