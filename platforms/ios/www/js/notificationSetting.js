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
				$("#notificationSetting > option:first").attr("selected", true);
				$("#notificationSetting > option:last").attr("selected", false);
			}
			else if(response == "no") {
				$("#notificationSetting > option:first").attr("selected", false);
				$("#notificationSetting > option:last").attr("selected", true);
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//通知開/關選單
function changeNotificationSetting(selected) {
	var notification = "";
	if(selected.value == "on") {
		notification = "yes";
		FCMPlugin.subscribeToTopic('patient' + localStorage.getItem('login'));
	}
	else if(selected.value == "off") {
		notification = "no";
		FCMPlugin.unsubscribeFromTopic('patient' + localStorage.getItem('login'));
	}
	else {
		notification = "yes";
		FCMPlugin.subscribeToTopic('patient' + localStorage.getItem('login'));
	}
	$.ajax({
		type: "POST",
		//url: "http://localhost:8080/BBDPPatient/NotificationSettingServlet",
		url: "http://140.121.197.130:8004/BBDPPatient/NotificationSettingServlet",
		async: false,
		data: {
			option: "modifyNotificationSetting",
			patientID: localStorage.getItem("login"),
			notification: notification
		},
		dataType: "text",
		success: function(response) {
			
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("error: " + xhr.status + "\n" + thrownError);
		}
	});
}