		//改網址用的
		var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		
		//這個頁面是哪種類型
		var stateType = "symptom";
		
		$(document).ready(function() {
			getSymptomDepartment();	//取得訂閱的科別(症狀)
			getSubscriptionList();	//顯示訂閱的所有衛教文章(症狀或醫生)
		});
		
		function accordingToSymptomPage(){
			console.log("accordingToSymptomPage");
			stateType = "symptom";	//更改頁面為症狀
			changeSearch();			//下拉選單
			getSubscriptionList();	//顯示訂閱的所有衛教文章(症狀或醫生)
		}
		function accordingToDoctorPage(){
			console.log("accordingToDoctorPage");
			stateType = "doctor";	//更改頁面為醫生
			changeSearch();			//下拉選單
			getSubscriptionList();	//顯示訂閱的所有衛教文章(症狀或醫生)
		}
		
		//下拉選單
		function changeSearch(){
			$("#changeSearch").empty();
			if(stateType == "symptom"){
				$("#changeSearch").append(
						"<select class='form-control inputLg' id='department' style='width:50vw' onChange='changeDepartment(this)'>"+
						"	<option value='all'>請選擇科別</option>"+
						"</select>"+
						"<!--如果有選擇科別，下面就要跟著篩選了，不管有沒有選症狀或醫師-->"+
						"<div style='height:2vw;'></div>"+
						"<select class='form-control inputLg' id='symptom' disabled='disabled' style='display:inline;vertical-align:middle;width:50vw' onChange='changeSymptom(this)'>"+
						"	<option value='all'>請選擇症狀</option>"+
						"</select>"+
						"<div id='deleteSubscriptionButton' style='display:inline;'>"+
						"</div>");
				getSymptomDepartment();		//取得科別(症狀)
			}
			else if(stateType == "doctor"){
				$("#changeSearch").append(
						"<select class='form-control inputLg' id='departmentDoctor' style='width:50vw' onChange='changeDepartmentDoctor(this)'>"+
						"	<option value='all'>請選擇科別</option>"+
						"</select>"+
						"<!--如果有選擇科別，下面就要跟著篩選了，不管有沒有選症狀或醫師-->"+
						"<div style='height:2vw;'></div>"+
						"<select class='form-control inputLg' id='doctor' disabled='disabled' style='display:inline;vertical-align:middle;width:50vw' onChange='changeDoctor(this)'>"+
						"	<option value='all'>請選擇醫師</option>"+
						"</select>"+
						"<div id='deleteSubscriptionButton' style='display:inline;'>"+
						"</div>");
				getDoctorDepartment();		//取得科別(醫生)
			}
		}
		
		/********************************************************************************************/

		//取得訂閱的科別(症狀)
		function getSymptomDepartment(){
			$.ajax({
				url : url,
				data : {
					state : "getSymptomDepartment",
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					for(var number=0; number<response.departmentList.length; number++){
						$("#department").append("<option value='"+response.departmentList[number]+"'>"+response.departmentList[number]+"</option>");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//選擇科別(症狀)
		function changeDepartment(selected){	
			getSymptomDepartmentList($("#department option:selected").val());	//顯示該科別訂閱的所有衛教文章(症狀)

			$("#deleteSubscriptionButton").empty();	//清空
			
			$("#symptom").empty();	//清空
			
			$.ajax({
				url : url,
				data : {
					state : "getSubscriptionSymptom",
					select : $("#department option:selected").val(),
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					$("#symptom").append("<option value='all'>請選擇症狀</option>");
					if(response.symptomList.length == 0){	//此科別目前沒有症狀
						$("#symptom").attr('disabled', true);	//不可選
					}
					else{	//此科別有症狀
						$("#symptom").attr('disabled', false);	//可選
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
			getSymptomList();	//顯示該症狀所有衛教文章
			
			$("#deleteSubscriptionButton").empty();	//清空
			$("#deleteSubscriptionButton").append("<input type='button' class='btn btn-save btn-lg' onclick='deleteSubscriptionButton()' style='display:inline;vertical-align:middle;margin-left:2vw;outline: none;' value='取消訂閱'>");
		}
			
		/********************************************************************************************/
		
		//取得有訂閱的科別(醫生)
		function getDoctorDepartment(){
			console.log("stateType : " + stateType);
			$.ajax({
				url : url,
				data : {
					state : "getDoctorDepartment",
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					for(var number=0; number<response.departmentList.length; number++){
						$("#departmentDoctor").append("<option value='"+response.departmentList[number]+"'>"+response.departmentList[number]+"</option>");					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//選擇科別(醫生)
		function changeDepartmentDoctor(selected){
			getDoctorDepartmentList($("#departmentDoctor option:selected").val());	//顯示該科別訂閱的所有衛教文章(醫生)
			$("#deleteSubscriptionButton").empty();	//清空
			$("#doctor").empty();	//清空
			
			$.ajax({
				url : url,
				data : {
					state : "getSubscriptionDoctor",
					select : $("#departmentDoctor option:selected").val(),
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					$("#doctor").append("<option value='all'>請選擇醫師</option>");
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
			getDoctorList();	//顯示該醫生所有衛教文章
			
			$("#deleteSubscriptionButton").empty();	//清空
			$("#deleteSubscriptionButton").append("<input type='button' class='btn btn-save btn-lg' onclick='deleteSubscriptionButton()' style='display:inline;vertical-align:middle;margin-left:2vw;outline: none;' value='取消訂閱'>");
		}

		
		/********************************************************************************************/
		//顯示訂閱的所有衛教文章(症狀或醫生)
		function getSubscriptionList(){
			$("#subscriptionList").empty();	//清空
			$.ajax({
				url : url,
				data : {
					state : "getSubscriptionList",
					patientID : patientID,
					stateType : stateType
				},
				dataType : "json",
	
				success : function(response) {
					if(response.patientInstructionIDList.length == 0){
						if(stateType == "symptom"){
							$("#subscriptionList").append(
									"<center><br><p class='basicText' style='font-size:6vw'>目前尚未依症狀訂閱文章</p></center>");
						}
						else if(stateType == "doctor"){
							$("#subscriptionList").append(
									"<center><br><p class='basicText' style='font-size:6vw'>目前尚未依醫師訂閱文章</p></center>");
						}
					}
					for(var number = 0; number < response.patientInstructionIDList.length; number++){
						$("#subscriptionList").append(
								"<a href='PatientInstruction.html?patientInstructionID="+response.patientInstructionIDList[number]+"&from=2' style='text-decoration:none'>"+
								"	<div style='border:#767676 0.2vw solid;font-size:4.5vw'>"+
								"		<div class='panel-heading' style='background-color: #FFCBCB;'>"+
								"			<p class='label' style='float:right;font-size:4.5vw;background-color:#AFAFAF'>"+returnEscapeCharacter(response.symptomList[number])+"</p>"+
								"			<p style='color:000000;display:inline;'>"+returnEscapeCharacter(response.titleList[number])+"</p>"+
								"		</div>"+
								"		<div class='panel-body'>"+
								"			<p style='color:767676;font-size:4vw;margin-bottom:-1vw'>"+response.hospitalList[number]+"<br>"+response.departmentList[number]+""+response.nameList[number]+"</p>"+
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

		//顯示該科別訂閱的所有衛教文章(症狀)
		function getSymptomDepartmentList(department){
			$.ajax({
				url : url,
				data : {
					state : "getSymptomDepartmentList",
					patientID : patientID,
					department : department
				},
				dataType : "json",
	
				success : function(response) {
					printList(response);	//印出列表
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}

		//顯示該科別訂閱的所有衛教文章(醫生)
		function getDoctorDepartmentList(department){
			$.ajax({
				url : url,
				data : {
					state : "getDoctorDepartmentList",
					patientID : patientID,
					department : department
				},
				dataType : "json",
	
				success : function(response) {
					printList(response);	//印出列表
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}

		//顯示該症狀所有衛教文章(症狀)
		function getSymptomList(){
			$.ajax({
				url : url,
				data : {
					state : "getSymptomList",
					patientID : patientID,
					department : $("#department option:selected").val(),
					select : $("#symptom option:selected").val()
				},
				dataType : "json",
	
				success : function(response) {
					printList(response);	//印出列表
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//顯示該醫生所有衛教文章(醫生)
		function getDoctorList(){
			$.ajax({
				url : url,
				data : {
					state : "getDoctorList",
					patientID : patientID,
					department : $("#departmentDoctor option:selected").val(),
					select : $("#doctor option:selected").val()
				},
				dataType : "json",
	
				success : function(response) {
					printList(response);	//印出列表
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//印出列表
		function printList(response){
			$("#subscriptionList").empty();	//清空
			
			if(response.patientInstructionIDList.length == 0){

			}
			for(var number = 0; number < response.patientInstructionIDList.length; number++){
				$("#subscriptionList").append(
						"<a href='PatientInstruction.html?patientInstructionID="+response.patientInstructionIDList[number]+"&from=2' style='text-decoration:none'>"+
						"	<div style='border:#767676 0.2vw solid;font-size:4.5vw'>"+
						"		<div class='panel-heading' style='background-color: #FFCBCB;'>"+
						"			<p class='label' style='float:right;font-size:4.5vw;background-color:#AFAFAF'>"+returnEscapeCharacter(response.symptomList[number])+"</p>"+
						"			<p style='color:000000;display:inline;'>"+returnEscapeCharacter(response.titleList[number])+"</p>"+
						"		</div>"+
						"		<div class='panel-body'>"+
						"			<p style='color:767676;font-size:4vw;margin-bottom:-1vw'>"+response.hospitalList[number]+"<br>"+response.departmentList[number]+""+response.nameList[number]+"</p>"+
						"		</div>"+
						"	</div>"+
						"</a>");
			}
		}

		/********************************************************************************************/
		
		function deleteSubscriptionButton(){
			navigator.notification.confirm('取消訂閱此分類文章', deleteSubscription, '離開', '確定,取消');
		}
		//刪除訂閱(症狀or醫生)
		function deleteSubscription(button){
			if(button == 1){
				$.ajax({
					url : url,
					data : {
						state : "deleteSubscription",
						patientID : patientID,
						select : $("#"+stateType+ " option:selected").val(),
						stateType : stateType
					},
					dataType : "json",
		
					success : function(response) {	//true成功,false不成功
						if(response){
							getSubscriptionList();	//顯示訂閱的所有衛教文章(症狀或醫生)
							navigator.notification.alert("已取消訂閱此分類文章", function(){changeSearch();/*重新整理下拉選單*/}, "提醒", "確定");
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
		