//var url = "http://localhost:8080/BBDPPatient/RevisitTimeServlet";
var url = "http://140.121.197.130:8004/BBDPPatient/RevisitTimeServlet";		//最下面有BBDPDoctor的url

var timePeriod = ["上午診", "下午診", "晚上診"];
var HPTimePeriod = ["上午", "下午", "晚上"];
var revisitTimeList;
var clickDeleteIndex = -1;
var hospitalData;
var hospitalIndex = -1;
var departmentIndex = -1;

//取得最新的回診時間(Homepage.html)
function getLatestRevisitTime() {
	$.ajax({
		type: "POST",
		url: url,
		async: false,
		data: {
			option: "getLatestRevisitTime",
			patientID: localStorage.getItem("login")
		},
		dataType: "json",
		success: function(response) {
			if(JSON.stringify(response) == "{}") $("p#latestRevisitTime").html("目前尚無回診時間");
			else $("p#latestRevisitTime").html(response.date + " " + HPTimePeriod[response.timePeriod] + " 至" + response.hospital + " " + response.department + " 看診");
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("revisitTime.js getLatestRevisitTime error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//取得回診時間列表(RevisitTimeList.html)
function getRevisitTimeList() {
	$.ajax({
		type: "POST",
		url: url,
		async: false,
		data: {
			option: "getRevisitTimeList",
			patientID: localStorage.getItem("login")
		},
		dataType: "json",
		success: function(response) {
			revisitTimeList = response;
			$("div#revisitTimeList").empty();
			if(response.length == 0) {
				$("div#revisitTimeList").html("<center><br><p class='basicText' style='font-size:6vw'>目前尚無回診時間</p></center>");
			}
			for(var i=0; i<response.length; i++) {
				if(response[i].roomNumber == -1) {
					$("div#revisitTimeList").append(
"			<div class='col-xs-12 col-sm-12'>" + "\n" + 
"				<div class='row' style='background:#FFFDDB; border:#767676 0.2vw solid;'onclick='deleteRevisitTime(" + i + ")'>" + "\n" + 
"					<div class='col-xs-2 col-sm-2' style='padding-top:5vw;padding-bottom:5vw;'>" + "\n" + 
"						<img src='img/calendar.png' width='100%' height='auto'>" + "\n" + 
"					</div>" + "\n" + 
"					<div class='col-xs-10 col-sm-10' style='padding-top:2vw;'>" + "\n" + 
"						<p class='basicText' style='color:#000000;'>" + response[i].hospital + "</p>" + "\n" + 
" 						<p class='basicText' style='color:#000000;'>" + response[i].department + "</p>" + "\n" + 
"						<p class='basicText'>" + response[i].date + " " + timePeriod[response[i].timePeriod] + " " + response[i].number + "號</p>" + "\n" + 
"						<p class='basicText'>" + response[i].PS + "</p>" + "\n" + 
"					</div>" + "\n" + 
"				</div>" + "\n" + 
"			</div>" + "\n");
				}
				else {
					$("div#revisitTimeList").append(
"			<div class='col-xs-12 col-sm-12'>" + "\n" + 
"				<div class='row' style='background:#FFFDDB; border:#767676 0.2vw solid;'onclick='deleteRevisitTime(" + i + ")'>" + "\n" + 
"					<div class='col-xs-2 col-sm-2' style='padding-top:5vw;padding-bottom:5vw;'>" + "\n" + 
"						<img src='img/calendar.png' width='100%' height='auto'>" + "\n" + 
"					</div>" + "\n" + 
"					<div class='col-xs-10 col-sm-10' style='padding-top:2vw;'>" + "\n" + 
"						<p class='basicText' style='color:#000000;'>" + response[i].hospital + "</p>" + "\n" + 
" 						<p class='basicText' style='color:#000000;'>" + response[i].department + "</p>" + "\n" + 
"						<p class='basicText'>" + response[i].date + " " + timePeriod[response[i].timePeriod].substr(0, 2) + " " + response[i].roomNumber + "診 " + response[i].number + "號</p>" + "\n" + 
"						<p class='basicText'>" + response[i].PS + "</p>" + "\n" + 
"					</div>" + "\n" + 
"				</div>" + "\n" + 
"			</div>" + "\n");
				}
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("revisitTime.js getRevisitTimeList error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//刪除指定的回診時間(RevisitTimeList.html)
function deleteRevisitTime(index) {
	clickDeleteIndex = index;
	if(revisitTimeList[index].roomNumber == -1) var message = returnEscapeCharacter(revisitTimeList[index].hospital) + "-" + returnEscapeCharacter(revisitTimeList[index].department) + "\n" + revisitTimeList[index].date + " " + timePeriod[revisitTimeList[index].timePeriod] + revisitTimeList[index].number + "號" + "\n" + returnEscapeCharacter(revisitTimeList[index].PS);
	else var message = returnEscapeCharacter(revisitTimeList[index].hospital) + "-" + returnEscapeCharacter(revisitTimeList[index].department) + "\n" + revisitTimeList[index].date + " " + timePeriod[revisitTimeList[index].timePeriod].substr(0, 2) + " " + revisitTimeList[index].roomNumber + "診 " + revisitTimeList[index].number + "號" + "\n" + returnEscapeCharacter(revisitTimeList[index].PS);
	//網頁
	/*var click = confirm("確定要刪除此回診時間嗎？");
	if(click == true) {
		$.ajax({
			type: "POST",
			url: url,
			async: false,
			data: {
				option: "deleteRevisitTime",
				patientID: localStorage.getItem("login"),
				date: revisitTimeList[index].date,
				timePeriod: revisitTimeList[index].timePeriod,
			},
			dataType: "text",
			success: function(response) {
				getRevisitTimeList();
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log("revisitTime.js deleteRevisitTime error: " + xhr.status + "\n" + thrownError);
			}
		});
	}*/
	//App
	navigator.notification.confirm(message, onConfirm, "", ["關閉", "刪除"]);
}

//(RevisitTimeList.html)
function onConfirm(index) {
	var calendarID;
	if(index == 2) {		//刪除
		$.ajax({
			type: "POST",
			url: url,
			async: false,
			data: {
				option: "deleteRevisitTime",
				patientID: localStorage.getItem("login"),
				date: revisitTimeList[clickDeleteIndex].date,
				timePeriod: revisitTimeList[clickDeleteIndex].timePeriod
			},
			dataType: "text",
			success: function(response) {
				calendarID = response;
				getRevisitTimeList();
				navigator.notification.alert("刪除成功", null, '提醒', '確定');
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log("revisitTime.js deleteRevisitTime error: " + xhr.status + "\n" + thrownError);
			}
		});
		//刪除推播
		$.ajax({
			type: "POST",
			url: "http://140.121.197.130:8004/BBDPDoctor/PushTimerServlet",
			async: false,
			data: {
				option: "deleteSpecificPushTimer",
				patientID: localStorage.getItem("login"),
				dbtableName: "calendar",
				dbIDName: "calendarID",
				dbIDValue: calendarID
			},
			dataType: "text",
			success: function(response) {
				console.log("deleteSpecificPushTimer success");
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log("revisitTime.js deleteSpecificPushTimer error: " + xhr.status + "\n" + thrownError);
			}
	});
	}
	else if(index == 1) {		//關閉
		//alert("You click the cancel button!");
	}
	clickDeleteIndex = -1;
}

//取得所有醫院和科別資料(NewRevisitTime.html)
function getHospital() {
	$.ajax({
		type: "POST",
		url: url,
		async: false,
		data: {
			option: "getHospital"
		},
		dataType: "json",
		success: function(response) {
			hospitalData = response;
			$("#hospital").empty();
			$("#hospital").append("<option value='select' selected='selected'>請選擇醫院</option>");
			for(var i=0; i<response.hospital.length; i++) {
				$("#hospital").append("<option value='hospitalValue" + i + "'>" + response.hospital[i].hospitalName + "</option>");
			}
			$("#hospital").append("<option value='other'>其他</option>");
			$("#department").empty();
			$("#department").attr("disabled", true);
			$("#department").append("<option value='select' selected='selected'>請選擇科別</option>");
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("revisitTime.js getHospital error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//醫院選單(NewRevisitTime.html)
function changeHospital(selected) {
	$("#department").empty();
	$("#department").append("<option value='select' selected='selected'>請選擇科別</option>");
	$("#otherHospital").empty();
	$("#otherDepartment").empty();
	$("#departmentText").css("display", "inline");
	$("#department").css("display", "inline");
	if(selected.value == "select") {
		hospitalIndex = -1;
		$("#department").attr("disabled", true);
	}
	else if(selected.value == "other") {
		hospitalIndex = -2;
		departmentIndex = -2;
		$("#department").attr("disabled", true);
		$("#departmentText").css("display", "none");
		$("#department").css("display", "none");
		$("#otherHospital").append(
"					<div style='height:6vw;'></div>" + "\n" + 
"					<p class='basicText' style='display:inline;vertical-align:middle;color:#FFFFFF'>醫院：</p>" + "\n" + 
"					<input type='text' class='form-control inputLg' placeholder='請輸入醫院' style='width:65vw; display:inline;vertical-align:middle;' />" + "\n");
		$("#otherDepartment").append(
"					<p class='basicText' style='display:inline;vertical-align:middle;'>科別：</p>" + "\n" + 
"					<input type='text' class='form-control inputLg' placeholder='請輸入科別' style='width:65vw; display:inline; vertical-align:middle;' />" + "\n");
	}
	else {
		$("#department").attr("disabled", false);
		hospitalIndex = parseInt(selected.value.substring(13));
		for(var i=0; i<hospitalData.hospital[hospitalIndex].department.length; i++) {
			$("#department").append("<option value='departmantValue" + i + "'>" + hospitalData.hospital[hospitalIndex].department[i].departmentName + "</option>");
		}
		$("#department").append("<option value='other'>其他</option>");
	}
}

//科別選單(NewRevisitTime.html)
function changeDepartment(selected) {
	$("#doctor").empty();
	$("#doctor").append("<option value='select' selected='selected'>請選擇醫師</option>");
	$("#otherDepartment").empty();
	if(selected.value == "select") {
		departmentIndex = -1;
	}
	else if(selected.value == "other") {
		departmentIndex = -2;
		$("#otherDepartment").append(
"					<div style='height:6vw;'></div>" + "\n" + 
"					<p class='basicText' style='display:inline;vertical-align:middle;color:#FFFFFF'>科別：</p>" + "\n" + 
"					<input type='text' class='form-control inputLg' placeholder='請輸入科別' style='width:65vw;display:inline;vertical-align:middle;' />" + "\n");
	}
	else {
		departmentIndex = parseInt(selected.value.substring(15));
	}
}

//點擊新增時，先檢查是否有欄位為空(NewRevisitTime.html)
function checkFieldIsEmpty() {
	//判斷日期是否為過去
	var isPast = false;
	var currentDate = new Date();
	var inputDate = new Date($("#date").val());
	if(currentDate.toDateString() == inputDate.toDateString()) isPast = false;
	else if(currentDate < inputDate) isPast = false;
	else isPast = true;
	
	if($("#date").val() == "") {
		//alert("日期不可為空");
		navigator.notification.alert("日期不可為空", null, "提醒", "確定");
	}
	else if(isPast) {
		//alert("所選日期已為過去，請重新選擇");
		navigator.notification.alert("所選日期已為過去，請重新選擇", null, "提醒", "確定");
	}
	else if($("#timePeriod").val() == "select") {
		//alert("時段不可為空");
		navigator.notification.alert("時段不可為空", null, "提醒", "確定");
	}
	else if(hospitalIndex == -1 || (hospitalIndex == -2 && $("#otherHospital > input").val() == "")) {
		//alert("醫院不可為空");
		navigator.notification.alert("醫院不可為空", null, "提醒", "確定");
	}
	else if(departmentIndex == -1 || (departmentIndex == -2 && $("#otherDepartment > input").val() == "")) {
		//alert("科別不可為空");
		navigator.notification.alert("科別不可為空", null, "提醒", "確定");
	}
	else if($("#number").val() == "") {
		//alert("診號不可為空");
		navigator.notification.alert("請重新填寫看診號碼\n看診號碼必須為數字", null, "提醒", "確定");
	}
	else {
		checkRevisitTimeIsRepeat();
	}
}

//檢查是否有重複新增同一日同一時段(NewRevisitTime.html)
function checkRevisitTimeIsRepeat() {
	$.ajax({
		type: "POST",
		url: url,
		async: false,
		data: {
			option: "checkRevisitTimeIsRepeat",
			patientID: localStorage.getItem("login"),
			date: $("#date").val(),
			timePeriod: $("#timePeriod").val()
		},
		dataType: "text",
		success: function(response) {
			if(response == "yes") {
				//alert("已有同一日同一時段的門診");
				navigator.notification.alert("已有同一日同一時段的門診", null, "提醒", "確定");
			}
			else if(response == "no") {
				newRevisitTime();
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("revisitTime.js checkRevisitTimeIsRepeat error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//新增回診時間(NewRevisitTime.html)
function newRevisitTime() {
	var hosptialInput;
	var departmentInput;
	var roomNumber;
	if(hospitalIndex == -2) hosptialInput = htmlEscapeCharacter($("#otherHospital > input").val());
	else hosptialInput = hospitalData.hospital[hospitalIndex].hospitalName;
	if(departmentIndex == -2) departmentInput = htmlEscapeCharacter($("#otherDepartment > input").val());
	else departmentInput = hospitalData.hospital[hospitalIndex].department[departmentIndex].departmentName;	
	if($("#roomNumber").val() == "") roomNumber = -1;
	else roomNumber = $("#roomNumber").val();
	var inputJSONString = "{\"patientID\":\"" + localStorage.getItem("login") + "\",\"date\":\"" + $("#date").val() + "\",\"hospital\":\"" + hosptialInput + "\",\"department\":\"" + departmentInput + "\",\"timePeriod\":" + $("#timePeriod").val() + ",\"roomNumber\":" + roomNumber + ",\"number\":" + $("#number").val() + ",\"PS\":\"" + htmlEscapeCharacter($("#PS").val()) + "\"}";
	$.ajax({
		type: "POST",
		url: url,
		async: false,
		data: {
			option: "newRevisitTime",
			inputJSONString: inputJSONString
		},
		dataType: "text",
		success: function(response) {
			revisitTimePush($("#date").val(), hosptialInput, departmentInput, $("#timePeriod").val(), $("#number").val(), response);
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("revisitTime.js newRevisitTime error: " + xhr.status + "\n" + thrownError);
		}
	});
	location.href = "RevisitTimeList.html";
}

//新增回診時間時，加入推播(前一天早上9:00和當天早上9:00)
function revisitTimePush(date, hospital, department, timePeriodIndex, number, calendarID) {
	var date2 = new Date($("#date").val());
	var date1 = new Date($("#date").val());
	date1.setDate(date2.getDate() - 1);
	var time1 = date1.getFullYear() + "-" + ((date1.getMonth() + 1) > 9 ? '' : '0') + (date1.getMonth() + 1) + "-" + ((date1.getDate() + 1) > 9 ? '' : '0') + date1.getDate() + " 09:00:00";
	var title = "回診時間提醒";
	var body1 = "明天須至" + hospital + " " + department + "回診(" + timePeriod[timePeriodIndex] + number + "號)";
	var time2 = date2.getFullYear() + "-" + ((date2.getMonth() + 1) > 9 ? '' : '0') + (date2.getMonth() + 1) + "-" + ((date2.getDate() + 1) > 9 ? '' : '0') + date2.getDate() + " 09:00:00";
	var body2 = "今天須至" + hospital + " " + department + "回診(" + timePeriod[timePeriodIndex] + number + "號)";
	
	var currentDate = new Date();
	var inputDate = new Date($("#date").val());
	if(currentDate.toDateString() != inputDate.toDateString()) {		//如果回診日期不是當天
		//前一天早上9:00
		$.ajax({
			type: "POST",
			url: "http://140.121.197.130:8004/BBDPDoctor/PushTimerServlet",
			async: false,
			data: {
				option: "setPushTimer2",
				time: time1,
				patientID: localStorage.getItem("login"),
				title: title,
				body: body1,
				hyperlink: "RevisitTimeList.html",
				dbtableName: "calendar",
				dbIDName: "calendarID",
				dbIDValue: calendarID
			},
			dataType: "text",
			success: function(response) {
				
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log("revisitTime.js revisitTimePush error: " + xhr.status + "\n" + thrownError);
			}
		});
	}
	//當天早上9:00
	$.ajax({
		type: "POST",
		url: "http://140.121.197.130:8004/BBDPDoctor/PushTimerServlet",
		async: false,
		data: {
			option: "setPushTimer2",
			time: time2,
			patientID: localStorage.getItem("login"),
			title: title,
			body: body2,
			hyperlink: "RevisitTimeList.html",
			dbtableName: "calendar",
			dbIDName: "calendarID",
			dbIDValue: calendarID
		},
		dataType: "text",
		success: function(response) {
			
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("revisitTime.js revisitTimePush error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//換成escape character code
function htmlEscapeCharacter(str) {
	str = str.replace(/\'/g, "&#39;");
	str = str.replace(/\"/g, "&#34;");
	str = str.replace(/\\/g, "&#92;");
	return str;
}

//換回escape character symbol
function returnEscapeCharacter(str) {
	str = str.replace(/&#39;/g, "\'");
	str = str.replace(/&#34;/g, '\"');
	str = str.replace(/&#92;/g, '\\');
	return str;
}