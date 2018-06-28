function judgeLogin(){
	$.ajax({
		type: "POST",
		url : "http://140.121.197.130:8004/BBDPPatient/LoginVerificationServlet",
		data : {
			state : "judgeLogin",
			uuid : uuid,
			patientID : window.localStorage.getItem('login')
		},
		dataType : "json",

		success : function(response) {
			alert(response.result);
			if (!response.result) {
				navigator.notification.alert("此用戶已在其他裝置登入，當前裝置將被登出", function(){window.location.href = 'Login.html';}, "提醒", "確定");
			}
		},
		error : function() {
			console.log("錯誤訊息");
		}
	});
}