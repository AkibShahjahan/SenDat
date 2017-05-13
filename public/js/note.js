			var color_value;
			var date = new Date();
			var day = date.getDay();

			console.log("Note day = " + day);
			//Random Amber

			if(day === 0){
				color_value = "orange lighten-4";
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
			var myname = localStorage.getItem('name');
			document.getElementById("name").innerHTML = myname;
			$("#slide-out").hide().fadeIn('slow');
			$("#container").hide().fadeIn('slow');

		});


 $(".button-collapse").sideNav();
	var mq = window.matchMedia( "(min-width: 500px)" );
	if (mq.matches) {

	} else {
  		// window width is less than 500px
  		document.getElementById("slide-out").className = "side-nav yellow darken-2"
	}