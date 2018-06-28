	//var url = "LogoutServlet";
	var url = "http://140.121.197.130:8004/BBDPPatient/";
	
	//登出
	$(document).ready(function() {
		$("#logout").click(function() {
			$.ajax({
				url : url+"LogoutServlet",
				data : {
				},
				dataType : "json",

				success : function(response) {
					if (response == true) {
						ClearLocalStorage("登出成功");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});
	});
	
	//清除存在web local stroge的login資料，達到登出的效果
	function ClearLocalStorage(alertText) {
		FCMPlugin.unsubscribeFromTopic('patient' + localStorage.getItem('login'));  //提醒推播相關
		removePatientID(localStorage.getItem('login'));	// 移除病患ID
		localStorage.clear();
		console.log("登出成功");
		navigator.notification.alert(alertText, function(){window.location.href = 'Login.html';}, "提醒", "確定");
	}
	
	// 移除病患ID
	function removePatientID(patientID){
		$.ajax({
			type: "POST",
			url : url+"SystemServlet",
			data : {
				state : "removePatientID",
				patientID : patientID
			},
			dataType : "json",

			success : function(response) {
				if (!response) {
					navigator.notification.alert("移除patients錯誤，請聯絡管理員", function(){}, "提醒", "確定");
				}
			},
			error : function() {
				console.log("錯誤訊息");
			}
		});
	}
