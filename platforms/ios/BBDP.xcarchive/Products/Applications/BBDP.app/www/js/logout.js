	//var urlLogout = "LogoutServlet";
	var urlLogout = "http://140.121.197.130:8004/BBDPPatient/LogoutServlet";
	
	//登出
	$(document).ready(function() {
		$("#logout").click(function() {
			$.ajax({
				url : urlLogout,
				data : {
				},
				dataType : "json",

				success : function(response) {
					if (response == true) {
						ClearLocalStorage();
						window.location.href = 'Login.html';
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});
	});
	
	//清除存在web local stroge的login資料，達到登出的效果
	function ClearLocalStorage() {
		FCMPlugin.unsubscribeFromTopic('patient' + localStorage.getItem('login'));  //提醒推播相關
		localStorage.clear();
		console.log("登出成功");
		navigator.notification.alert("登出成功", null, "提醒", "確定");
	}

