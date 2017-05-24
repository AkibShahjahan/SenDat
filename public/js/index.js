    var color_value;
	//var main_color_value;
	var date = new Date();
	var day = date.getDay();
	console.log("index day = " + day);
	//Random Amber
	// Changing monday (day 0) to lighten-4 change it back to lighten-1 or think of an alternative.

	if(day === 0){
		color_value = "orange lighten-1";
	}
	else if(day === 1){
		color_value = "orange accent-1";
	}
	else if(day === 2){
		color_value = "orange lighten-3";
	}
	else if(day === 3){
		color_value = "orange lighten-2";
	}
	else if(day === 4){
		color_value = "orange lighten-1";
	}
	else if(day === 5){
		color_value = "orange accent-2";
	}
	else if(day === 6){
		color_value = "orange";
	}

$('document').ready(function() {
	function statusChangeCallback(response) {
		//alert('statusChangeCallback');
		//alert(JSON.stringify(response));
		if (response.status === 'connected') {
				//alert("calling testapi");
				testAPI();
		} else if (response.status === 'not_authorized') {
					//alert(JSON.stringify(response));
		}
	};

			//'242993122827489',
	window.fbAsyncInit = function() {
		FB.init({
<<<<<<< HEAD
			appId      : '700540203447896',
			//'194473814346087',
			cookie     : true,
=======
			appId      : '194473814346087',
>>>>>>> a218aa51aee1fb02dc05c1fdc94955d42b3f440a
			xfbml      : true,
			version    : 'v2.8'
		});
		FB.getLoginStatus(function(response) {
				//alert("dsfsafdsda");
                statusChangeCallback(response);
    });
	};

	(function(d, s, id){
		 var js, fjs = d.getElementsByTagName(s)[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement(s); js.id = id;
		 js.src = "//connect.facebook.net/en_US/sdk.js";
		 fjs.parentNode.insertBefore(js, fjs);
	 }(document, 'script', 'facebook-jssdk'));

	function testAPI() {
	    FB.api('/me', function(response) {
				localStorage.setItem("name", response.name);
				localStorage.setItem("fbId", response.id);
				angular.element('#controller').scope().gettingUserNotes(response.id);
	    });
  	};

 	});

$('document').ready(function() {
			$("#titlebox").keyup(function() {
			    if(this.value) {
				      $(this).css({
				        "border-left" : "1px #DADADA solid"
				      });
				      $("#title_label").html("Title");
			    } else if (! this.value){
				      $(this).css({
				        "border-left" : "none"
				      });
				      $("#title_label").html("");
			    }
			  });

			$("#coursebox").keyup(function() {
			    if(this.value) {
			      $(this).css({
			        "border-left" : "1px #DADADA solid"
			      });
			      $("#coursecode_label").html("Course");
			    } else if (! this.value){
			      $(this).css({
			        "border-left" : "none"
			      });
			      $("#coursecode_label").html("");
			    }
			  });

			$("#slide-out").addClass(color_value);
			$("#searchicon").addClass(color_value);
			 document.getElementById("name").innerHTML = localStorage.getItem("name");
			 //document.getElementById("name").innerHTML = "Jeeeeez";
			$("#slide-out").hide().fadeIn('slow');
			$("#container").hide().fadeIn('slow');
		});
