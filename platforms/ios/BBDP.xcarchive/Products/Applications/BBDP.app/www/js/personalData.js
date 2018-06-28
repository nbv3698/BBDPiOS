	//var url = "SettingServlet";
	var url = "http://140.121.197.130:8004/BBDPPatient/SettingServlet";
		
	$(document).ready(function() {
		$("#account").empty();
		$("#name").empty();
		$("#password").empty();
		$("#passwordCheck").empty();
		$("#birthday").empty();
		//一進來先得到存在local storage的patientID值並顯示出來
		var patientID = window.localStorage.getItem('login');
				
		//取得原本設定資料
		$.ajax({
			type: "POST",
			url : url,
			data : {
				state : "Default",
				patientID : patientID
			},
			dataType : "json",

			success : function(response) {
				//$("#QRCode").attr("src", response.QRCode);
				
				$("#account").val(response.account);
				$("#name").val(response.name);
				$("#password").val(response.password);
				$("#passwordCheck").val(response.passwordCheck);
				$("#birthday").val(response.birthday);
			},
			error : function() {
				console.log("錯誤訊息");
			}
		});
		
		
		//修改設定資料
		$("#change").click(function() {
			//一進來先得到存在local storage的patientID值
			var patientID = window.localStorage.getItem('login');
			
			$.ajax({
				type: "POST",
				url : url,
				data : {
					state : "Change",
					patientID : patientID,
					name : $("#name").val(),
					password : $("#password").val(),
					passwordCheck : $("#passwordCheck").val(),
					birthday : $("#birthday").val()
				},
				dataType : "json",

				success : function(response) {
					console.log(response.show);
					navigator.notification.alert(response.show, function(){}, "提醒", "確定");
					
					$("#name").empty();
					$("#password").empty();
					$("#passwordCheck").empty();
					$("#birthday").empty();
					$("#name").val(response.name);
					$("#password").val(response.password);
					$("#passwordCheck").val(response.passwordCheck);
					$("#birthday").val(response.birthday);
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});
	});