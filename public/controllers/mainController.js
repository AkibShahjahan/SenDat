var app = angular.module("app", ["ngMaterial" , "angucomplete-alt"]);

app.controller("MainController", ["$scope", "$http", '$window', function($scope, $http, $window) {

  var oldcoursecode = ""
   $scope.privacyAction = function(privacy){
    if(privacy){
       $scope.privacy = "PUBLIC";
       $scope.coursecode = oldcoursecode
       $scope.coursecodereadonly = false;
    }else{
       $scope.privacy = $scope.coursecode = "PRIVATE";
       $scope.coursecodereadonly = true;
    }
  }
  $scope.privacyToggle = true;
  $scope.gettingClient = function() {
    $scope.id = getId();
    $scope.titlereadonly = true;
    $scope.switchdisabled = true;
    $scope.coursecodereadonly = true;
    $http({
      method: "GET",
          url: 'http://localhost:3000/api/note/' + getId()
      })
      .then(function(response) {
          $scope.title = response.data.title;
          quill.setContents(JSON.parse(response.data.delta));
          quill.enable(false);
          $scope.coursecode_display = $scope.coursecode = response.data.coursecode;
          $scope.buttontitle = "Edit";
          $scope.privacy = response.data.privacyLevel;
          if ($scope.privacy == "PRIVATE" || $scope.privacy == "private"){
            $scope.privacyToggle = false
          }

          if ($scope.coursecode == "PRIVATE" || $scope.coursecode == "private"){
               fbId = localStorage.getItem("fbId");
                  $http({
                    method: "GET",
                        url: 'http://localhost:3000/api/usernotes/' + fbId
                    })
                    .then(function(response) {
                      var privatenotes = [];
                      var publicnotes = [];
                      $('#private_a').html('PRIVATE')
                      response.data.notes.forEach( function (arrayItem)
                      {
                          if (arrayItem.privacyLevel == "PRIVATE"){
                            privatenotes.push(arrayItem);
                          } else{
                            publicnotes.push(arrayItem);
                          }
                      });
                      if (publicnotes.length > 0){
                         $('#public_heading').show();
                         $('#public_list').show(); 
                      }
                      $scope.privatenotesList = privatenotes;
                      $scope.publicnotesList = publicnotes;
                    },
                    function(response) {
                        alert("great failure");
                  });
          } else{
              $http({
                method: "GET",
                    url: 'http://localhost:3000/api/notes/course/' + $scope.coursecode.toUpperCase()
                })
                .then(function(response) {
                      $('#public_list').hide(); 
                      $('#public_heading').hide();
                      $scope.privatenotesList = response.data;
                  //$scope.length = 3;
                },
                function(response) {
                    alert("great failure");
              });
          }
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
    if ($scope.privacy == "PUBLIC"){
      $scope.coursecodereadonly = false;
    }
    $scope.buttontitle = "Publish";
    oldcoursecode = $scope.coursecode
    if (oldcoursecode == "PRIVATE"){
      oldcoursecode = ""
    }
  }


  $scope.deletenote = function(){
    var noteid = $scope.id
    console.log(noteid)
    var url = 'http://localhost:3000/api/notes/delete/' + noteid
     $http({
          url: url,
          method: "DELETE",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      })
      .then(function(response) {
        console.log(JSON.stringify(response));
        $window.location.href = 'http://localhost:3000/'
      },
      function(response) {
          console.log(JSON.stringify(response));
          alert("great failure");
      });
  }


  $scope.proceed = function(id) {
    var delta = JSON.stringify(quill.getContents()); // have to stringify if we want pass it as a parameter
    var writing = quill.getText();
    var title = $scope.title;
    var coursecode = $scope.coursecode;
    console.log(coursecode)
    if (coursecode == "PRIVATE" && $scope.privacy == "PUBLIC"){
      alert("Hey there, You cannot have the note public with the coursenote \"PRIVATE\". Please change the coursecode or the Privacy")
    } else{
      var mydata = $.param({
                  "title" : title,
                  "writing" : writing,
                  "delta" : delta,
                  "coursecode" : coursecode,
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
          $scope.coursecodereadonly = true;
          $window.location.href = 'http://localhost:3000/courses/'+ $scope.coursecode.toUpperCase() +'/' + id
      },
      function(response) {
          console.log(JSON.stringify(response));
          alert("great failure");
      });
    }
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
