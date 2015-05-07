var base_url = 'https://www.nairobisingles.com/';
var EmployeeService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://mobile.nairobisingles.com/mobile/";
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

    this.get_messages = function(web_name) {
		var request = url + "messages/view_message/"+web_name;
        return $.ajax({url: request});
    }
}
//Send message
$(document).on("submit","form#send-message",function(e)
{
	e.preventDefault();
	
	var message = $("input[name=client_message_details]").val();
	var receiver = $("input[name=receiver_id]").val();
	
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.findByName(message, receiver).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		if(data == "false")
		{
			$("ul.single_message").append('<li class="clear-both">Unable to send message. Please try again</li>');
		}
		else
		{
			$("ul.single_message").append(data.message);
			$("input[name=client_message_details]").val('');
			
			var myScroll;
			myScroll = new IScroll('#wrapper3', { bounceEasing: 'elastic', bounceTime: 1200, scrollbars: true, fadeScrollbars: true});
			myScroll.scrollTo(0, -parseInt($( '#scroller' ).height()), 1, IScroll.utils.ease.elastic);
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
	});

	/*$.ajax({
		type:'POST',
		url: base_url+$(this).attr('action')+"?client_message_details="+message+"&receiver_id="+receiver+"&callback=?",
		data:{ client_message_details: message, receiver_id: receiver },
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			if(data == "false")
			{
				$("ul.single_message").append('<li class="clear-both">Unable to send message. Please try again</li>');
			}
			else
			{
				$("ul.single_message").append(data.message);
				$("input[name=client_message_details]").val('');
				
				var myScroll;
				myScroll = new IScroll('#wrapper3', { bounceEasing: 'elastic', bounceTime: 1200, scrollbars: true, fadeScrollbars: true});
				myScroll.scrollTo(0, -parseInt($( '#scroller' ).height()), 1, IScroll.utils.ease.elastic);
				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			}
		},
		error: function(xhr, status, error) 
		{
			console.log("XMLHttpRequest=" + xhr.responseText + "\ntextStatus=" + status + "\nerrorThrown=" + error);
			$("ul.single_message").append('<li>'+error+'<li>');
		}
	});*/
	return false;
});
$(document).ready(function(){
	
	//get received messages
	get_messages();
	
	//check for new messages
	(function message_cheker() {
		
		// Schedule the next request when the current one's complete
		var receiver_id = $('#ajax_receiver').val();
		
		var prev_message_count = parseInt($('#prev_message_count').val());//count the number of messages displayed
		
		$.ajax({
			url: base_url+'mobile/messages/new_single_message_check/'+receiver_id, 
			cache:false,
			contentType: false,
			processData: false,
			dataType: 'json',
			success: function(data) 
			{
				var curr_message_count = parseInt(data.curr_message_count);//count the number of messages received
				
				//if there is a new message
				if(curr_message_count != prev_message_count)
				{
					$('#prev_message_count').val(curr_message_count);
					//display new message
					
					$("ul.single_message").append(data.message);
					
					var myScroll;
					myScroll = new IScroll('#wrapper3', { bounceEasing: 'elastic', bounceTime: 1200, scrollbars: true, fadeScrollbars: true});
					myScroll.scrollTo(0, -parseInt($( '#scroller' ).height()), 1, IScroll.utils.ease.elastic);
					document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				}
	
			},
			complete: function() 
			{
				setTimeout(message_cheker, 2000);
			}
		});
	})();
});
function get_messages()
{
	var web_name = getURLParameter('web_name');
	
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.get_messages(web_name).done(function (employees) {
		var data = jQuery.parseJSON(employees);
		
		$(".single_message").html(data.result).fadeIn( "slow");
		$("#profile_username").html(data.username).fadeIn( "slow");
		$("#ajax_receiver").val(data.receiver_id);
		$("#prev_message_count").val(data.received_messages);
		
		//scroll section
		var myScroll;
		myScroll = new IScroll('#wrapper3', { bounceEasing: 'elastic', bounceTime: 1200, scrollbars: true, fadeScrollbars: true});
		myScroll.scrollTo(0, -parseInt($( '#scroller' ).height()), 1, IScroll.utils.ease.elastic);
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	});
	/*$.ajax({
		type:'GET',
		url: base_url+"mobile/messages/view_message/"+web_name+"?callback=?",
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success:function(data)
		{
			$(".single_message").html(data.result).fadeIn( "slow");
			$("#profile_username").html(data.username).fadeIn( "slow");
			$("#ajax_receiver").val(data.receiver_id);
			$("#prev_message_count").val(data.received_messages);
			
			//scroll section
			var myScroll;
			myScroll = new IScroll('#wrapper3', { bounceEasing: 'elastic', bounceTime: 1200, scrollbars: true, fadeScrollbars: true});
			myScroll.scrollTo(0, -parseInt($( '#scroller' ).height()), 1, IScroll.utils.ease.elastic);
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		error: function(xhr, status, error) 
		{
			$(".single_message").html('<div class="alert alert-danger center-align">'+error+'</div>').fadeIn( "slow");
		}
	});
	
	return false;*/
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}



