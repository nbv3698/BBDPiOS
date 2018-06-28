	//var url = "SettingServlet";
	var url = "http://140.121.197.130:8004/BBDPPatient/SettingServlet";
		
	$(document).ready(function() {
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
				$("#QRCode").attr("src", response.QRCode);
				//$("#QRCode").append("<img style='margin-top: 25vw;height:35vw;' src='"+response.QRCode+"'/>");
			},
			error : function() {
				console.log("錯誤訊息");
			}
		});
	});