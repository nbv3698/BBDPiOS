		//改網址用的
		//var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		
		$(document).ready(function() {
			$.ajax({
				url : url,
				data : {
					state : "getDepartment"
				},
				dataType : "json",
	
				success : function(response) {
					var addOption = "";
					if($("#selectSearch").val()=="selectSymptom"){
						$("#inputArea").empty().append(
								"<div style='height:6vw;'></div>"+
								"<select class='form-control inputLg' id='department' onChange='changeDepartment(this)' style='display:inline;width:65vw;'>"+
								"	<option value=''>請選擇科別</option>"+
								"</select>"+
								"<div style='height:6vw;'></div>"+
								"<select class='form-control inputLg' id='symptom' disabled='disabled' onChange='changeSymptom(this)' style='display:inline;vertical-align:middle;width:65vw;'>"+
								"	<option value=''>請選擇症狀</option>"+
								"</select>");
						addOption = "department";	//症狀的科別
					}
					for(var number=0; number<response.departmentList.length; number++){
						$("#"+addOption).append("<option value='"+response.departmentList[number]+"'>"+response.departmentList[number]+"</option>");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});			
		});

		//下拉選單
		function changeSearch(){
			$("#newSubscriptionButton").attr("disabled", true);	//不可選

			$.ajax({
				url : url,
				data : {
					state : "getDepartment"
				},
				dataType : "json",
	
				success : function(response) {
					var addOption = "";
					if($("#selectSearch").val()=="selectSymptom"){
						$("#inputArea").empty().append(
								"<div style='height:6vw;'></div>"+
								"<select class='form-control inputLg' id='department' onChange='changeDepartment(this)' style='display:inline;width:65vw;'>"+
								"	<option value=''>請選擇科別</option>"+
								"</select>"+
								"<div style='height:6vw;'></div>"+
								"<select class='form-control inputLg' id='symptom' disabled='disabled' onChange='changeSymptom(this)' style='display:inline;vertical-align:middle;width:65vw;'>"+
								"	<option value=''>請選擇症狀</option>"+
								"</select>");
						addOption = "department";	//症狀的科別
					}else if($("#selectSearch").val()=="selectDoctor"){
						$("#inputArea").empty().append(
								"<div style='height:6vw;'></div>"+
								"<select class='form-control inputLg' id='departmentDoctor' onChange='changeDepartmentDoctor(this)' style='display:inline;width:65vw;'>"+
								"	<option value=''>請選擇科別</option>"+
								"</select>"+
								"<div style='height:6vw;'></div>"+
								"<select class='form-control inputLg' id='doctor' disabled='disabled' onChange='changeDoctor(this)' style='display:inline;vertical-align:middle;width:65vw;'>"+
								"	<option value=''>請選擇症狀</option>"+
								"</select>");
						addOption = "departmentDoctor";		//醫生的科別
					}
					for(var number=0; number<response.departmentList.length; number++){
						$("#"+addOption).append("<option value='"+response.departmentList[number]+"'>"+response.departmentList[number]+"</option>");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});				
		}
		/********************************************************************************************/
		
		//選擇科別(症狀)
		function changeDepartment(selected){	
			$("#newSubscriptionButton").attr("disabled", true);	//不可選

			$("#symptom").empty();	//清空
			
			$.ajax({
				url : url,
				data : {
					state : "getSymptom",
					select : $("#department option:selected").val()
				},
				dataType : "json",
	
				success : function(response) {
					$("#symptom").append("<option value='all'>請選擇症狀</option>");
					if(response.symptomList.length == 0){	//此科別目前沒有症狀
						$("#symptom").attr('disabled', true);	//不可選
					}
					else{	//此科別有症狀
						$("#symptom").attr('disabled', false);	//可選
						console.log("可選");
						for(var number=0; number<response.symptomList.length; number++){
							$("#symptom").append("<option value='"+response.symptomList[number]+"'>"+response.symptomList[number]+"</option>");
						}
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//選擇症狀(症狀)
		function changeSymptom(selected){
			$("#newSubscriptionButton").attr("disabled", false);	//可選
		}
		
		/********************************************************************************************/
		//選擇科別(醫生)
		function changeDepartmentDoctor(selected){	
			$("#newSubscriptionButton").attr("disabled", true);	//不可選

			$("#doctor").empty();	//清空
			
			$.ajax({
				url : url,
				data : {
					state : "getDoctor",
					select : $("#departmentDoctor option:selected").val()
				},
				dataType : "json",
	
				success : function(response) {
					$("#doctor").append("<option value='all'>請選擇醫生</option>");
					if(response.doctorIDList.length == 0){	//此科別目前沒有醫生
						$("#doctor").attr('disabled', true);	//不可選
					}
					else{	//此科別有醫生
						$("#doctor").attr('disabled', false);	//可選
						for(var number=0; number<response.doctorIDList.length; number++){
							$("#doctor").append("<option value='"+response.doctorIDList[number]+"'>"+response.nameList[number]+"</option>");
						}
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//選擇醫生(醫生)
		function changeDoctor(selected){
			$("#newSubscriptionButton").attr("disabled", false);	//可選
		}
		
		/********************************************************************************************/
		function newSubscriptionButton(){
			navigator.notification.confirm('確定訂閱此分類文章', newSubscription, '離開', '確定,取消');	//新增訂閱
		}
		//新增訂閱(症狀or醫生)
		function newSubscription(button){
			var stateType;
			if($("#selectSearch").val()=="selectSymptom"){
				stateType = "symptom";
			}
			else if($("#selectSearch").val()=="selectDoctor"){
				stateType = "doctor";
			}

			if(button == 1){
				//先確認是否訂閱過，沒有再新增
				$.ajax({
					url : url,
					data : {
						state : "isSubscription",
						patientID : patientID,
						select : $("#"+stateType+" option:selected").val(),
						stateType : stateType
					},
					dataType : "json",
		
					success : function(response) {	//true成功,false不成功
						if(response){
							console.log("此分類文章已訂閱過");
							navigator.notification.alert("此分類文章已訂閱過", function(){}, "提醒", "確定");
						}
						else{
							//沒有訂閱過，新增此訂閱
							$.ajax({
								url : url,
								data : {
									state : "newSubscription",
									patientID : patientID,
									select : $("#"+stateType+" option:selected").val(),
									stateType : stateType
								},
								dataType : "json",
					
								success : function(response) {	//true成功,false不成功
									if(response){
										console.log("已訂閱此分類文章");
										navigator.notification.alert("已訂閱此分類文章", function(){}, "提醒", "確定");
									}
								},
								error : function() {
									console.log("錯誤訊息");
								}
							});
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
				
			}
		}
		

		/********************************************************************************************/

		//替換
		function htmlEscapeCharacter(str){
			str = str.replace(/\'/g, "&#39;");
			str = str.replace(/\"/g, "&#34;");
			str = str.replace(/\\/g, "&#92;");
			return str;
		}
		//解析
		function returnEscapeCharacter(str){
			str = str.replace(/&#39;/g, "\'");
			str = str.replace(/&#34;/g, '\"');
			str = str.replace(/&#92;/g, '\\');
			return str;
		}
		
		//移除html
		function removeHTML(strText){
		    var regEx = /<[^>]*>/g;
		    return strText.replace(regEx, "");
		}
		