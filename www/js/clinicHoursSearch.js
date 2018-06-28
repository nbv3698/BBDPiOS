var hospitalData;
var hospitalIndex = 0;
var departmentIndex = 0;
var doctorIndex = 0;

//取得現有醫生的醫院科別資料
function getHospital() {
	$.ajax({
		type: "POST",
		//url: "http://localhost:8080/BBDPPatient/ClinicHoursServlet",
		url: "http://140.121.197.130:8004/BBDPPatient/ClinicHoursServlet",
		async: false,
		data: {
			option: "getHospital"
		},
		dataType: "json",
		success: function(response) {
			hospitalData = response;
			$("#hospital").empty();
			$("#hospital").append("<option value='select' selected='selected'>請選擇</option>");
			$("#department").empty();
			$("#department").attr("disabled", true);
			$("#department").append("<option value='select' selected='selected'>請選擇</option>");
			$("#doctor").empty();
			$("#doctor").attr("disabled", true);
			$("#doctor").append("<option value='select' selected='selected'>請選擇</option>");
			$("#search").attr("disabled", true);
			for(var i=0; i<response.hospital.length; i++) {
				$("#hospital").append("<option value='hospitalValue" + i + "'>" + response.hospital[i].hospitalName + "</option>");
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			alert("error: " + xhr.status + "\n" + thrownError);
		}
	});
}

//醫院選單
function changeHospital(selected) {
	$("#department").empty();
	$("#department").append("<option value='select' selected='selected'>請選擇</option>");
	$("#doctor").attr("disabled", true);
	$("#doctor").empty();
	$("#doctor").append("<option value='select' selected='selected'>請選擇</option>");
	$("#search").attr("disabled", true);
	if(selected.value == "select") {
		$("#department").attr("disabled", true);
	}
	else {
		$("#department").attr("disabled", false);
		hospitalIndex = parseInt(selected.value.substring(13));
		for(var i=0; i<hospitalData.hospital[hospitalIndex].department.length; i++) {
			$("#department").append("<option value='departmantValue" + i + "'>" + hospitalData.hospital[hospitalIndex].department[i].departmentName + "</option>");
		}
	}
}

//科別選單
function changeDepartment(selected) {
	$("#doctor").empty();
	$("#doctor").append("<option value='select' selected='selected'>請選擇</option>");
	$("#search").attr("disabled", true);
	if(selected.value == "select") {
		$("#doctor").attr("disabled", true);
	}
	else {
		$("#doctor").attr("disabled", false);
		departmentIndex = parseInt(selected.value.substring(15));
		for(var i=0; i<hospitalData.hospital[hospitalIndex].department[departmentIndex].doctor.length; i++) {
			$("#doctor").append("<option value='doctorValue" + i + "'>" + hospitalData.hospital[hospitalIndex].department[departmentIndex].doctor[i].doctorName + "</option>");
		}
	}
}

//醫生選單
function changeDoctor(selected) {
	if(selected.value == "select") {
		$("#search").attr("disabled", true);
	}
	else {
		doctorIndex = parseInt(selected.value.substring(11));
		$("#search").attr("disabled", false);
	}
}

//點擊查詢按鈕
function clickSearch() {
	localStorage.setItem("CHDoctorID", hospitalData.hospital[hospitalIndex].department[departmentIndex].doctor[doctorIndex].doctorID);
	localStorage.setItem("CHHospitalName", hospitalData.hospital[hospitalIndex].hospitalName);
	localStorage.setItem("CHDepartmentName", hospitalData.hospital[hospitalIndex].department[departmentIndex].departmentName);
	localStorage.setItem("CHDoctorName", hospitalData.hospital[hospitalIndex].department[departmentIndex].doctor[doctorIndex].doctorName);
	location.href = "ClinicHours.html";
}