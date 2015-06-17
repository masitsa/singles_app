var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : base_url;
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.likes_me = function() {
		var request = url + "account/likes_me";
        return $.ajax({url: request});
    }

    this.i_like = function() {
		var request = url + "account/i_like";
        return $.ajax({url: request});
    }
}
$(document).ready(function(){
      get_all_likes_me();
      get_all_i_like();
});
function get_all_likes_me()
{
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.likes_me().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$("#likes ul").html(data.result).fadeIn( "slow");
		$("#profile_username").html(data.username).fadeIn( "slow");

		var myScroll;
		myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	/*$.ajax({
		type:'POST',
		url: base_url+"mobile/account/likes_me?callback=?",
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			$("#likes ul").html(data.result).fadeIn( "slow");
			$("#profile_username").html(data.username).fadeIn( "slow");
	
			var myScroll;
			myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		error: function(xhr, status, error) 
		{
			$("#likes ul").html('<div class="alert alert-danger center-align">'+error+'</div>').fadeIn( "slow");
		}
	});
	
	return false;*/
}

function get_all_i_like()
{
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.i_like().done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$("#i_like ul").html(data.result).fadeIn( "slow");
		$("#profile_username").html(data.username).fadeIn( "slow");

		var myScroll;
		myScroll = new IScroll('#wrapper2', { bounceEasing: 'elastic', bounceTime: 1200 });
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	
	/*$.ajax({
		type:'POST',
		url: base_url+"mobile/account/i_like?callback=?",
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			$("#i_like ul").html(data.result).fadeIn( "slow");
			$("#profile_username").html(data.username).fadeIn( "slow");
	
			var myScroll;
			myScroll = new IScroll('#wrapper2', { bounceEasing: 'elastic', bounceTime: 1200 });
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		error: function(xhr, status, error) 
		{
			$("#i_like ul").html('<div class="alert alert-danger center-align">'+error+'</div>').fadeIn( "slow");
		}
	});
	
	return false;*/
}