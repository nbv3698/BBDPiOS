		//var url = "LoginVerificationServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/LoginVerificationServlet";

		$("#doAjaxBtn").click(function() {
			$.ajax({
				type: "POST",
				url : url,
				data : {
					account : $("#account").val(),
					password : $("#password").val()
				},
				dataType : "json",

				success : function(response) {
					console.log(response.result);
					if (response.result == "登入成功") {
						window.location.href = 'Homepage.html';
						localStorage.setItem("login", response.patientID);
					}
					else {
						navigator.notification.alert(response.result, function(){}, "提醒", "確定");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});