		//改網址用的
		//var url = "ForgotPasswordServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/ForgotPasswordServlet";

		//一進來顯示所有紀錄
		$(document).ready(function() {
			$("#resetPassword").click(function() {
				$.ajax({
					url : url,
					data : {
						account : $("#account").val(),
						birthday : $("#birthday").val()
					},
					dataType : "json",

					success : function(response) {
						if(response.flag)
							navigator.notification.alert(response.result, function(){window.location.href = 'Login.html'}, "提醒", "確定");
						else
							navigator.notification.alert(response.result, function(){}, "提醒", "確定");
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			});
		});
		
