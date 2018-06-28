		//改網址用的
		//var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		
		$(document).ready(function() {			
			getAllList();	//取得列表
		});

		//下拉選單
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
						//$("#inputArea").empty().append('<div style="height:2vw;"></div><select class="form-control inputLg" id="department" style="width:65vw" onChange="changeDepartment(this)"><option value="all">請選擇科別</option></select><div style="height:2vw;"></div><select class="form-control inputLg" id="symptom" style="display:inline;vertical-align:middle;width:65vw" onChange="changeSymptom(this)"><option value="all">請選擇症狀</option></select><input type="button" class="btn btn-pink btn-lg" onclick="changeBtn()" style="display:inline;vertical-align:middle;margin-left:2vw;outline: none;" id="subscribe" value="訂閱"><div style="height:2vw;"></div>');				
						$("#inputArea").empty().append(
								"<div style='height:2vw;'></div>"+
								"<select class='form-control inputLg' id='department' style='width:60vw' onChange='changeDepartment(this)'>"+
								"	<option value='all'>請選擇科別</option>"+
								"</select>"+
								"<div style='height:2vw;'></div>"+
								"<select class='form-control inputLg' id='symptom' disabled='disabled' style='display:inline;vertical-align:middle;width:60vw' onChange='changeSymptom(this)'>"+
								"	<option value='all'>請選擇症狀</option>"+
								"</select>");
						addOption = "department";	//症狀的科別
					}else if($("#selectSearch").val()=="selectDoctor"){
						//$("#inputArea").empty().append('<div style="height:2vw;"></div><select class="form-control inputLg" id="departmentDoctor" style="width:65vw" onChange="changeDepartmentDoctor(this)"><option value="all">請選擇科別</option></select><div style="height:2vw;"></div><select class="form-control inputLg" id="doctor" style="display:inline;vertical-align:middle;width:65vw" onChange="changeDoctor(this)"><option value="all">請選擇醫生</option></select><input type="button" class="btn btn-pink btn-lg" onclick="changeBtnDoctor()" style="display:inline;vertical-align:middle;margin-left:2vw;outline: none;" id="subscribeDoctor" value="訂閱"><div style="height:2vw;"></div>');
						$("#inputArea").empty().append(
								"<div style='height:2vw;'></div>"+
								"<select class='form-control inputLg' id='departmentDoctor' style='width:60vw' onChange='changeDepartmentDoctor(this)'>"+
								"	<option value='all'>請選擇科別</option>"+
								"</select>"+
								"<div style='height:2vw;'></div>"+
								"<select class='form-control inputLg' id='doctor' disabled='disabled' style='display:inline;vertical-align:middle;width:60vw' onChange='changeDoctor(this)'>"+
								"	<option value='all'>請選擇醫師</option>"+
								"</select>");
						addOption = "departmentDoctor";		//醫生的科別
					}else if($("#selectSearch").val()=="selectAll"){
						getAllList();	//顯示所有衛教文章
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
			getDepartmentList($("#department option:selected").val());	//顯示科別列表
			
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
			if($("#symptom option:selected").val() == "all"){
				getDepartmentList($("#department option:selected").val());	//顯示科別列表
			}
			else{
				getSymptomList();	//顯示該症狀所有衛教文章
			}
			/*此症狀是否有訂閱
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
					}	
					else{				//false:沒有訂閱，請選擇症狀
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
			*/
			
		}
		
		//顯示該症狀所有衛教文章
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
		
		/********************************************************************************************/
		
		//選擇科別(醫生)
		function changeDepartmentDoctor(selected){
			getDepartmentList($("#departmentDoctor option:selected").val());	//顯示科別列表
			
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
			if($("#doctor option:selected").val() == "all"){
				getDepartmentList($("#departmentDoctor option:selected").val());	//顯示科別列表
			}
			else{
				getDoctorList();	//顯示該醫生所有衛教文章
			}
			/*此醫生是否有訂閱
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
			*/
		}
		
		//顯示該醫生所有衛教文章
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
		
		/********************************************************************************************/
		//顯示所有衛教文章
		function getAllList(){
			$.ajax({
				url : url,
				data : {
					state : "getAllList",
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
		
		//顯示該科別所有衛教文章
		function getDepartmentList(department){
			$.ajax({
				url : url,
				data : {
					state : "getDepartmentList",
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
		
		//印出列表
		function printList(response){
			$("#subscriptionList").empty();	//清空
			
			if(response.patientInstructionIDList.length == 0){
			}
			for(var number = 0; number < response.patientInstructionIDList.length; number++){
				$("#subscriptionList").append(
						"<a href='PatientInstruction.html?patientInstructionID="+response.patientInstructionIDList[number]+"&from=1' style='text-decoration:none'>"+
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
		