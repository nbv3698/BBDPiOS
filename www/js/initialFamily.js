//var serverURL = "http://localhost:8080/BBDPPatient/";
var serverURL = "http://140.121.197.130:8004/BBDPPatient/";

$(document).ready(function() {
	var url = decodeURI(window.location.href);
	var familyID = url.split("&")[0].split("=")[1];			//familyID
	
	//稱謂
	getKinship(familyID);

	//顯示大頭照
	$("#familyPicture").empty();
	$("#familyPicture").append("<img src='"+serverURL +"ProfilePictureServlet?option=getProfilePicture&patientID="+familyID+"' width='100%' height='auto' onerror='failToLoadFamilyPicture();'>");
});

function failToLoadFamilyPicture(i){
	$("#familyPicture").empty();
	$("#familyPicture").append("<img src='img/user.png' width='100%' height='auto'>");
}

function getKinship(familyID){
	$.ajax({
		type: "GET",
		url: serverURL+"FamilyServlet",
		data: {option : "getKinship", userID : window.localStorage.getItem('login'), familyID : familyID},
		dataType: "text",
														
		success : function(response){
			if(response != ""){
				//顯示稱謂
				$("#displayName").empty();
				$("#displayName").append(response);	
			}
			else{
				//顯示姓名
				getFamilyName(familyID)
			}
			
		},
		error : function(){
			console.log("server沒有回應");
		}
	});
}

function getFamilyName(familyID){
	$.ajax({
		type: "GET",
		url: serverURL+"FamilyServlet",
		data: {option : "getPatientNameByID", familyID : familyID},
		dataType: "text",
														
		success : function(response){
			$("#displayName").empty();
			$("#displayName").append(response);			
		},
		error : function(){
			console.log("server沒有回應");
		}
	});
}

//回上一頁
function backToFamily(){
	var url = decodeURI(window.location.href);
	var familyID = url.split("&")[0].split("=")[1];	
	window.location.href = "Family.html?familyID="+familyID;
}