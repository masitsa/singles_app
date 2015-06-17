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

    this.findByName = function(message, receiver) {
		var request = url + "account/get_all_profiles";
        return $.ajax({url: request, data:{ client_message_details: message, receiver_id: receiver }});
    }

    this.get_messages = function() {
		var request = url + "messages/inbox/";
        return $.ajax({url: request});
    }
}
$(document).ready(function(){
      get_inbox();
});
function get_inbox()
{
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.get_messages().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$("#inbox").html(data.result).fadeIn( "slow");
		$("#profile_username").html(data.username).fadeIn( "slow");
	});
	/*$.ajax({
		type:'POST',
		url: base_url+"mobile/messages/inbox?callback=?",
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			$("#inbox").html(data.result).fadeIn( "slow");
			$("#profile_username").html(data.username).fadeIn( "slow");
		},
		error: function(xhr, status, error) 
		{
			$(".inbox").html('<div class="alert alert-danger center-align">'+error+'</div>').fadeIn( "slow");
		}
	});
	
	return false;*/
}

//Send message
$(document).on("click","a#view_mm",function(e)
{
	e.preventDefault();
	var web_name = $(this).attr('href');
	window.location.href = 'messages.html?web_name='+web_name;

	/**/
	return false;
});