var base_url = 'https://www.nairobisingles.com/';
var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://mobile.nairobisingles.com/mobile/";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.messages = function() {
		var request = url + "messages/inbox";
        return $.ajax({url: request});
    }
}

$(document).ready(function(){
      get_messages();
});
function get_messages()
{	
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.messages().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$(".messages").html(data.result).fadeIn( "slow");
		$("#profile_username").html(data.username).fadeIn( "slow");
		
		//scroll section
		var myScroll;
		myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	
	/*$.ajax({
		type:'GET',
		url: base_url+"mobile/messages/inbox?callback=?",
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			$(".messages").html(data.result).fadeIn( "slow");
			$("#profile_username").html(data.username).fadeIn( "slow");
			
			//scroll section
			var myScroll;
			myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		error: function(xhr, status, error) 
		{
			$(".messages").html('<div class="alert alert-danger center-align">'+error+'</div>').fadeIn( "slow");
		}
	});
	
	return false;*/
}


