/* Function to check for network connectivity */
document.addEventListener("deviceready", onDeviceReady, false);

var background_timeout;
var all_message_timeout;
var single_message_timeout;
var scroll_obj, scroll_obj2;
var myScroll1, myScroll2, myScroll3, myScroll_profiles, myScroll_likes, myScroll_i_like, myScroll_messages;

// PhoneGap is ready
//
function onDeviceReady() 
{
	console.log(FileTransfer);
	cordova.plugins.Keyboard.disableScroll(true);
	//$('#single_message_modal').modal('show');
	
	window.addEventListener('native.keyboardshow', keyboardShowHandler);
	window.addEventListener('native.keyboardhide', keyboardHideHandler);

	//on page load if the user has logged in previously,
	//log them in automatically
	//automatic_login();
	
	//navigator.notification.vibrate([400, 200, 400]);
	//navigator.notification.beep(1);
	
	cordova.plugins.backgroundMode.setDefaults({ title:'Nairobisingles', text:'Nairobisingles', silent: true});
	
	//check if background action is enabled
	var enabled = cordova.plugins.backgroundMode.isEnabled();
	if(enabled === false)
	{
		// Enable background mode
		cordova.plugins.backgroundMode.enable();
	}

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
		
		//clear other timeouts
		//clearTimeout(all_message_timeout);
		//clearTimeout(single_message_timeout);
		
    };
	
	cordova.plugins.backgroundMode.onfailure = function(errorCode) {
		cordova.plugins.backgroundMode.configure({
						text:errorCode
					});		
	};
	
	// Called when background mode has been deactivated
	cordova.plugins.backgroundMode.ondeactivate = function() {
		
		clearTimeout(background_timeout);
		
		//all_message_timeout = setTimeout("check_background_messages()", 5000);
	};
}

$(document).ready(function(){
	//localStorage.clear();
	automatic_login();
});

var Web_server_request = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : base_url;
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.login_client = function(email, password) {
		var request = url + "login/login_client/" + email + "/" + password;
        return $.ajax({url: request});
    }

    this.register_client = function(email, password, username, client_agree) {
		var request = url+"login/register_user";
        return $.ajax({url: request, type:"post", data: {email: email, password: password, username: username, client_agree: client_agree}});
    }

    this.reset_password = function(email) {
		var request = url + "login/forgot_password/" + email;
        return $.ajax({url: request});
    }
	
	this.update_client_image = function(profile_image) {
		
		//upload image
		var request = url+"profile/edit_profile_image";
        return $.ajax({url: request, type: "POST", data: {profile_image: profile_image}});
	};

    this.update_client = function(client_dob1, client_dob2, client_dob3, client_about, gender_id, client_looking_gender_id, age_group_id, encounter_id) {
		var request = url+"profile/edit_profile";
		return $.ajax({url: request, type: "POST", data: {client_dob1: client_dob1, client_dob2: client_dob2, client_dob3: client_dob3, client_about: client_about, gender_id: gender_id, client_looking_gender_id: client_looking_gender_id, age_group_id: age_group_id, encounter_id: encounter_id}});

    }

    this.get_profiles = function() {
		
		//total profiles
		var all_profiles = window.localStorage.getItem("total_profiles");
		
		if(all_profiles == null)
		{
			all_profiles = 0;
		}
		var request = url + "account/get_all_profiles/"+all_profiles;//alert(request);
        return $.ajax({url: request});
    }

    this.get_profiles2 = function(total_profiles) {
		
		//total profiles
		var all_profiles = total_profiles;
		
		var request = url + "account/get_all_profiles/"+all_profiles;//alert(request);
        return $.ajax({url: request});
    }

    this.get_messages_list = function() {
		var request = url + "messages/inbox";
        return $.ajax({url: request});
    }

    this.likes_me = function() {
		var request = url + "account/likes_me";
        return $.ajax({url: request});
    }

    this.i_like = function() {
		var request = url + "account/i_like";
        return $.ajax({url: request});
    }

    this.get_profile_details = function() {
		var request = url+"profile/get_client_details";
        return $.ajax({url: request});
    }

    this.get_messages = function(web_name) {
		var request = url + "messages/view_message/"+web_name;
        return $.ajax({url: request});
    }

    this.like_profile = function(web_name) {
		var request = url + "profile/like_profile/"+web_name;
        return $.ajax({url: request});
    }

    this.send_message = function(message, receiver, web_name) {
		var request = url + "messages/message_profile";
        return $.ajax({url: request, data:{ client_message_details: message, receiver_id: receiver, web_name: web_name }, type: "POST"});
    }
}

//initialize variables
var request_object = new Web_server_request();
request_object.initialize().done(function () {
	console.log("Service initialized");
});

//automatic login
function automatic_login()
{
	//get client's credentials
	var email = window.localStorage.getItem("client_email");
	var password = window.localStorage.getItem("client_password");
	
	var result = request_object.login_client(email, password);
	
	result.done(function (employees) 
	{
		var data = jQuery.parseJSON(employees);
		
		if(data.message == "success")
		{
			//set account balance
			window.localStorage.setItem("account_balance", data.result.account_balance);
			
			//set other pages data
			$("#body_container").removeClass('display_none');
			$("#body_container").addClass('display_block');
			$("#login_container").addClass('display_none');
			
			//change stylesheet
			$('link[href="assets/css/style.css"]').attr('href','assets/css/style_inner.css');
			set_messages_data();
			//redirect to profiles page
			load_profiles();
			load_messages();
			load_likes();
			load_my_account();
			$("#chat-credits").html(data.result.account_balance);
			$("#profile_username").html(window.localStorage.getItem("client_username")).fadeIn("slow");
			
			//add scroller
			//add_scroller_new();
			
			//initate all message timeout
			//all_message_timeout = setTimeout("check_background_messages()", 5000);
			$( "#loader-wrapper" ).addClass( "display_none" );
			
			initialize_app();
		}
		
		else
		{
			$( "#login_form" ).removeClass( "display_none" );
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	});
	result.fail(function (jqXHR, textStatus) 
	{	
		$( "#loader-wrapper" ).addClass( "display_none" );
		$( "#login_form" ).removeClass( "display_none" );
		$("#response").html('<div class="alert alert-danger center-align">Please check your internet connection</div>');
	});
}

function initialize_app()
{	
	//check if user has image
	var image_location = window.localStorage.getItem("profile_image_location");
	
	//if user has no image
	if((image_location == 'https://www.nairobisingles.com/assets/images/profile/') || (image_location == 'https://www.nairobisingles.com/assets/images/profile/0') || (image_location == '') || (image_location == null))
	{
		$('#main_navigation').html('<li role="presentation"><a href="#home" class="home" onClick="update_profile()" aria-controls="home" role="tab" ><i class="glyphicon glyphicon-home"></i></a></li><li role="presentation" id="message_list"><a href="#messages" onClick="update_profile()" class="messages" aria-controls="messages" role="tab" ><span id="message_badge" class="badge" style="color:#ffffff;"></span> <i class="glyphicon glyphicon-envelope"></i></a></li><li role="presentation" class="active" id="account_list"><a href="#my_account" onClick="update_profile()" class="my_account" aria-controls="my_account" role="tab" ><i class="glyphicon glyphicon-user"></i></a></li><li role="presentation"><a href="#likes" onClick="update_profile()" class="likes" aria-controls="likes" role="tab" ><i class="glyphicon glyphicon-heart"></i></a></li>');
		$('#account_message').removeClass('display_none');
		$('#account_profile_message').removeClass('display_none');
		$('#messages').removeClass('in');
		$('#messages').removeClass('active');
		$('#my_account').addClass('in');
		$('#my_account').addClass('active');
	}
	
	else
	{
		$('#main_navigation').html('<li role="presentation"><a href="#home" class="home" aria-controls="home" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-home"></i></a></li><li role="presentation" class="active" id="message_list"><a href="#messages" class="messages" aria-controls="messages" role="tab" data-toggle="tab"><span id="message_badge" class="badge" style="color:#ffffff;"></span> <i class="glyphicon glyphicon-envelope"></i></a></li><li role="presentation" class="" id="account_list"><a href="#my_account" class="my_account" aria-controls="my_account" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-user"></i></a></li><li role="presentation"><a href="#likes" class="likes" aria-controls="likes" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-heart"></i></a></li>');
		$('#my_account').removeClass('in');
		$('#my_account').removeClass('active');
		$('#messages').addClass('in');
		$('#messages').addClass('active');
	}
	
	//set dimensions for modal
	var document_height = parseInt($(document).height());//alert(document_height);
	var modal_footer_height = parseInt($( '#single_message_modal .modal-footer' ).height());
	document_height = document_height * 0.4;
	$('#single_message_modal .modal-body').css('height', document_height);
	
	//set dimensions for wrappers
	var document_height = parseInt($( 'html' ).height());
	var top_navbar_height = parseInt($('.navbar-top').height());
	var navigation_tabs_height = parseInt($('.navigation_tabs').height());
	var tab_height = 0;
	//var tab_height = document_height * 0.25;
	var wrapper_height = document_height - tab_height;
	$('#wrapper').css('height', wrapper_height);
	$('#wrapper2').css('height', wrapper_height);
	
	var tab_height = document_height * 0.35;
	var wrapper_height2 = document_height - tab_height;
	$('#wrapper4').css('height', wrapper_height2);
	$('#wrapper5').css('height', wrapper_height2);
	$('#wrapper6').css('height', wrapper_height2);
	$('#wrapper7').css('height', wrapper_height2);
	
	
	//if user has no image
	if((image_location == 'https://www.nairobisingles.com/assets/images/profile/') || (image_location == 'https://www.nairobisingles.com/assets/images/profile/0') || (image_location == '') || (image_location == null) || (image_location == 'http://placehold.it/300x300&text=NS'))
	{
		setTimeout(function () {
			myScroll3 = new IScroll('#wrapper4', {
				mouseWheel: true,
				scrollbars: true,
			});
		}, 500);
	}
	
	else
	{
		setTimeout(function () {
			myScroll_messages = new IScroll('#wrapper2', {
				mouseWheel: true,
				scrollbars: true,
			});
		}, 500);
	}
	
	(function message_cheker() {
		
		$.ajax({
			url: base_url+'messages/count_unread_messages',
			cache:false,
			contentType: false,
			processData: false,
			dataType: 'json',
			statusCode: {
				302: function() {
					//alert('302');
				}
			},
			success: function(data) 
			{
				var prev_total_messages = parseInt(window.localStorage.getItem("total_messages"));
				var total_received = parseInt(data.total_received);
				
				//check if account balance has changed
				var curr_acc_balance = window.localStorage.getItem("account_balance");
				var retrieved_acc_balance = data.account_balance;
				
				if(curr_acc_balance != retrieved_acc_balance)
				{
					window.localStorage.setItem("account_balance", retrieved_acc_balance);
					$("#chat-credits").html(retrieved_acc_balance);
				}
				
				//alert(prev_total_messages+' '+total_received);
				
				if(total_received > prev_total_messages)
				{
					// Modify the currently displayed notification
					window.localStorage.setItem("total_messages", total_received);
					
					set_messages_data();
					load_messages();
					myScroll_messages.destroy();
					
					setTimeout(function () {
						myScroll_messages = new IScroll('#wrapper2', {
							mouseWheel: true,
							scrollbars: true,
						});
					}, 500);
					//store received messages
					var message_data = data.messages;
					
					//calculate number of messages received
					var difference = total_received - prev_total_messages;
					var count = 0;
					$.each(message_data, function(idx, obj) 
					{
						count++;
						if(count == 1)
						{
							var txt = 'message';
						}
						else
						{
							var txt = 'messages';
						}
						$('#message_badge').html('<span style="font-size:10px; float:right; background-color:red;" class="img-rounded">'+count+'</span>');
						
						cordova.plugins.backgroundMode.configure({title:'New message', text:'You have '+count+' new '+txt, silent: false});
						var message_result = obj.result;//alert(message_result);
						var webname = obj.web_name;
						var sender_web_name = obj.sender_web_name;
						//alert(obj.tagName);
						var current_web_name = $("input[name=web_name]").val();
						
						//check if chat history exists
						var prev_msg = window.localStorage.getItem("message_history"+sender_web_name);
						if(prev_msg == null)
						{
							var new_msg = message_result;
						}
						
						else
						{
							var new_msg = prev_msg+message_result;
						}
						window.localStorage.setItem("message_history"+sender_web_name, new_msg);
						
						//if msg pop up is open
						if(current_web_name == sender_web_name)
						{
							$("#single_message").append(message_result);
							
							var prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+sender_web_name));
							var curr_message_count = prev_message_count + 1;
							add_scroller2(curr_message_count);
							
							//alert
							navigator.notification.beep(1);
						}
						
						else
						{
							navigator.notification.vibrate([400, 200, 400]);
							navigator.notification.beep(1);
						}
					});
				}
				
				else
				{
					
					//cordova.plugins.backgroundMode.configure({title:'New message', text:'new message', silent: true});
					window.localStorage.setItem("total_messages", total_received);
				}
			},
			complete: function() 
			{
				setTimeout(message_cheker, 2000);
			}
		});
	})();
}

//Update account scroll on upload of image
$(document).on("change","input#profile_image",function(e)
{
	myScroll3.destroy();
	setTimeout(function () {
        myScroll3 = new IScroll('#wrapper4', {
            mouseWheel: true,
            scrollbars: true,
        });
    }, 500);
});

//enable scrolling on home tab
$(document).one("click","ul#main_navigation a.home",function(e)
{
	setTimeout(function () {
        myScroll_profiles = new IScroll('#wrapper', {
            mouseWheel: true,
            scrollbars: true,
        });
    }, 500);
});

//enable scrolling on account-profile tab
$(document).one("click","ul#main_navigation a.my_account",function(e)
{
	setTimeout(function () {
        myScroll3 = new IScroll('#wrapper4', {
            mouseWheel: true,
            scrollbars: true,
        });
    }, 500);
});

//enable scrolling on account-subscription tab
$(document).one("click","ul#main_navigation a.subscription_link",function(e)
{
	setTimeout(function () {
        myScroll2 = new IScroll('#wrapper5', {
            mouseWheel: true,
            scrollbars: true,
        });
    }, 500);
});

//enable scrolling on likes-likes me tab
$(document).one("click","ul#main_navigation a.likes",function(e)
{
	setTimeout(function () {
        myScroll_likes = new IScroll('#wrapper6', {
            mouseWheel: true,
            scrollbars: true,
        });
    }, 500);
});

//enable scrolling on likes-i like tab
$(document).one("click","a.i_like_link",function(e)
{
	setTimeout(function () {
        myScroll_i_like = new IScroll('#wrapper7', {
            mouseWheel: true,
            scrollbars: true,
        });
    }, 500);
});

//enable scrolling on likes-i like tab
$(document).on("click","ul#main_navigation a.messages",function(e)
{
	$('#message_badge').html('');
});
//Update client
$(document).on("submit","form#update_client_profile",function(e)
{
	e.preventDefault();
	//close keyboard if open
	cordova.plugins.Keyboard.close();
	myScroll3.destroy();
	$("#account_response").html('');
	
	$("#response").html('');
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	//get the form data
	var client_about = $(this).find('textarea[name="client_about"]').val();
	var client_dob1 = $(this).find("input[name=client_dob1]").val();
	var client_dob2 = $(this).find("input[name=client_dob2]").val();
	var client_dob3 = $(this).find("input[name=client_dob3]").val();
	var gender_id = $(this).find("input[name=gender_id]").val();
	var client_looking_gender_id = $(this).find("input[name=client_looking_gender_id]").val();
	var age_group_id = $(this).find("input[name=client_age_group_id]").val();
	var encounter_id = $(this).find("input[name=encounter_id]").val();
	
	var result = request_object.update_client(client_dob1, client_dob2, client_dob3, client_about, gender_id, client_looking_gender_id, age_group_id, encounter_id);
	
	result.done(function (employees) 
	{
		try {
			var data = jQuery.parseJSON(employees);
			
			if(data.response == "success")
			{
				//set my profile data
				var my_profile_result = request_object.get_profile_details();
				
				my_profile_result.done(function (ret_profile_det) 
				{
					try {
						var data = jQuery.parseJSON(ret_profile_det);
						
						window.localStorage.setItem("client_gender_id", data.gender_id);
						window.localStorage.setItem("client_about", data.client_about);
						window.localStorage.setItem("client_looking_gender_id", data.client_looking_gender_id);
						window.localStorage.setItem("client_age_group_id", data.age_group_id);
						window.localStorage.setItem("client_encounter_id", data.encounter_id);
						window.localStorage.setItem("client_dob1", data.client_dob1);
						window.localStorage.setItem("client_dob2", data.client_dob2);
						window.localStorage.setItem("client_dob3", data.client_dob3);
						
						//redirect to profiles page
						var profiles = window.localStorage.getItem("profiles");
						$("#display_profiles").html(profiles);
						
						var messages = window.localStorage.getItem("messages");
						$("#display_messages").html(messages);
						
						var likes_me = window.localStorage.getItem("likes_me");
						$("#likes_display ul").html(likes_me);
						
						var i_like = window.localStorage.getItem("i_like");
						$("#i_like ul").html(i_like);
						
						$("#client_email").val(window.localStorage.getItem("client_email"));
						$("#client_username").val(window.localStorage.getItem("client_username"));
						$("#client_dob1").val(window.localStorage.getItem("client_dob1"));
						$("#client_dob2").val(window.localStorage.getItem("client_dob2"));
						$("#client_dob3").val(window.localStorage.getItem("client_dob3"));
						$("#client_about").val(window.localStorage.getItem("client_about"));
		
						//set gender
						var gender_id = window.localStorage.getItem("client_gender_id");
						$('#gender_id').val(gender_id);
						if(gender_id === '1') {
							$('#gender_id').val('1');
							$('#my_gender_male').removeClass('notActive');
							$('#my_gender_male').addClass('active');
						}
						else{
							$('#gender_id').val('2');
							$('#my_gender_female').removeClass('notActive');
							$('#my_gender_female').addClass('active');
						}
						
						//set looking gender
						var client_looking_gender_id = window.localStorage.getItem("client_looking_gender_id");
						$('#client_looking_gender_id').val(client_looking_gender_id);
						if(client_looking_gender_id === '1') {
							$('#client_looking_gender_id').val('1');
							$('#looking_gender_male').removeClass('notActive');
							$('#looking_gender_male').addClass('active');
						}
						else{
							$('#client_looking_gender_id').val('2');
							$('#looking_gender_female').removeClass('notActive');
							$('#looking_gender_female').addClass('active');
						}
						
						//set age group
						var client_age_group_id = window.localStorage.getItem("client_age_group_id");
						$('#client_age_group_id').val(client_age_group_id);
						if(client_age_group_id === '1') {
							$('#client_age_group_id').val('1');
							$('#group1').removeClass('notActive');
							$('#group1').addClass('active');
						}
						else if(client_age_group_id === '2') {
							$('#client_age_group_id').val('2');
							$('#group2').removeClass('notActive');
							$('#group2').addClass('active');
						}
						else if(client_age_group_id === '3') {
							$('#client_age_group_id').val('3');
							$('#group3').removeClass('notActive');
							$('#group3').addClass('active');
						}
						else if(client_age_group_id === '4') {
							$('#client_age_group_id').val('4');
							$('#group4').removeClass('notActive');
							$('#group4').addClass('active');
						}
						else{
							$('#client_age_group_id').val('5');
							$('#group5').removeClass('notActive');
							$('#group5').addClass('active');
						}
						
						//set encounter
						var client_encounter_id = window.localStorage.getItem("client_encounter_id");
						$('#encounter_id').val(client_encounter_id);
						if(client_encounter_id === '1') {
							$('#encounter_id').val('1');
							$('#encounter1').removeClass('notActive');
							$('#encounter1').addClass('active');
						}
						else if(client_encounter_id === '2') {
							$('#encounter_id').val('2');
							$('#encounter2').removeClass('notActive');
							$('#encounter2').addClass('active');
						}
						else{
							$('#encounter_id').val('3');
							$('#encounter3').removeClass('notActive');
							$('#encounter3').addClass('active');
						}
						
						$("#profile_username").html(window.localStorage.getItem("client_username")).fadeIn("slow");
						$('#account_profile_message').removeClass('display_none');
						$('#account_profile_message').addClass('display_none');
						
						$('#main_navigation').html('<li role="presentation"><a href="#home" class="home" aria-controls="home" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-home"></i></a></li><li role="presentation" id="message_list"><a href="#messages" class="messages" aria-controls="messages" role="tab" data-toggle="tab"><div id="message_badge" style="color:#a94442;"></div> <i class="glyphicon glyphicon-envelope"></i></a></li><li role="presentation" class="active" id="account_list"><a href="#my_account" class="my_account" aria-controls="my_account" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-user"></i></a></li><li role="presentation"><a href="#likes" class="likes" aria-controls="likes" role="tab" data-toggle="tab"><i class="glyphicon glyphicon-heart"></i></a></li>');
						
						setTimeout(function () {
							myScroll3 = new IScroll('#wrapper4', {
								mouseWheel: true,
								scrollbars: true,
							});
						}, 500);
						$( "#loader-wrapper" ).addClass( "display_none" );
						alert('Your profile has been updated successfully');
					}
					catch(err) {
						$("#account_response").append('<div class="alert alert-danger center-align">Unable to retrieve my account details. Please sign in again</div>');
						setTimeout(function () {
							myScroll3 = new IScroll('#wrapper4', {
								mouseWheel: true,
								scrollbars: true,
							});
						}, 500);
						$( "#loader-wrapper" ).addClass( "display_none" );
					}
				});
	
				my_profile_result.fail(function (jqXHR, textStatus) 
				{
					$("#account_response").html('<div class="alert alert-danger center-align">Please check your internet connection</div>');
						setTimeout(function () {
							myScroll3 = new IScroll('#wrapper4', {
								mouseWheel: true,
								scrollbars: true,
							});
						}, 500);
					$( "#loader-wrapper" ).addClass( "display_none" );
				});
			}
			else
			{
				$("#account_response").html('<div class="alert alert-danger center-align">'+data.message+'</div>');
				setTimeout(function () {
					myScroll3 = new IScroll('#wrapper4', {
						mouseWheel: true,
						scrollbars: true,
					});
				}, 500);
				$( "#loader-wrapper" ).addClass( "display_none" );
			}
		}
		
		catch (err)
		{alert(err.message);
			$("#account_response").append('<div class="alert alert-danger center-align">Unable to update. Please try again</div>');
			myScroll3.destroy();
			setTimeout(function () {
				myScroll3 = new IScroll('#wrapper4', {
					mouseWheel: true,
					scrollbars: true,
				});
			}, 500);
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	});
	result.fail(function (jqXHR, textStatus) 
	{
		$("#account_response").append('<div class="alert alert-danger center-align">Please check your internet connection before you continue</div>');
			myScroll3.destroy();
		setTimeout(function () {
			myScroll3 = new IScroll('#wrapper4', {
				mouseWheel: true,
				scrollbars: true,
			});
		}, 500);
		$( "#loader-wrapper" ).addClass( "display_none" );
	});

	return false;
});

//Sign up client
$(document).on("submit","form#signup-client",function(e)
{
	e.preventDefault();
	$("#response").html('');
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	//validate form
	if($('input[name=client_agree]').prop('checked'))
	{
		//get form values
		var email = $("input[name=register_client_email]").val();
		var password = $("input[name=register_client_password]").val();
		var username = $("input[name=register_client_username]").val();
		var client_agree = $("input[name=client_agree]").val();
		
		var result = request_object.register_client(email, password ,username, client_agree);
		
		result.done(function (register_response) 
		{	
			try {
				var register_data = jQuery.parseJSON(register_response);
				
				if(register_data.message == "success")
				{
					//set local variables for future auto login
					window.localStorage.setItem("client_email", email);
					window.localStorage.setItem("client_password", password);
					window.localStorage.setItem("client_username", username);
					
					//set account balance
					window.localStorage.setItem("account_balance", register_data.account_balance);
					var result_login = request_object.login_client(email, password);
	
					result_login.done(function (employees) 
					{
						var data = jQuery.parseJSON(employees);
						
						if(data.message == "success")
						{
							$('#register_modal').modal('hide');
										
							$("#body_container").removeClass('display_none');
							$("#body_container").addClass('display_block');
							$("#login_container").addClass('display_none');
							
							//change stylesheet
							$('link[href="assets/css/style.css"]').attr('href','assets/css/style_inner.css');
							
							$("#chat-credits").html(register_data.account_balance);
							
							//set gender
							var gender_id = window.localStorage.getItem("client_gender_id");
							$('#gender_id').val(gender_id);
							if(gender_id === '1') {
								$('#gender_id').val('1');
								$('#my_gender_male').removeClass('notActive');
								$('#my_gender_male').addClass('active');
							}
							else{
								$('#gender_id').val('2');
								$('#my_gender_female').removeClass('notActive');
								$('#my_gender_female').addClass('active');
							}
							
							//set looking gender
							var client_looking_gender_id = window.localStorage.getItem("client_looking_gender_id");
							$('#client_looking_gender_id').val(client_looking_gender_id);
							if(client_looking_gender_id === '1') {
								$('#client_looking_gender_id').val('1');
								$('#looking_gender_male').removeClass('notActive');
								$('#looking_gender_male').addClass('active');
							}
							else{
								$('#client_looking_gender_id').val('2');
								$('#looking_gender_female').removeClass('notActive');
								$('#looking_gender_female').addClass('active');
							}
							
							//set age group
							var client_age_group_id = window.localStorage.getItem("client_age_group_id");
							$('#client_age_group_id').val(client_age_group_id);
							if(client_age_group_id === '1') {
								$('#client_age_group_id').val('1');
								$('#group1').removeClass('notActive');
								$('#group1').addClass('active');
							}
							else if(client_age_group_id === '2') {
								$('#client_age_group_id').val('2');
								$('#group2').removeClass('notActive');
								$('#group2').addClass('active');
							}
							else if(client_age_group_id === '3') {
								$('#client_age_group_id').val('3');
								$('#group3').removeClass('notActive');
								$('#group3').addClass('active');
							}
							else if(client_age_group_id === '4') {
								$('#client_age_group_id').val('4');
								$('#group4').removeClass('notActive');
								$('#group4').addClass('active');
							}
							else{
								$('#client_age_group_id').val('5');
								$('#group5').removeClass('notActive');
								$('#group5').addClass('active');
							}
							
							//set encounter
							var client_encounter_id = window.localStorage.getItem("client_encounter_id");
							$('#encounter_id').val(client_encounter_id);
							if(client_encounter_id === '1') {
								$('#encounter_id').val('1');
								$('#encounter1').removeClass('notActive');
								$('#encounter1').addClass('active');
							}
							else if(client_encounter_id === '2') {
								$('#encounter_id').val('2');
								$('#encounter2').removeClass('notActive');
								$('#encounter2').addClass('active');
							}
							else{
								$('#encounter_id').val('3');
								$('#encounter3').removeClass('notActive');
								$('#encounter3').addClass('active');
							}
							
							$("#profile_username").html(window.localStorage.getItem("client_username")).fadeIn("slow");
							$( "#loader-wrapper" ).addClass( "display_none" );
							initialize_app();
						}
						
						else
						{
							$('#register_modal').modal('hide');
							$("#response").html('<div class="alert alert-danger center-align">Unable to log in. Please login in here</div>');
							$( "#loader-wrapper" ).addClass( "display_none" );
						}
					});
					result_login.fail(function (jqXHR, textStatus) 
					{	
						$('#register_modal').modal('hide');
						$("#response").html('<div class="alert alert-danger center-align">Unable to log in. Please login in here</div>');
						$( "#loader-wrapper" ).addClass( "display_none" );
					});
				}
				
				else
				{
					$("#register_response").html('<div class="alert alert-danger center-align">'+register_data.result+'</div>');
					$( "#loader-wrapper" ).addClass( "display_none" );
				}
			}
			catch(err) {
				console.log(err.message);
				$( "#loader-wrapper" ).addClass( "display_none" );
				$("#register_response").html('<div class="alert alert-danger center-align">Unable to sign in. Please try again</div>');
			}
		});
		result.fail(function (jqXHR, textStatus) 
		{
			$( "#loader-wrapper" ).addClass( "display_none" );
			$("#register_response").html('<div class="alert alert-danger center-align">Please check your internet connection</div>');
		});
	}
	
	//checkbox not checked
	else
	{
		$( "#loader-wrapper" ).addClass( "display_none" );
		$("#register_response").html('<div class="alert alert-danger center-align">You need to agree to the terms and conditions</div>');
	}
	return false;
});

//Forgot password
$(document).on("submit","form#forgot-password",function(e)
{
	e.preventDefault();
	$("#response").html('');
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	//get form values
	var email = $("input[name=client_reset_email]").val();
	var result = request_object.reset_password(email);
		
	result.done(function (ret_login) {
		
		try {
			var data = jQuery.parseJSON(ret_login);
			
			if(data.result == "success")
			{
				$('#forgot_password_modal').modal('hide');
				$("#response").html('<div class="alert alert-success center-align">'+data.message+'</div>');
				$( "#loader-wrapper" ).addClass( "display_none" );
			}
			
			else
			{
				$( "#loader-wrapper" ).addClass( "display_none" );
				$("#reset_response").html('<div class="alert alert-danger center-align">'+data.message+'</div>');
			}
		}
		catch(err) {
			console.log(err.message);
			$( "#loader-wrapper" ).addClass( "display_none" );
			$("#reset_response").append('<div class="alert alert-danger center-align">Unable to sign in. Please try again</div>');
		}
	});
				
	result.fail(function (jqXHR, textStatus) 
	{
		$( "#loader-wrapper" ).addClass( "display_none" );
		$("#reset_response").append('<div class="alert alert-danger center-align">Please check your internet connection and try again</div>');
	});
});


//Login client
$(document).on("submit","form#signin-client",function(e)
{
	e.preventDefault();
	$("#response").html('');
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	//check if there is a network connection
	var connection = true;//is_connected();
	
	if(connection === true)
	{
		//get form values
		var email = $("input[name=client_email]").val();
		var password = $("input[name=client_password]").val();
		
		var result = request_object.login_client(email, password);
		
		result.done(function (ret_login) {
			try{
				var data_login = jQuery.parseJSON(ret_login);
				
				if(data_login.message == "success")
				{
					//set account balance
					window.localStorage.setItem("account_balance", data_login.result.account_balance);
					
					//set profiles data
					var profiles_result = request_object.get_profiles();
					
					profiles_result.done(function (ret_profiles) 
					{
						try {
							var data_profiles = jQuery.parseJSON(ret_profiles);
							
							window.localStorage.setItem("profiles", data_profiles.result);
							window.localStorage.setItem("total_profiles", data_profiles.total);
						}
						catch(err) {
							console.log(err.message);
							$("#response").html('<div class="alert alert-danger center-align">Unable to retrieve profiles</div>');
						}
					});
					profiles_result.fail(function (jqXHR, textStatus) 
					{
						alert('Please check your internet connection before you continue');
					});
					profiles_result.always(function () 
					{
						//set messages data
						var messages_result = request_object.get_messages_list();
						
						messages_result.done(function (ret_messages) 
						{
							try {
								var data_messages = jQuery.parseJSON(ret_messages);
								
								window.localStorage.setItem("messages", data_messages.result);
								window.localStorage.setItem("total_messages", data_messages.total);
							}
							catch(err) {
								console.log(err.message);
								$("#response").append('<div class="alert alert-danger center-align">Unable to retrieve messages</div>');
							}
						});
						
						messages_result.fail(function (jqXHR, textStatus) 
						{
							//alert('Please check your internet connection');
						});
						messages_result.always(function () 
						{
							//set likes me data
							var likes_me_result = request_object.likes_me(); 
							
							likes_me_result.done(function (ret_likes_me) 
							{
								try {
									var data_likes_me = jQuery.parseJSON(ret_likes_me);
									
									window.localStorage.setItem("likes_me", data_likes_me.result);
									window.localStorage.setItem("total_likes_me", data_likes_me.total);
								}
								catch(err) {
									console.log(err.message);
									$("#response").append('<div class="alert alert-danger center-align">Unable to retrieve likes</div>');
								}
							});
						
							likes_me_result.fail(function (jqXHR, textStatus) 
							{
								//alert('Please check your internet connection');
							});
							
							likes_me_result.always(function () 
							{
								//set i like data
								var i_like_result = request_object.i_like();
								
								i_like_result.done(function (ret_i_like) 
								{
									try {
										var data_i_like = jQuery.parseJSON(ret_i_like);
										
										window.localStorage.setItem("i_like", data_i_like.result);
										window.localStorage.setItem("total_i_like", data_i_like.total);
									}
									catch(err) {
										console.log(err.message);
										$("#response").append('<div class="alert alert-danger center-align">Unable to retrieve profiles I like</div>');
									}
								});
						
								i_like_result.fail(function (jqXHR, textStatus) 
								{
									//alert('Please check your internet connection');
								});
								
								i_like_result.always(function () 
								{
									//set my profile data
									var my_profile_result = request_object.get_profile_details();
									
									my_profile_result.done(function (ret_profile_det) 
									{
										try {
											var data = jQuery.parseJSON(ret_profile_det);
											
											window.localStorage.setItem("profile_image_location", data.profile_image_location);
											window.localStorage.setItem("client_gender_id", data.gender_id);
											window.localStorage.setItem("client_about", data.client_about);
											window.localStorage.setItem("client_looking_gender_id", data.client_looking_gender_id);
											window.localStorage.setItem("client_age_group_id", data.age_group_id);
											window.localStorage.setItem("client_encounter_id", data.encounter_id);
											window.localStorage.setItem("client_dob1", data.client_dob1);
											window.localStorage.setItem("client_dob2", data.client_dob2);
											window.localStorage.setItem("client_dob3", data.client_dob3);
											
											$("#body_container").removeClass('display_none');
											$("#body_container").addClass('display_block');
											$("#login_container").addClass('display_none');
											
											//change stylesheet
											$('link[href="assets/css/style.css"]').attr('href','assets/css/style_inner.css');
										
											//set local variables for future auto login
											window.localStorage.setItem("client_email", email);
											window.localStorage.setItem("client_password", password);
											window.localStorage.setItem("client_username", data_login.result.client_username);
											
											$("#chat-credits").html(data_login.result.account_balance);
											
											var profiles = window.localStorage.getItem("profiles");
											$("#display_profiles").html(profiles);
											
											var messages = window.localStorage.getItem("messages");
											$("#display_messages").html(messages);
											
											var likes_me = window.localStorage.getItem("likes_me");
											$("#likes_display ul").html(likes_me);
											
											var i_like = window.localStorage.getItem("i_like");
											$("#i_like ul").html(i_like);
											
											$("#client_email").val(window.localStorage.getItem("client_email"));
											$("#client_username").val(window.localStorage.getItem("client_username"));
											$("#client_dob1").val(window.localStorage.getItem("client_dob1"));
											$("#client_dob2").val(window.localStorage.getItem("client_dob2"));
											$("#client_dob3").val(window.localStorage.getItem("client_dob3"));
											$("#client_about").val(window.localStorage.getItem("client_about"));
											$("#profile_image").html('<img src="'+window.localStorage.getItem("profile_image_location")+'" class="img-responsive">');
											
											//set gender
											var gender_id = window.localStorage.getItem("client_gender_id");
											$('#gender_id').val(gender_id);
											if(gender_id === '1') {
												$('#gender_id').val('1');
												$('#my_gender_male').removeClass('notActive');
												$('#my_gender_male').addClass('active');
											}
											else{
												$('#gender_id').val('2');
												$('#my_gender_female').removeClass('notActive');
												$('#my_gender_female').addClass('active');
											}
											
											//set looking gender
											var client_looking_gender_id = window.localStorage.getItem("client_looking_gender_id");
											$('#client_looking_gender_id').val(client_looking_gender_id);
											if(client_looking_gender_id === '1') {
												$('#client_looking_gender_id').val('1');
												$('#looking_gender_male').removeClass('notActive');
												$('#looking_gender_male').addClass('active');
											}
											else{
												$('#client_looking_gender_id').val('2');
												$('#looking_gender_female').removeClass('notActive');
												$('#looking_gender_female').addClass('active');
											}
											
											//set age group
											var client_age_group_id = window.localStorage.getItem("client_age_group_id");
											$('#client_age_group_id').val(client_age_group_id);
											if(client_age_group_id === '1') {
												$('#client_age_group_id').val('1');
												$('#group1').removeClass('notActive');
												$('#group1').addClass('active');
											}
											else if(client_age_group_id === '2') {
												$('#client_age_group_id').val('2');
												$('#group2').removeClass('notActive');
												$('#group2').addClass('active');
											}
											else if(client_age_group_id === '3') {
												$('#client_age_group_id').val('3');
												$('#group3').removeClass('notActive');
												$('#group3').addClass('active');
											}
											else if(client_age_group_id === '4') {
												$('#client_age_group_id').val('4');
												$('#group4').removeClass('notActive');
												$('#group4').addClass('active');
											}
											else{
												$('#client_age_group_id').val('5');
												$('#group5').removeClass('notActive');
												$('#group5').addClass('active');
											}
											
											//set encounter
											var client_encounter_id = window.localStorage.getItem("client_encounter_id");
											$('#encounter_id').val(client_encounter_id);
											if(client_encounter_id === '1') {
												$('#encounter_id').val('1');
												$('#encounter1').removeClass('notActive');
												$('#encounter1').addClass('active');
											}
											else if(client_encounter_id === '2') {
												$('#encounter_id').val('2');
												$('#encounter2').removeClass('notActive');
												$('#encounter2').addClass('active');
											}
											else{
												$('#encounter_id').val('3');
												$('#encounter3').removeClass('notActive');
												$('#encounter3').addClass('active');
											}
											
											$("#profile_username").html(window.localStorage.getItem("client_username")).fadeIn("slow");
											$( "#loader-wrapper" ).addClass( "display_none" );
											initialize_app();
										}
										catch(err) {
											console.log(err.message);
											$("#response").append('<div class="alert alert-danger center-align">Unable to retrieve my account details. Please sign in again</div>');
											$( "#loader-wrapper" ).addClass( "display_none" );
										}
									});
						
									my_profile_result.fail(function (jqXHR, textStatus) 
									{
										$( "#loader-wrapper" ).addClass( "display_none" );
										$("#response").html('<div class="alert alert-danger center-align">Please check your internet connection</div>');
									});
								});
							});
						});
					});
				}
				else
				{
					$( "#loader-wrapper" ).addClass( "display_none" );
					$("#response").html('<div class="alert alert-danger center-align">'+data_login.result+'</div>');
				}
			}
			catch(err) {
				console.log(err.message);
				$("#response").append('<div class="alert alert-danger center-align">Unable to sign in. Please try again</div>');
			}
        });
		result.fail(function (jqXHR, textStatus) {
			$( "#loader-wrapper" ).addClass( "display_none" );
			$("#response").html('<div class="alert alert-danger center-align">Please check your internet connection</div>');
		});
	}
	
	else
	{
		$("#response").html('<div class="alert alert-danger center-align">'+"No internet connection - please check your internet connection then try again"+'</div>');
		$( "#loader-wrapper" ).addClass( "display_none" );
	}
	return false;
});

//Send message
$(document).on("submit","form#send-message",function(e)
{
	e.preventDefault();
	var account_balance = parseInt(window.localStorage.getItem("account_balance"));
	
	if(account_balance > 0)
	{
		var message = $("input[name=client_message_details]").val();
		var receiver = $("input[name=receiver_id]").val();
		var web_name = $("input[name=web_name]").val();
		
		var send = request_object.send_message(message, receiver, web_name);
		
		send.done(function (employees) {
			var data = jQuery.parseJSON(employees);
			
			if(data == "false")
			{
				$("ul.single_message").append('<li class="clear-both">Unable to send message. Please try again</li>');
			}
			else
			{
				//set account balance
				window.localStorage.setItem("account_balance", data.account_balance);
				$("#chat-credits").html(data.account_balance);
				
				var prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+web_name));
				var curr_message_count = prev_message_count + 1;
				window.localStorage.setItem("prev_message_count"+web_name, curr_message_count);
				
				//get prev msg
				var prev_msg = window.localStorage.getItem("message_history"+web_name);
				var new_msg = prev_msg+data.message;
				window.localStorage.setItem("message_history"+web_name, new_msg);
				
				$("ul.single_message").append(data.message);
				$("input[name=client_message_details]").val('');
				
				add_scroller2(curr_message_count);
			}
		});
		send.fail(function () {
			alert('Please check your internet connection then try again.');
		});
	}
	
	else
	{
		navigator.notification.alert(
			'Please top up your chatcredits before you continue',  // message
			top_up,         // callback
			'Unable to send message',            // title
			'Top up'                  // buttonName
		);
	}
		
	return false;
});

function top_up()
{
	window.open('http://www.nairobisingles.com/sign-in', '_system');
}

/**********************
*	Set page data
***********************/

function set_profiles_data()
{
	request_object.get_profiles().done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("profiles", data.result);
		window.localStorage.setItem("total_profiles", data.total);
	});
}

function set_messages_data()
{
	request_object.get_messages_list().done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("messages", data.result);
		window.localStorage.setItem("total_messages", data.total);
	});
}

function set_i_like_data()
{
	request_object.i_like().done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("i_like", data.result);
		window.localStorage.setItem("total_i_like", data.total);
	});
}

function set_likes_me_data()
{
	request_object.likes_me().done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("likes_me", data.result);
		window.localStorage.setItem("total_likes_me", data.total);
	});
}

function set_my_profile_data()
{
	request_object.get_profile_details().done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("profile_image_location", data.profile_image_location);
		window.localStorage.setItem("client_gender_id", data.gender_id);
		window.localStorage.setItem("client_about", data.client_about);
		window.localStorage.setItem("client_looking_gender_id", data.client_looking_gender_id);
		window.localStorage.setItem("client_age_group_id", data.age_group_id);
		window.localStorage.setItem("client_encounter_id", data.encounter_id);
		window.localStorage.setItem("client_dob1", data.client_dob1);
		window.localStorage.setItem("client_dob2", data.client_dob2);
		window.localStorage.setItem("client_dob3", data.client_dob3);
	});
}

function get_messages(web_name)
{	
	request_object.get_messages(web_name).done(function (employees) {
		
		var data = jQuery.parseJSON(employees);
		
		window.localStorage.setItem("message_history"+web_name, data.result);
		window.localStorage.setItem("username"+web_name, data.username);
		window.localStorage.setItem("receiver_id"+web_name, data.receiver_id);
		window.localStorage.setItem("prev_message_count"+web_name, data.received_messages);
	});
}

/**********************
*	Load pages
***********************/

function load_profiles()
{
	var profiles = window.localStorage.getItem("profiles");
	$("#display_profiles").html(profiles);
}

function load_messages()
{
	var messages = window.localStorage.getItem("messages");
	$("#display_messages").html(messages);
}

function load_likes()
{
	var likes_me = window.localStorage.getItem("likes_me");
	$("#likes_display ul").html(likes_me);
	
	var i_like = window.localStorage.getItem("i_like");
	$("#i_like ul").html(i_like);
}

function load_my_account()
{
	$("#client_email").val(window.localStorage.getItem("client_email"));
	$("#client_username").val(window.localStorage.getItem("client_username"));
	$("#client_dob1").val(window.localStorage.getItem("client_dob1"));
	$("#client_dob2").val(window.localStorage.getItem("client_dob2"));
	$("#client_dob3").val(window.localStorage.getItem("client_dob3"));
	$("#client_about").val(window.localStorage.getItem("client_about"));
	$("#profile_image").html('<img src="'+window.localStorage.getItem("profile_image_location")+'" class="img-responsive">');
	
	//set gender
	var gender_id = window.localStorage.getItem("client_gender_id");
	$('#gender_id').val(gender_id);
	if(gender_id === '1') {
		$('#gender_id').val('1');
		$('#my_gender_male').removeClass('notActive');
		$('#my_gender_male').addClass('active');
	}
	else{
		$('#gender_id').val('2');
		$('#my_gender_female').removeClass('notActive');
		$('#my_gender_female').addClass('active');
	}
	
	//set looking gender
	var client_looking_gender_id = window.localStorage.getItem("client_looking_gender_id");
	$('#client_looking_gender_id').val(client_looking_gender_id);
	if(client_looking_gender_id === '1') {
		$('#client_looking_gender_id').val('1');
		$('#looking_gender_male').removeClass('notActive');
		$('#looking_gender_male').addClass('active');
	}
	else{
		$('#client_looking_gender_id').val('2');
		$('#looking_gender_female').removeClass('notActive');
		$('#looking_gender_female').addClass('active');
	}
	
	//set age group
	var client_age_group_id = window.localStorage.getItem("client_age_group_id");
	$('#client_age_group_id').val(client_age_group_id);
	if(client_age_group_id === '1') {
		$('#client_age_group_id').val('1');
		$('#group1').removeClass('notActive');
		$('#group1').addClass('active');
	}
	else if(client_age_group_id === '2') {
		$('#client_age_group_id').val('2');
		$('#group2').removeClass('notActive');
		$('#group2').addClass('active');
	}
	else if(client_age_group_id === '3') {
		$('#client_age_group_id').val('3');
		$('#group3').removeClass('notActive');
		$('#group3').addClass('active');
	}
	else if(client_age_group_id === '4') {
		$('#client_age_group_id').val('4');
		$('#group4').removeClass('notActive');
		$('#group4').addClass('active');
	}
	else{
		$('#client_age_group_id').val('5');
		$('#group5').removeClass('notActive');
		$('#group5').addClass('active');
	}
	
	//set encounter
	var client_encounter_id = window.localStorage.getItem("client_encounter_id");
	$('#encounter_id').val(client_encounter_id);
	if(client_encounter_id === '1') {
		$('#encounter_id').val('1');
		$('#encounter1').removeClass('notActive');
		$('#encounter1').addClass('active');
	}
	else if(client_encounter_id === '2') {
		$('#encounter_id').val('2');
		$('#encounter2').removeClass('notActive');
		$('#encounter2').addClass('active');
	}
	else{
		$('#encounter_id').val('3');
		$('#encounter3').removeClass('notActive');
		$('#encounter3').addClass('active');
	}
}
$(document).on("click","#messages_button",function(){
	
	$(".single_message").html('');
	$('#web_name').val('');
  	//clearTimeout(single_message_timeout);
});

function load_single_message(web_name)
{
	$('#web_name').val('');
	$(".single_message").html('');
	$('#web_name').val(web_name);
		
	//check for previously retrieved messages
	var prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+web_name));
	//alert(prev_message_count);get_messages(web_name);
	if(isNaN(prev_message_count))
	{
		//get received messages
		var request = request_object.get_messages(web_name);
		
		request.done(function (employees) {
		
			var data = jQuery.parseJSON(employees);
			
			window.localStorage.setItem("message_history"+web_name, data.result);
			window.localStorage.setItem("username"+web_name, data.username);
			window.localStorage.setItem("receiver_id"+web_name, data.receiver_id);
			window.localStorage.setItem("prev_message_count"+web_name, data.received_messages);
			
			prev_message_count = parseInt(window.localStorage.getItem("prev_message_count"+web_name));
			$("#prev_message_count").val(prev_message_count);
			$("#ajax_receiver").val(window.localStorage.getItem("receiver_id"+web_name));
			$(".single_message").html(window.localStorage.getItem("message_history"+web_name));
			$('#message_receiver').html(web_name);
			
			add_scroller(prev_message_count);
		});
		
		request.fail(function ()
		{
			alert('Please check your internet connection and try again');
		});
	}
	
	else
	{
		display_messages(web_name);
		add_scroller(prev_message_count);
	}
}

function like_profile(web_name)
{
	var account_balance = parseInt(window.localStorage.getItem("account_balance"));
	
	if(account_balance > 0)
	{
		$( "#loader-wrapper" ).removeClass( "display_none" );
		var request = request_object.like_profile(web_name);
		
		request.done(function (employees) 
		{
			try
			{
				var data = jQuery.parseJSON(employees);
				
				if(data.response == 'success')
				{
					//set account balance
					window.localStorage.setItem("account_balance", data.account_balance);
					$("#chat-credits").html(data.account_balance);
					
					var result = request_object.i_like();
					
					result.done(function (like) 
					{
						try
						{
							var data_like = jQuery.parseJSON(like);
							
							window.localStorage.setItem("i_like", data_like.result);
							window.localStorage.setItem("total_i_like", data_like.total);
							$( "#loader-wrapper" ).addClass( "display_none" );
							
							$("#i_like ul").html(data_like.result);
							
							myScroll_i_like.destroy();
							setTimeout(function () {
								myScroll_i_like = new IScroll('#wrapper7', {
									mouseWheel: true,
									scrollbars: true,
								});
							}, 500);
						}
						
						catch(err)
						{
							$( "#loader-wrapper" ).addClass( "display_none" );
						}
						alert(data.message);
					});
					
					result.fail(function(jqXHR, textStatus) 
					{
						//alert('Unable to likes');
						$( "#loader-wrapper" ).addClass( "display_none" );
					});
				}
				
				else
				{
					alert(data.message);
				}
			}
			
			catch(err)
			{
				alert('Unable to like profile');
				$( "#loader-wrapper" ).addClass( "display_none" );
			}
		});
		
		request.fail(function ()
		{
			alert('Please check your internet connection and try again');
			$( "#loader-wrapper" ).addClass( "display_none" );
		});
	}
	
	else
	{
		navigator.notification.alert(
			'Please top up your chatcredits before you continue',  // message
			top_up,         // callback
			'Unable to like profile',            // title
			'Top up'                  // buttonName
		);
	}
}

/**********************
*	Common page functions
***********************/

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function add_scroller(prev_message_count)
{
	//calculate iscroll start height
	var scroller_height = prev_message_count * 80;
	//var scroller_height = parseInt($( '#single_message' ).height());alert(scroller_height);
	var document_height = parseInt($( '#wrapper3' ).height());
	
	if(document_height < scroller_height)
	{
		var start_height = scroller_height - document_height;
		start_height = start_height * -1;
	}
	
	else
	{
		var start_height = 0;
	}
	
	//myScroll.destroy();
	
    setTimeout(function () {
        myScroll = new IScroll('#wrapper3', {
            mouseWheel: true,
            scrollbars: true,
			startY: start_height
        });
    }, 500);
}

function add_scroller2(prev_message_count)
{
	//calculate iscroll start height
	var document_height = parseInt($( '#wrapper3' ).height());
	var single_msg_height = document_height / 6;
	//var scroller_height = prev_message_count * 86;
	var scroller_height = prev_message_count * single_msg_height;
	
	if(document_height < scroller_height)
	{
		var start_height = scroller_height - document_height;
		start_height = start_height * -1;
	}
	
	else
	{
		var start_height = 0;
	}
	myScroll.destroy();
	
    setTimeout(function () {
        myScroll = new IScroll('#wrapper3', {
            mouseWheel: true,
            scrollbars: true,
			startY: start_height
        });
    }, 500);
}

function add_scroller_new()
{
	var myScroll;
	myScroll = new IScroll('#wrapper', { bounceEasing: 'elastic', bounceTime: 1200 });
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}

function display_messages(web_name)
{
	$("#prev_message_count").val(window.localStorage.getItem("receiver_id"+prev_message_count));
	$("#ajax_receiver").val(window.localStorage.getItem("receiver_id"+web_name));
	$(".single_message").html(window.localStorage.getItem("message_history"+web_name));
	$('#web_name').val(web_name);
	$('#message_receiver').html(web_name);
}

function check_all_messages()
{
	//window.clearTimeout(all_message_timeout);
	
	$.ajax({
			url: base_url+'messages/count_unread_messages',
			cache:false,
			contentType: false,
			processData: false,
			dataType: 'json',
			statusCode: {
				302: function() {
					alert('302');
				}
			},
			success: function(data) 
			{
				var prev_total_messages = parseInt(window.localStorage.getItem("total_messages"));
				var total_received = parseInt(data.total_received);
				
				//alert(prev_total_messages+' '+total_received);
				if(total_received > prev_total_messages)
				{
					// Modify the currently displayed notification
					window.localStorage.setItem("total_messages", total_received);
					$('#message_badge').html('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>');
					navigator.notification.vibrate([400, 200, 400]);
					navigator.notification.beep(1);
				}
			},
			error: function(xml, response, error) 
			{
				alert(error);
			}
		});
}

function check_background_messages()
{
	$.ajax({
		url: base_url+'messages/count_unread_messages',
		cache:false,
		contentType: false,
		processData: false,
		dataType: 'json',
		success: function(data) 
		{
			var prev_total_messages = parseInt(window.localStorage.getItem("total_messages"));
			var total_received = parseInt(data.total_received);
			
			if(total_received > prev_total_messages)
			{
				// Modify the currently displayed notification
				window.localStorage.setItem("total_messages", total_received);
				cordova.plugins.backgroundMode.configure({title:'New message', text:'New message', silent: false});
				navigator.notification.vibrate([400, 200, 400]);
				navigator.notification.beep(1);
			}
		}
	});
}

function check_single_messages(web_name)
{
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
			//alert(curr_message_count+' '+prev_message_count);
			//if there is a new message
			if(curr_message_count != prev_message_count)
			{
				//get prev msg
				var prev_msg = window.localStorage.getItem("message_history"+web_name);
				var new_msg = prev_msg+data.message;
				window.localStorage.setItem("message_history"+web_name, new_msg);
				//alert(data.message);
				window.localStorage.setItem("prev_message_count"+web_name, curr_message_count);
				//display new message
				
				$("ul.single_message").append(data.message);
	
				add_scroller(curr_message_count);
				
				//navigator.notification.vibrate([400, 200, 400]);
				navigator.notification.beep(1);
			}
		}
	});
}

$(document).on("click","#radioBtn a",function()
{
    var sel = $(this).data('title');
    var tog = $(this).data('toggle');
    $('#'+tog).prop('value', sel);
    
    $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('active').addClass('notActive');
    $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('active');
})

function keyboardShowHandler(e){
	//alert('Keyboard height is: ' + e.keyboardHeight);
	
	//set dimensions for modal
	var document_height = parseInt($( 'html' ).height());
	var modal_footer_height = parseInt($( '#single_message_modal .modal-footer' ).height());
	document_height = document_height + modal_footer_height;
	$('#single_message_modal .modal-body').css('height', document_height);
	
	//set dimensions for wrappers
	var document_height = parseInt($( 'html' ).height());
	var tab_height = document_height * 0.25;
	var wrapper_height = document_height - tab_height;
	$('#wrapper').css('height', wrapper_height);
	$('#wrapper2').css('height', wrapper_height);
	
	var tab_height = document_height * 0.35;
	var wrapper_height2 = document_height - tab_height;
	$('#wrapper4').css('height', wrapper_height2);
	$('#wrapper5').css('height', wrapper_height2);
	$('#wrapper6').css('height', wrapper_height2);
	$('#wrapper7').css('height', wrapper_height2);
}

function keyboardHideHandler(e){
	//alert('Keyboard height is: ' + e.keyboardHeight);
	
	//set dimensions for modal
	var document_height = parseInt($( 'html' ).height());
	var modal_footer_height = parseInt($( '#single_message_modal .modal-footer' ).height());
	document_height = document_height + modal_footer_height;
	$('#single_message_modal .modal-body').css('height', document_height);
	
	//set dimensions for wrappers
	var document_height = parseInt($( 'html' ).height());
	var tab_height = document_height * 0.25;
	var wrapper_height = document_height - tab_height;
	$('#wrapper').css('height', wrapper_height);
	$('#wrapper2').css('height', wrapper_height);
	
	var tab_height = document_height * 0.35;
	var wrapper_height2 = document_height - tab_height;
	$('#wrapper4').css('height', wrapper_height2);
	$('#wrapper5').css('height', wrapper_height2);
	$('#wrapper6').css('height', wrapper_height2);
	$('#wrapper7').css('height', wrapper_height2);
}

$(document).on("click","#upload_picture_file", function(event) 
{
  event.preventDefault();
  if (!navigator.camera) {
      alert("Camera API not supported", "Error");
      return;
  }
	navigator.camera.getPicture(uploadPhoto,
                                        function(message) { /*alert('get picture failed');*/ },
                                        { quality: 50, 
                                        destinationType: navigator.camera.DestinationType.FILE_URI,
                                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
                                        );

  return false;
});

$(document).on("click","#upload_picture_camera", function(event) 
{
  event.preventDefault();
  if (!navigator.camera) {
      alert("Camera API not supported", "Error");
      return;
  }
  /*var options =   {   quality: 50,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
                      encodingType: 0     // 0=JPG 1=PNG
                  };*/

  /*navigator.camera.getPicture(
      function(imgData) {
          $('.media-object').attr('src', "data:image/jpeg;base64,"+imgData);
      },
      function() {
          alert('Error taking picture', 'Error');
      },
      options);*/
	navigator.camera.getPicture(uploadPhoto,
                                        function(message) { /*alert('get picture failed');*/ },
                                        { quality: 50, 
                                        destinationType: navigator.camera.DestinationType.FILE_URI,
                                        sourceType: 1 }
                                        );

  return false;
});

function uploadPhoto(imageURI) {
	$("#profile_image").html('');
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	var options = new FileUploadOptions();
	options.fileKey="file";
	//options.fileKey="profile_image";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";
	//options.mimeType="jpeg";

	var params = new Object();
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;
	options.chunkedMode = false;
	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(base_url+"profile/edit_profile_image"), win, fail, options);
}

function win(r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	
	try{
		var data = jQuery.parseJSON(r.response);
		
		if(data.response == 'success')
		{
			window.localStorage.setItem("profile_image_location", data.message);
			$('#profile_image').html('<img src="'+data.message+'" class="img-responsive">');
			$('#account_message').addClass('display_none');
			myScroll3.destroy();
			setTimeout(function () {
				myScroll3 = new IScroll('#wrapper4', {
					mouseWheel: true,
					scrollbars: true,
				});
			}, 500);
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		else
		{
			$('#profile_image').html('<div class="alert alert-danger">'+data.message+"</div>");
			myScroll3.destroy();
			setTimeout(function () {
				myScroll3 = new IScroll('#wrapper4', {
					mouseWheel: true,
					scrollbars: true,
				});
			}, 500);
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	}
	
	catch(err)
	{
		//$('#profile_image').html('<div class="alert alert-danger">'+err.message+"</div>");
		$('#profile_image').html('<div class="alert alert-danger">Unable to upload image. Please try again</div>');
		myScroll3.destroy();
		setTimeout(function () {
			myScroll3 = new IScroll('#wrapper4', {
				mouseWheel: true,
				scrollbars: true,
			});
		}, 500);
		$( "#loader-wrapper" ).addClass( "display_none" );
	}
}

function fail(error) {
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
	
	$('#profile_image').html('<div class="alert alert-danger">Unable to upload image. Please try again</div>');
	myScroll3.destroy();
	setTimeout(function () {
		myScroll3 = new IScroll('#wrapper4', {
			mouseWheel: true,
			scrollbars: true,
		});
	}, 500);
	$( "#loader-wrapper" ).addClass( "display_none" );
}

//Update profiles
$(document).on("click","button#refresh_profiles", function() 
{
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	var total = window.localStorage.getItem("total_profiles");
	if(total == null)
	{
		var total_profiles = 0;
	}
	
	else
	{
		total = parseInt(total);
		var total_profiles = total;
		
		if(total_profiles < 0)
		{
			total_profiles = 0;
		}
	}
	
	var result = request_object.get_profiles2(total_profiles);
	
	result.done(function (employees) 
	{
		try
		{
			var data = jQuery.parseJSON(employees);
			
			var retrieved_total = parseInt(data.total);
			
			if(retrieved_total > 0)
			{
				window.localStorage.setItem("profiles", data.result);
				window.localStorage.setItem("total_profiles", data.total);
				var profiles = data.result;
				$("#display_profiles").html(profiles);
				
				myScroll_profiles.destroy();
				setTimeout(function () {
					myScroll_profiles = new IScroll('#wrapper', {
						mouseWheel: true,
						scrollbars: true,
					});
				}, 500);
			}
			
			else
			{
				alert("That's all we could find for now");
			}
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		catch(err)
		{
			alert('Error displaying profiles. Please try again ');
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	});
	
	result.fail(function(jqXHR, textStatus) 
	{
		alert('Unable to retrieve profiles. Please try again');
		$( "#loader-wrapper" ).addClass( "display_none" );
	});
});

//Update profiles
$(document).on("click","button#refresh_older_profiles", function() 
{
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	var total = window.localStorage.getItem("total_profiles");
	if(total == null)
	{
		var total_profiles = 0;
	}
	
	else
	{
		total = parseInt(total);
		var total_profiles = total - 40;
		
		if(total_profiles < 0)
		{
			total_profiles = 0;
		}
	}
	
	var result = request_object.get_profiles2(total_profiles);
	
	result.done(function (employees) 
	{
		try
		{
			var data = jQuery.parseJSON(employees);
			
			var retrieved_total = parseInt(data.total);
			
			if(retrieved_total > 0)
			{
				window.localStorage.setItem("profiles", data.result);
				window.localStorage.setItem("total_profiles", data.total);
				var profiles = data.result;
				$("#display_profiles").html(profiles);
				
				myScroll_profiles.destroy();
				setTimeout(function () {
					myScroll_profiles = new IScroll('#wrapper', {
						mouseWheel: true,
						scrollbars: true,
					});
				}, 500);
			}
			
			else
			{
				alert("That's all we could find for now");
			}
			
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		catch(err)
		{
			alert('Error displaying profiles. Please try again ');
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	});
	
	result.fail(function(jqXHR, textStatus) 
	{
		alert('Unable to retrieve profiles. Please try again');
		$( "#loader-wrapper" ).addClass( "display_none" );
	});
});

//Update likes me
$(document).on("click","button#refresh_likes_me", function() 
{
	$( "#loader-wrapper" ).removeClass( "display_none" );
	
	var result = request_object.likes_me();
	
	result.done(function (employees) 
	{
		try
		{
			var data = jQuery.parseJSON(employees);
		
			window.localStorage.setItem("likes_me", data.result);
			window.localStorage.setItem("total_likes_me", data.total);
			
			$("#likes_display ul").html(data.result);
			
			myScroll_likes.destroy();
			setTimeout(function () {
				myScroll_likes = new IScroll('#wrapper6', {
					mouseWheel: true,
					scrollbars: true,
				});
			}, 500);
			
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
		
		catch(err)
		{
			alert('Unable to retrieve likes. Please try again');
			$( "#loader-wrapper" ).addClass( "display_none" );
		}
	});
	
	result.fail(function(jqXHR, textStatus) 
	{	
		alert('Unable to retrieve likes. Please check your internet connection and try again');
		$( "#loader-wrapper" ).addClass( "display_none" );
	});
});

function update_profile()
{
	alert('Please update your profile before you continue. A profile image is required. In order to view profiles please set your preferences');
}