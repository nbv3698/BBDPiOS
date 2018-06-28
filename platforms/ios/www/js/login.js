		//var url = "LoginVerificationServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/";
		var patientID;	//設成全域變數
		
		$("#doAjaxBtn").click(function() {
			if(checkLogin()){	//檢查登入
		        //alert("click login uuid : " + uuid);
		        patientID = "";	//清空
				
		        $.ajax({
					type: "POST",
					url : url+"LoginVerificationServlet",
					data : {
						state : "login",
						account : $("#account").val(),
						password : $("#password").val(),
						uuid : uuid
					},
					dataType : "json",
	
					success : function(response) {
						console.log(response.result);
						if (response.result == "登入成功") {
							patientID = response.patientID;	// 塞值進痊癒變數裡
							
							judgeLogin();	// 判斷是否有其他裝置已登入
						}
						else {
							navigator.notification.alert(response.result, function(){}, "提醒", "確定");
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
		});
		
		
		/********************************************************************************/

		//檢查登入
		function checkLogin(){
			if($("#account").val() == ""){
				console.log("請輸入帳號");
				navigator.notification.alert("請輸入帳號", function(){}, "提醒", "確定");
				return false;
			}
			else if($("#password").val() == ""){
				console.log("請輸入密碼");
				navigator.notification.alert("請輸入密碼", function(){}, "提醒", "確定");
				return false;
			}
			return true;
		}
		
		/********************************************************************************/
		
		// 判斷是否有其他裝置已登入
		function judgeLogin(){
			//alert("judgeLogin : " + patientID);
			$.ajax({
				type: "POST",
				url : url+"LoginVerificationServlet",
				data : {
					state : "judgeLogin",
					uuid : uuid,
					patientID : patientID
				},
				dataType : "json",

				success : function(response) {
					//alert(response.result);
					if (!response.result) {
						navigator.notification.confirm('此用戶已在其他裝置登入，若繼續執行動作，其他裝置將會被強制登出', login, '離開', '確定,取消');
					}
					else{
						login(1);
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		// 登入	// 先更新uuid 在更新patients 在設置cookie和登入
		function login(button){
			//alert("login : " + patientID);
			if(button == 1){
				updateUUID();	// 更新uuid
			}
		}
		// 更新uuid
		function updateUUID(){
			//alert("updateUUID : " + patientID);
			$.ajax({
				type: "POST",
				url : url+"LoginVerificationServlet",
				data : {
					state : "updateUUID",
					uuid : uuid,
					patientID : patientID
				},
				dataType : "json",

				success : function(response) {
					//alert(response);
					if (!response) {
						navigator.notification.alert("更新UUID錯誤，請聯絡管理員", function(){}, "提醒", "確定");
					}
					else{
						updatePatientsAddNew();	// 更新 patients
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		// 更新 patients
		function updatePatientsAddNew(){
			$.ajax({
				type: "POST",
				url : url+"SystemServlet",
				data : {
					state : "updatePatientsAddNew",
					patientID : patientID
				},
				dataType : "json",

				success : function(response) {
					if (!response) {
						navigator.notification.alert("更新patients錯誤，請聯絡管理員", function(){}, "提醒", "確定");
					}
					else{	//登入
						window.location.href = 'Homepage.html';		
						localStorage.setItem("login", patientID);
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		