var day = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
var CHData;
var CHDoctorID;
var CHHospitalName;
var CHDepartmentName;
var CHDoctorName;

//取得門診時間
function getClinicHours() {
	CHDoctorID = localStorage.getItem("CHDoctorID");
	CHHospitalName = localStorage.getItem("CHHospitalName");
	CHDepartmentName = localStorage.getItem("CHDepartmentName");
	CHDoctorName = localStorage.getItem("CHDoctorName");
	/*localStorage.removeItem("CHDoctorID");
	localStorage.removeItem("CHHospitalName");
	localStorage.removeItem("CHDepartmentName");
	localStorage.removeItem("CHDoctorName");*/
	$.ajax({
		type: "POST",
		//url: "http://localhost:8080/BBDPPatient/ClinicHoursServlet",
		url: "http://140.121.197.130:8004/BBDPPatient/ClinicHoursServlet",
		async: false,
		data: {
			option: "getClinicHours",
			doctorID: localStorage.getItem("CHDoctorID")
		},
		dataType: "json",
		success: function(response) {
			CHData = response;
			console.log(response);
			if(JSON.stringify(response) == "{}") {
				console.log("此醫師尚未設置門診時間");
				navigator.notification.alert("此醫師尚未設置門診時間", null, "提醒", "確定");
				location.href = "ClinicHoursSearch.html";
			}
			//醫院、科別、醫生姓名
			$("#hospital").html(CHHospitalName);
			$("#departmentAndDoctor").html(CHDepartmentName + "&nbsp&nbsp" + CHDoctorName + "&nbsp醫師");
			//連絡電話
			
			
			//備註
			$("#ps").empty();
			for(var i=0; i<response.CHPS.length; i++) {
				$("#ps").append("<div style='margin-top: 1vh; margin-bottom: 1vh;'><span class='glyphicon glyphicon-pencil'></span>&nbsp;&nbsp;&nbsp;" + response.CHPS[i] + "</div>");
			}
			//門診時間
			$("#ch > tbody > tr:first > td:first").html(response.CHTime.morning.time);
			$("#ch > tbody > tr:eq(1) > td:first").html(response.CHTime.afternoon.time);
			$("#ch > tbody > tr:last > td:first").html(response.CHTime.evening.time);			
			updateTable(0);
		},
		error: function(xhr, ajaxOptions, thrownError) {
			console.log("error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//星期選單
function changeDay(selected) {
	updateTable(parseInt(selected.value));
}

//更新表格
function updateTable(i) {
	$("#ch > thead > tr > th:last").html(day[i]);
	//morning
	if(CHData.CHTime.morning.week[i].yesOrNo == "yes" &&　CHData.CHTime.morning.week[i].ps != "") {
		$("#ch > tbody > tr:first > td:eq(1)").html("<span class='glyphicon glyphicon-ok'></span><div>備註：" + CHData.CHTime.morning.week[i].ps + "</div>");
	}
	else if(CHData.CHTime.morning.week[i].yesOrNo == "yes" &&　CHData.CHTime.morning.week[i].ps == "") {
		$("#ch > tbody > tr:first > td:eq(1)").html("<span class='glyphicon glyphicon-ok'></span>");
	}
	else {
		$("#ch > tbody > tr:first > td:eq(1)").html("<span class='glyphicon glyphicon-remove'></span>");
	}
	//afternoon
	if(CHData.CHTime.afternoon.week[i].yesOrNo == "yes" &&　CHData.CHTime.afternoon.week[i].ps != "") {
		$("#ch > tbody > tr:eq(1) > td:eq(1)").html("<span class='glyphicon glyphicon-ok'></span><div>備註：" + CHData.CHTime.afternoon.week[i].ps + "</div>");
	}
	else if(CHData.CHTime.afternoon.week[i].yesOrNo == "yes" &&　CHData.CHTime.afternoon.week[i].ps == "") {
		$("#ch > tbody > tr:eq(1) > td:eq(1)").html("<span class='glyphicon glyphicon-ok'></span>");
	}
	else {
		$("#ch > tbody > tr:eq(1) > td:eq(1)").html("<span class='glyphicon glyphicon-remove'></span>");
	}
	//evening
	if(CHData.CHTime.evening.week[i].yesOrNo == "yes" &&　CHData.CHTime.evening.week[i].ps != "") {
		$("#ch > tbody > tr:last > td:eq(1)").html("<span class='glyphicon glyphicon-ok'></span><div>備註：" + CHData.CHTime.evening.week[i].ps + "</div>");
	}
	else if(CHData.CHTime.evening.week[i].yesOrNo == "yes" &&　CHData.CHTime.evening.week[i].ps == "") {
		$("#ch > tbody > tr:last > td:eq(1)").html("<span class='glyphicon glyphicon-ok'></span>");
	}
	else {
		$("#ch > tbody > tr:last > td:eq(1)").html("<span class='glyphicon glyphicon-remove'></span>");
	}
}

//點擊電話按鈕
function callDoctor() {
	navigator.notification.confirm("醫師連絡電話: " + CHData.CHPhone + "\n確定要撥打醫師的連絡電話嗎?\n", onConfirm, "提醒", ["確定", "取消"]);
}

function onConfirm(index) {
	if(index == 1) {		//確定
		location.href = "tel:" + CHData.CHPhone;
	}
	else if(index == 2) {		//取消
		//alert("You click the cancel button!");
	}
}