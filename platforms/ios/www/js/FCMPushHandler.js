$(document).on("deviceready", function() {
	function onConfirm(index, hyperlink) {
		if(index == 1) {		//確定
			location.href = hyperlink;
		}
		else if(index == 2) {		//取消
			//alert("You click the cancel button!");
		}
	}
	
	//取得通知設定
	function getNotificationSetting() {
		$.ajax({
			type: "POST",
			//url: "http://localhost:8080/BBDPPatient/NotificationSettingServlet",
			url: "http://140.121.197.130:8004/BBDPPatient/NotificationSettingServlet",
			async: false,
			data: {
				option: "getNotificationSetting",
				patientID: localStorage.getItem("login")
			},
			dataType: "text",
			success: function(response) {
				if(response == "yes") {
					FCMPlugin.subscribeToTopic('patient' + localStorage.getItem('login'));
				}
				else if(response == "no") {
					FCMPlugin.unsubscribeFromTopic('patient' + localStorage.getItem('login'));
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log("error: " + xhr.status + "\n" + thrownError);
			}
		});
	}
	
	getNotificationSetting();
	
	/*FCMPlugin.onTokenRefresh(function(token) {
		//alert("onTokenRefresh: " + token);
	});
	FCMPlugin.getToken(function(token) {
		//alert("getToken: " + token);
	});*/
	//FCMPlugin.subscribeToTopic('patient' + localStorage.getItem('login'));
	FCMPlugin.onNotification(
		function(data) {
			/*if(data.wasTapped) {
				//Notification was received on device tray and tapped by the user. 
				alert("data.wasTapped: " + JSON.stringify(data));
			}
			else {
				//Notification was received in foreground. Maybe the user needs to be notified. 
				alert("data.wasNotTapped: " + JSON.stringify(data));
			}*/
			if(data.wasTapped) {
				location.href = data.hyperlink;
			}
			else {
				navigator.notification.confirm(
					data.body + "\n確定前往查看嗎？",
					function(index) {
						onConfirm(index, data.hyperlink);
					},
					data.title,
					["確定", "取消"]
				);
			}
		},
		function(msg) {		//success handler
			//alert('onNotification callback successfully registered: ' + msg);
		},
		function(err) {		//error handler
			//alert('Error registering onNotification callback: ' + err);
		}
	);
});