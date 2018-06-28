	//var url = "SettingServlet";
	var url = "http://140.121.197.130:8004/BBDPPatient/SettingServlet";

	$(document).ready(function() {
		//得到存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		
		//顯示編輯前的生活作息
		$.ajax({
			type: "POST",
			url : url,
			data : {
				state : "lifestyleDefault",
				patientID : patientID
			},
			dataType : "json",
	
			success : function(response) {
				$("#getUp").val(response.getUp);
				$("#breakfast").val(response.breakfast);
				$("#lunch").val(response.lunch);
				$("#dinner").val(response.dinner);
				$("#sleep").val(response.sleep);
			},
			error : function() {
				console.log("錯誤訊息");
			}
		});
		
		//修改後儲存
		$("#storage").click(function() { 
			if(judgeTime()){	//沒問題
				$.ajax({
					type: "POST",
					url : url,
					data : {
						state : "lifestyleUpdate",
						patientID : patientID,
						getUp : $("#getUp").val(),
						breakfast : $("#breakfast").val(),
						lunch : $("#lunch").val(),
						dinner : $("#dinner").val(),
						sleep : $("#sleep").val()
					},
					dataType : "json",
	
					success : function(response) {
						console.log("提醒 : " + response.result);
						navigator.notification.alert(response.result, function(){}, "提醒", "確定");
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
			else{	//有問題
				console.log("提醒 : 請輸入正確的時間");
				navigator.notification.alert("請輸入正確的時間", function(){}, "提醒", "確定");
			}
		});
	});
	
	function judgeTime(){
		var getUp = $("#getUp").val();
		var breakfast = $("#breakfast").val();
		var lunch = $("#lunch").val();
		var dinner = $("#dinner").val();
		var sleep = $("#sleep").val();

		//沒問題
		if(getUp < breakfast && breakfast < lunch && lunch < dinner && dinner < sleep)
			return true;
		//有問題
		else{
			return false;
		}
	}
	