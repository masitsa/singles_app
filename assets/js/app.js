var base_url = 'http://mobile.nairobisingles.com/mobile/';

/* Function to check for network connectivity */

function is_connected()
{
	navigator.network.isReachable(base_url, function(status) {
		var connectivity = (status.internetConnectionStatus || status.code || status);
		if (connectivity === NetworkStatus.NOT_REACHABLE) {
			return false;
			//alert("No internet connection - we won't be able to show you any maps");
		} else {
			return true;
			//alert("We can reach Google - get ready for some awesome maps!");
		}
	});
}

var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://mobile.nairobisingles.com/mobile/login/login_client";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function(email, password) {
		var request = url + "/" + email + "/" + password;
        return $.ajax({url: request});
    }


}

//on page load if the user has logged in previously,
//log them in automatically
$(document).ready(function(){
	automatic_login();
});

//automatic login
function automatic_login()
{
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	//get client's credentials
	var email = window.localStorage.getItem("client_email");
	var password = window.localStorage.getItem("client_password");
	
	service.findByName(email, password).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			window.localStorage.setItem("client_username", data.client_username);
			window.location.href = 'pages/profiles.html';
		}
		
		else
		{
			$( "#login_form" ).addClass( "display_block" );
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	});
}

//Login client
$(document).on("submit","form#signin-client",function(e)
{
	e.preventDefault();
	$("#response").html('').fadeIn( "slow");
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	//check if there is a network connection
	var connection = true;//is_connected();
	
	if(connection === true)
	{
		var service = new EmployeeService();
		service.initialize().done(function () {
			console.log("Service initialized");
		});
		
		//get form values
		var email = $("input[name=client_email]").val();
		var password = $("input[name=client_password]").val();
		
		service.findByName(email, password).done(function (employees) {
			var data = jQuery.parseJSON(employees);
			
			if(data.message == "success")
			{
				//set local variables for future auto login
				window.localStorage.setItem("client_email", email);
				window.localStorage.setItem("client_password", password);
				window.localStorage.setItem("client_username", data.client_username);
				
				//redirect to profiles page
				window.location.href = 'pages/profiles.html';
			}
			else
			{
				$( "#loader-wrapper" ).addClass( "display_none" );
				$("#response").html('<div class="alert alert-danger center-align">'+data.result+'</div>').fadeIn( "slow");
			}
        });
	}
	
	else
	{
		$("#response").html('<div class="alert alert-danger center-align">'+"No internet connection - please check your internet connection then try again"+'</div>').fadeIn( "slow");
		$( "#loader-wrapper" ).addClass( "display_none" );
	}
	return false;
});