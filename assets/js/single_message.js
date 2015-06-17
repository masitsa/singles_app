var web_name = getURLParameter('web_name');

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
		var request = url + "messages/message_profile";
        return $.ajax({url: request, data:{ client_message_details: message, receiver_id: receiver }, type: "POST"});
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
			var prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+web_name));
			var curr_message_count = prev_message_count + 1;
			window.localStorage.setItem("prev_message_count"+web_name, curr_message_count);
			
			//get prev msg
			var prev_msg = window.localStorage.getItem("message_history"+web_name);
			var new_msg = prev_msg+data.message;
			window.localStorage.setItem("message_history"+web_name, new_msg);
			
			$("ul.single_message").append(data.message);
			$("input[name=client_message_details]").val('');
		
			add_scroller();
		}
	});
	return false;
});
$(document).ready(function(){
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	// device APIs are available
	//
	function onDeviceReady() {
		navigator.notification.vibrate(2000);
		//navigator.notification.beep(1);
	}
	
	//check for previously retrieved messages
	var prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+web_name));
	
	if(isNaN(prev_message_count))
	{
		//get received messages
		get_messages();
	}
	
	display_messages();
	$( "#loader-wrapper" ).addClass( "display_none" );
	
	//check for new messages
	(function message_cheker() {
		
		// Schedule the next request when the current one's complete
		var receiver_id = $('#ajax_receiver').val();
		
		var prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+web_name));
		//parseInt($('#prev_message_count').val());//count the number of messages displayed
		
		$.ajax({
			url: base_url+'messages/new_single_message_check/'+receiver_id, 
			cache:false,
			contentType: false,
			processData: false,
			dataType: 'json',
			success: function(data) 
			{
				var curr_message_count = parseInt(data.curr_message_count);//count the number of messages received
				alert(curr_message_count+' '+prev_message_count);
				//if there is a new message
				if(curr_message_count != prev_message_count)
				{
					vibrate();
					//get prev msg
					var prev_msg = window.localStorage.getItem("message_history"+web_name);
					var new_msg = prev_msg+data.message;
					window.localStorage.setItem("message_history"+web_name, new_msg);
					//alert(data.message);
					window.localStorage.setItem("prev_message_count"+web_name, curr_message_count);
					//display new message
					
					$("ul.single_message").append(data.message);
		
					add_scroller();
					
					//navigator.notification.vibrate([1000, 1000]);
				}
	
			},
			complete: function() 
			{
				setTimeout(message_cheker, 2000);
			}
		});
	})();
});

function vibrate() {alert('here');
	navigator.notification.vibrate(2000);alert('here');
}

function get_messages()
{	
	var service = new EmployeeService();
	service.initialize().done(function () {
		console.log("Service initialized");
	});
	
	service.get_messages(web_name).done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("message_history"+web_name, data.result);
		window.localStorage.setItem("username"+web_name, data.username);
		window.localStorage.setItem("receiver_id"+web_name, data.receiver_id);
		window.localStorage.setItem("prev_message_count"+web_name, data.received_messages);
	});
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function add_scroller()
{
	$('#wrapper3').css('bottom', $( '#send_message' ).height());
	var scroller_height = parseInt($( '#scroller' ).height());
	var document_height = parseInt($( '#wrapper3' ).height());
	var start_height = scroller_height - document_height;
	start_height = start_height * -1;
	
	var myScroll;
	myScroll = new IScroll('#wrapper3', { bounceEasing: 'elastic', bounceTime: 1200, startY: start_height});
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}

function display_messages()
{
	$("#prev_message_count").val(window.localStorage.getItem("receiver_id"+prev_message_count));
	$("#ajax_receiver").val(window.localStorage.getItem("receiver_id"+web_name));
	$(".single_message").html(window.localStorage.getItem("message_history"+web_name)).fadeIn( "slow");
	$("#profile_username").html(window.localStorage.getItem("username"+web_name)).fadeIn( "slow");
	
	add_scroller();
}