var base_url = 'https://www.nairobisingles.com/';

var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://mobile.nairobisingles.com/mobile/account/get_all_profiles";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function() {
		var request = url;
        return $.ajax({url: request});
    }
}

$(document).ready(function(){
	display_username();
	get_all_profiles();
});

function display_username()
{
	var username = window.localStorage.getItem("client_username");
	$("#profile_username").html(username).fadeIn( "slow");
}
	

function get_all_profiles()
{
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.findByName().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$(".profiles").html(data.result).fadeIn( "slow");

		var myScroll;
		myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		
		//remove preloader
		$( "#loader-wrapper" ).addClass( "display_none" );
	});
	/*$.ajax({
		type:'POST',
		url: base_url+"mobile/account/get_all_profiles?callback=?",
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			$(".profiles").html(data.result).fadeIn( "slow");
			$("#profile_username").html(data.username).fadeIn( "slow");
	
			var myScroll;
			myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		error: function(xhr, status, error) 
		{
			$(".profiles").html('<div class="alert alert-danger center-align">'+error+'</div>').fadeIn( "slow");
		}
	});
	
	return false;*/
}



