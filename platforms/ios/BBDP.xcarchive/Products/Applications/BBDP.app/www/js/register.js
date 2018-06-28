//var url = "RegisterServlet";
var url = "http://140.121.197.130:8004/BBDPPatient/RegisterServlet";

$(document).ready(function() {
	$("#register").click(function() {
		$.ajax({
			type: "POST",
			url : url,
			data : {
				account : $("#account").val(),
				password : $("#password").val(),
				passwordCheck : $("#passwordCheck").val(),
				name : $("#name").val(),
				birthday : $("#birthday").val(),
				agree : $('input[name="agree"]').prop("checked")
			},
			dataType : "json",

			success : function(response) {
				console.log(response.result);
				navigator.notification.alert(response.result, function(){}, "提醒", "確定");
				if(response.result == "成功"){
					window.location.href = 'Login.html';
				}
			},
			error : function() {
				console.log("錯誤訊息");
			}
		});
	});
});

function linkConfirm(){
	console.log("同意條款");
	navigator.notification.confirm('內容', clickConfirm, '條款事項', '同意,取消');
}
//同意註冊條款
function clickConfirm(button){
	if( button == 1){
		$("#agree").attr("checked", true);
	}
	else if(button == 2){
		$("#agree").attr("checked", false);
	}
}