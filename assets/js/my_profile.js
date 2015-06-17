/* Camera listener */
/*this.$el.on('click', '.change-pic-btn', this.changePicture);

this.changePicture = function(event) {
  event.preventDefault();
  if (!navigator.camera) {
      alert("Camera API not supported", "Error");
      return;
  }
  var options =   {   quality: 50,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
                      encodingType: 0     // 0=JPG 1=PNG
                  };

  navigator.camera.getPicture(
      function(imgData) {
          $('.media-object', this.$el).attr('src', "data:image/jpeg;base64,"+imgData);
      },
      function() {
          alert('Error taking picture', 'Error');
      },
      options);

  return false;
};

window.imagePicker.getPictures(
	function(results) {
		for (var i = 0; i < results.length; i++) {
			console.log('Image URI: ' + results[i]);
		}
	}, function (error) {
		console.log('Error: ' + error);
	}, {
		maximumImagesCount: 10,
		width: 800
	}
);*/

var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : base_url;
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function() {
		var request = url+"profile/get_client_details";
        return $.ajax({url: request});
    }

    this.update_client = function(form_data) {
		var request = url+"profile/edit_profile";
        return $.ajax({url: request, type: "POST", data: form_data});
    }

    this.get_subscription_details = function(form_data) {
		var request = url+"subscription/subscribe";
        return $.ajax({url: request});
    }

    this.purchase_credit = function(form_data) {
		var request = url+"subscription/purchase_credit";
        return $.ajax({url: request, type: "POST", data: form_data});
    }
}

//on page load if the user has logged in previously,
//log them in automatically
$(document).ready(function(){
	$( "#loader-wrapper" ).addClass( "display_none" );
	
	var email = window.localStorage.getItem("client_email");
	var password = window.localStorage.getItem("client_password");
	
	get_client_details();
	get_subscription_details();
	
	var myScroll;
	myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
});

//client details
function get_client_details()
{
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
	
	service.findByName().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			window.localStorage.setItem("profile_image_location", data.profile_image_location);
			window.localStorage.setItem("client_gender_id", data.gender_id);
			window.localStorage.setItem("client_about", data.client_about);
			window.localStorage.setItem("client_looking_gender_id", data.client_looking_gender_id);
			window.localStorage.setItem("client_age_group_id", data.age_group_id);
			window.localStorage.setItem("client_encounter_id", data.encounter_id);
			window.localStorage.setItem("client_dob1", data.client_dob1);
			window.localStorage.setItem("client_dob2", data.client_dob2);
			window.localStorage.setItem("client_dob3", data.client_dob3);
			
			$("#client_email").val(window.localStorage.getItem("client_email"));
			$("#client_username").val(window.localStorage.getItem("client_username"));
			$("#client_dob1").val(window.localStorage.getItem("client_dob1"));
			$("#client_dob2").val(window.localStorage.getItem("client_dob2"));
			$("#client_dob3").val(window.localStorage.getItem("client_dob3"));
			$("#client_about").val(window.localStorage.getItem("client_about"));
			$("#profile_image").html('<img src="'+window.localStorage.getItem("profile_image_location")+'" class="img-responsive">');
			$('#gender_id').val(window.localStorage.getItem("client_gender_id"));
			$('#looking_for').val(window.localStorage.getItem("client_looking_gender_id"));
			$('#client_age_group_id').val(window.localStorage.getItem("client_age_group_id"));
			$('#client_encounter_id').val(window.localStorage.getItem("client_encounter_id"));
		}
	});
}

//subscription details
function get_subscription_details()
{
	var subscription_details = window.localStorage.getItem("subscription_details");
	
	if(subscription_details == null)
	{
		var service = new EmployeeService();
		service.initialize().done(function () {
			console.log("Service initialized");
		});
		
		//get client's credentials
		
		service.get_subscription_details().done(function (employees) {
			var data = jQuery.parseJSON(employees);
			//alert(data.content);
			subscription_details = window.localStorage.setItem("subscription_details", data.content);
		});
	}
	
	$("#subscription_details").html(subscription_details);
}

//Update client
$(document).on("submit","form#update_client_profile",function(e)
{
	e.preventDefault();
	$("#response").html('').fadeIn( "slow");
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get the form data
	var formData = new FormData(this);
	
	service.update_client(formData).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.response == "success")
		{
			//update client details
			get_client_details();
		}
		else
		{
			$( "#loader-wrapper" ).addClass( "display_none" );
			$("#response").html('<div class="alert alert-danger center-align">'+data.message+'</div>').fadeIn( "slow");
		}
	});
	
	return false;
});

//Subscribe client
$(document).on("submit","#subscription_details form",function(e)
{
	e.preventDefault();
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get the form data
	var formData = new FormData(this);
	
	service.purchase_credit(formData).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$( "#loader-wrapper" ).addClass( "display_none" );
		$("#purchase_credit").html(data.content).fadeIn( "slow");
	});
	
	return false;
});