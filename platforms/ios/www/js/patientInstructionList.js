		//改網址用的
		//var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		
		$(document).ready(function() {
			//取得科別
			$.ajax({
				url : url,
				data : {
					state : "getDepartment"
				},
				dataType : "json",
	
				success : function(response) {
					for(var number=0; number<response.departmentList.length; number++){
						//症狀的科別
						$("#department").append("<option value='"+response.departmentList[number]+"'>"+response.departmentList[number]+"</option>");
						//醫生的科別
						//$("#departmentDoctor").append("<option value='"+response.departmentList[number]+"'>"+response.departmentList[number]+"</option>");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
			getList();	//取得列表
			
		});

		function changeSearch(){
			$.ajax({
				url : url,
				data : {
					state : "getDepartment"
				},
				dataType : "json",
	
				success : function(response) {
					var addOption = "";
					if($("#selectSearch").val()=="selectSymptom"){
						$("#inputArea").empty().append('<select class="form-control inputLg" id="department" style="width:65vw" onChange="changeDepartment(this)"><option value="all">請選擇科別</option></select><div style="height:2vw;"></div><select class="form-control inputLg" id="symptom" style="display:inline;vertical-align:middle;width:65vw" onChange="changeSymptom(this)"><option value="all">請選擇症狀</option></select><input type="button" class="btn btn-pink btn-lg" onclick="changeBtn()" style="display:inline;vertical-align:middle;margin-left:2vw;outline: none;" id="subscribe" value="訂閱"><div style="height:2vw;"></div>');				
						addOption = "department";	//症狀的科別
					}else{
						$("#inputArea").empty().append('<select class="form-control inputLg" id="departmentDoctor" style="width:65vw" onChange="changeDepartmentDoctor(this)"><option value="all">請選擇科別</option></select><div style="height:2vw;"></div><select class="form-control inputLg" id="doctor" style="display:inline;vertical-align:middle;width:65vw" onChange="changeDoctor(this)"><option value="all">請選擇醫生</option></select><input type="button" class="btn btn-pink btn-lg" onclick="changeBtnDoctor()" style="display:inline;vertical-align:middle;margin-left:2vw;outline: none;" id="subscribeDoctor" value="訂閱"><div style="height:2vw;"></div>');
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
					}
					else{	//此科別有症狀
						for(var number=0; number<response.symptomList.length; number++){
							$("#symptom").append("<option value='"+response.symptomList[number]+"'>"+response.symptomList[number]+"</option>");
						}
					}
					buttonPink();	//按鈕顯示訂閱
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//選擇症狀(症狀)
		function changeSymptom(selected){
			//此症狀是否有訂閱
			$.ajax({
				url : url,
				data : {
					state : "isSubscription",
					patientID : patientID,
					select : $("#symptom option:selected").val(),
					stateType : "symptom"
				},
				dataType : "json",
	
				success : function(response) {	//true:有, false:沒有
					if(response){		//true:有訂閱
						buttonGray();	//按鈕顯示取消
					}	
					else{				//false:沒有訂閱，請選擇症狀
						buttonPink();	//按鈕顯示訂閱
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
			
		}
		
		function changeBtn(){
			if($("#symptom option:selected").val() != 'all'){	//有選擇症狀才有反應
				if($("#subscribe").val()=="訂閱"){
					//newSubscription(1);//function(buttonIndex){newSubscription(buttonIndex, "doctor");}
					navigator.notification.confirm('確定訂閱此分類文章', newSubscription, '離開', '確定,取消');	//新增訂閱
				}else if($("#subscribe").val()=="取消"){
					//deleteSubscription(1);
					navigator.notification.confirm('取消訂閱此分類文章', deleteSubscription, '離開', '確定,取消');	//刪除訂閱
				}
			}
		}	
		
		//新增訂閱(症狀)
		function newSubscription(button){
			if(button == 1){
				$.ajax({
					url : url,
					data : {
						state : "newSubscription",
						patientID : patientID,
						select : $("#symptom option:selected").val(),
						stateType : "symptom"
					},
					dataType : "json",
		
					success : function(response) {	//true成功,false不成功
						if(response){
							buttonGray();	//按鈕顯示取消
							navigator.notification.alert("已訂閱此分類文章", function(){}, "提醒", "確定");
							getList();	//顯示列表;
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
		}
		
		//刪除訂閱(症狀)
		function deleteSubscription(button){
			if(button == 1){
				$.ajax({
					url : url,
					data : {
						state : "deleteSubscription",
						patientID : patientID,
						select : $("#symptom option:selected").val(),
						stateType : "symptom"
					},
					dataType : "json",
		
					success : function(response) {	//true成功,false不成功
						if(response){
							buttonPink();	////按鈕顯示訂閱
							navigator.notification.alert("已取消訂閱此分類文章", function(){}, "提醒", "確定");
							getList();	//顯示列表;
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
		}
		
		//按鈕顯示訂閱(症狀)
		function buttonPink(){
			$("#subscribe").removeClass('btn-save');
			$("#subscribe").addClass('btn-pink');
			$("#subscribe").prop("value","訂閱");
		}
		
		//按鈕顯示取消(症狀)
		function buttonGray(){
			$("#subscribe").removeClass('btn-pink');
			$("#subscribe").addClass('btn-save');
			$("#subscribe").prop("value","取消");
		}
		
		/********************************************************************************************/
		
		//選擇科別(醫生)
		function changeDepartmentDoctor(selected){
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
					}
					else{	//此科別有醫生
						for(var number=0; number<response.doctorIDList.length; number++){
							$("#doctor").append("<option value='"+response.doctorIDList[number]+"'>"+response.nameList[number]+"</option>");
						}
					}
					buttonPinkDoctor();	//按鈕顯示訂閱
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//選擇醫生(醫生)
		function changeDoctor(selected){
			//此醫生是否有訂閱
			$.ajax({
				url : url,
				data : {
					state : "isSubscription",
					patientID : patientID,
					select : $("#doctor option:selected").val(),
					stateType : "doctor"
				},
				dataType : "json",
	
				success : function(response) {	//true:有, false:沒有
					console.log("response : " + response);
					if(response){		//true:有訂閱
						buttonGrayDoctor();	//按鈕顯示取消
					}	
					else{				//false:沒有訂閱，請選擇醫生
						buttonPinkDoctor();	//按鈕顯示訂閱
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		function changeBtnDoctor(){
			if($("#doctor option:selected").val() != 'all'){	//有選擇醫生才有反應
				if($("#subscribeDoctor").val()=="訂閱"){
					//newSubscriptionDoctor(1);
					navigator.notification.confirm('確定訂閱此分類文章', newSubscriptionDoctor, '離開', '確定,取消');	//新增訂閱
				}else if($("#subscribeDoctor").val()=="取消"){
					//deleteSubscriptionDoctor(1);
					navigator.notification.confirm('取消訂閱此分類文章', deleteSubscriptionDoctor, '離開', '確定,取消');	//刪除訂閱
				}
			}
		}	
		
		//新增訂閱(醫生)
		function newSubscriptionDoctor(button){
			if(button == 1){
				$.ajax({
					url : url,
					data : {
						state : "newSubscription",
						patientID : patientID,
						select : $("#doctor option:selected").val(),
						stateType : "doctor"
					},
					dataType : "json",
		
					success : function(response) {	//true成功,false不成功
						if(response){
							buttonGrayDoctor();	//按鈕顯示取消
							getList();	//顯示列表;
							navigator.notification.alert("已訂閱此分類文章", function(){}, "提醒", "確定");
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
		}
		
		//刪除訂閱(醫生)
		function deleteSubscriptionDoctor(button){
			if(button == 1){
				$.ajax({
					url : url,
					data : {
						state : "deleteSubscription",
						patientID : patientID,
						select : $("#doctor option:selected").val(),
						stateType : "doctor"
					},
					dataType : "json",
		
					success : function(response) {	//true成功,false不成功
						if(response){
							buttonPinkDoctor();	////按鈕顯示訂閱
							getList();	//顯示列表;
							navigator.notification.alert("已取消訂閱此分類文章", function(){}, "提醒", "確定");
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
		}
		
		//按鈕顯示訂閱(醫生)
		function buttonPinkDoctor(){
			$("#subscribeDoctor").removeClass('btn-save');
			$("#subscribeDoctor").addClass('btn-pink');
			$("#subscribeDoctor").prop("value","訂閱");
		}
		
		//按鈕顯示取消(醫生)
		function buttonGrayDoctor(){
			$("#subscribeDoctor").removeClass('btn-pink');
			$("#subscribeDoctor").addClass('btn-save');
			$("#subscribeDoctor").prop("value","取消");
		}
		
		/********************************************************************************************/
		//顯示列表
		function getList(){
			$("#subscriptionList").empty();	//清空
			$.ajax({
				url : url,
				data : {
					state : "getList",
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					if(response.patientInstructionIDList.length == 0){
						$("#subscriptionList").append(
								"<center><br><p class='basicText'>無訂閱</p></center>");
					}
					for(var number = 0; number < response.patientInstructionIDList.length; number++){
						$("#subscriptionList").append(
								"<a href='PatientInstruction.html?patientInstructionID="+response.patientInstructionIDList[number]+"' style='text-decoration:none'>"+
								"	<div style='border:#767676 0.2vw solid;font-size:4.5vw'>"+
								"		<div class='panel-heading' style='background-color: #FFCBCB;'>"+
								"			<p class='label' style='float:right;font-size:4.5vw;background-color:#888888'>"+returnEscapeCharacter(response.symptomList[number])+"</p>"+
								"			<p style='color:000000;display:inline;'>"+returnEscapeCharacter(response.titleList[number])+"</p>"+
								"		</div>"+
								"		<div class='panel-body'>"+
								"			<p style='color:767676;font-size:4vw;margin-bottom:-1vw'>"+response.hospitalList[number]+"-"+response.departmentList[number]+""+response.nameList[number]+"<br>"+response.editDateList[number]+"</p>"+
								"		</div>"+
								"	</div>"+
								"</a>");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
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
		