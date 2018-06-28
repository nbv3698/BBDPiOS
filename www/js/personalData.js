	//var url = "SettingServlet";
	var url = "http://140.121.197.130:8004/BBDPPatient/";
		
	//一進來先得到存在local storage的patientID值並顯示出來
	var patientID = window.localStorage.getItem('login');
	
	
	$(document).ready(function() {
		$("#account").empty();
		$("#name").empty();
		$("#password").empty();
		$("#passwordCheck").empty();
		$("#birthday").empty();
				
		//取得原本設定資料
		$.ajax({
			type: "POST",
			url : url+"SettingServlet",
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
			if(checkPersonalData()){	//檢查帳戶設定
				$.ajax({
					type: "POST",
					url : url+"SettingServlet",
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
			}
		});
	});
	
	/********************************************************************************/

	//檢查帳戶設定
	function checkPersonalData(){
		if($("#name").val() == ""){
			console.log("請輸入姓名");
			navigator.notification.alert("請輸入姓名", function(){}, "提醒", "確定");
			return false;
		}
		else if($("#birthday").val() == ""){
			console.log("請輸入生日");
			navigator.notification.alert("請輸入生日", function(){}, "提醒", "確定");
			return false;
		}
		else if($("#password").val() == ""){
			console.log("請輸入密碼");
			navigator.notification.alert("請輸入密碼", function(){}, "提醒", "確定");
			return false;
		}
		else if($("#passwordCheck").val() == ""){
			console.log("請輸入確認密碼");
			navigator.notification.alert("請輸入確認密碼", function(){}, "提醒", "確定");
			return false;
		}
		else if($("#password").val().length<6 || $("#password").val().length>15){
			console.log("密碼長度錯誤");
			navigator.notification.alert("密碼長度錯誤", function(){}, "提醒", "確定");
			return false;
		}
		else if($("#password").val() != $("#passwordCheck").val()){
			console.log("確認密碼錯誤");
			navigator.notification.alert("確認密碼錯誤", function(){}, "提醒", "確定");
			return false;
		}
		else if(!checkEnNum($("#password").val())){
			console.log("密碼請輸入英文或數字");
			navigator.notification.alert("密碼請輸入英文或數字", function(){}, "提醒", "確定");
			return false;
		}
		else if(!checkCnEnNum($("#name").val())){
			console.log("姓名請輸入中文、英文或數字");
			navigator.notification.alert("請輸入中文、英文或數字", function(){}, "提醒", "確定");
			return false;
		}
		return true;
	}
	
	/********************************************************************************/
	//只能輸入英文數字
	function checkEnNum(string) {
		var re = /^[a-zA-Z\d]+$/;
		if (!re.test(string))
			return false;
		return true;
	}

	//只能輸入中文英文數字
	function checkCnEnNum(string) {
		var re = /^[a-zA-Z\d\u4E00-\u9FA5]+$/;
		if (!re.test(string))
			return false;
		return true;
	}