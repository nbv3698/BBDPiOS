//var url = "RegisterServlet";
var url = "http://140.121.197.130:8004/BBDPPatient/RegisterServlet";

$(document).ready(function() {
	$("#register").click(function() {
		if(checkRegister()){	//檢查註冊
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
		}
	});
});

/********************************************************************************/

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

/********************************************************************************/

//檢查註冊
function checkRegister(){
	if($("#account").val() == ""){
		console.log("請輸入帳號");
		navigator.notification.alert("請輸入帳號", function(){}, "提醒", "確定");
		return false;
	}
	else if($("#name").val() == ""){
		console.log("請輸入姓名");
		navigator.notification.alert("請輸入姓名", function(){}, "提醒", "確定");
		return false;
	}
	else if($("#birthday").val() == ""){
		console.log("請輸入生日");
		navigator.notification.alert("請輸入生日", function(){}, "提醒", "確定");
		return false;
	}
	else if($("#password").val() == ""){
		console.log("請輸入密碼");
		navigator.notification.alert("請輸入密碼", function(){}, "提醒", "確定");
		return false;
	}
	else if($("#passwordCheck").val() == ""){
		console.log("請輸入確認密碼");
		navigator.notification.alert("請輸入確認密碼", function(){}, "提醒", "確定");
		return false;
	}
	else if(!isIDCard($("#account").val())){
		console.log("身分證字號格式錯誤");
		navigator.notification.alert("身分證字號格式錯誤", function(){}, "提醒", "確定");
		return false;
	}
	else if($("#password").val().length<6 || $("#password").val().length>15){
		console.log("密碼長度錯誤");
		navigator.notification.alert("密碼長度錯誤", function(){}, "提醒", "確定");
		return false;
	}
	else if($("#password").val() != $("#passwordCheck").val()){
		console.log("確認密碼錯誤");
		navigator.notification.alert("確認密碼錯誤", function(){}, "提醒", "確定");
		return false;
	}
	else if(!checkEnNum($("#password").val())){
		console.log("密碼請輸入英文或數字");
		navigator.notification.alert("密碼請輸入英文或數字", function(){}, "提醒", "確定");
		return false;
	}
	else if(!checkCnEnNum($("#name").val())){
		console.log("姓名請輸入中文、英文或數字");
		navigator.notification.alert("請輸入中文、英文或數字", function(){}, "提醒", "確定");
		return false;
	}
	else if($('input[name="agree"]').prop("checked") == false){
		console.log("請先閱讀並同意使用者條款");
		navigator.notification.alert("請先閱讀並同意使用者條款", function(){}, "提醒", "確定");
		return false;
	}
	return true;
}

/********************************************************************************/

//判斷是否為身分證字號
function isIDCard(string){
	var re = /^[A-Z]\d{9}$/;
	if (!re.test(string))	//是否輸入開頭大寫+9個數字
		return false;
	if(string.charAt(1)!="1" && string.charAt(1)!="2")	//第二個字元不等於1或2
		return false;
	if(!twidcheck(string))	//最後一碼驗證碼是否正確
		return false;
	return true;
}
//身分證最後一碼驗證碼//網路查到的寫法
function twidcheck(value){
    var a = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O');
    var b = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    var c = new Array(2);
    var d;    var e;    var f;    var g = 0;
    var h = /^[a-z](1|2)\d{8}$/i;
    if (value.search(h) == -1){
        return false;
    }else{
        d = value.charAt(0).toUpperCase();
        f = value.charAt(9);
    }
    for (var i = 0; i < 26; i++){
        if (d == a[i]){
        	e = i + 10; //10
            c[0] = Math.floor(e / 10); //1
            c[1] = e - (c[0] * 10); //10-(1*10)
            break;
        }
    }
    for (var i = 0; i < b.length; i++){
        if (i < 2){
            g += c[i] * b[i];
        }else{
            g += parseInt(value.charAt(i - 1)) * b[i];
        }
    }
    if ((10 - (g % 10)) != f){
        return false;
    }
    return true;
}

//只能輸入英文數字
function checkEnNum(string) {
	var re = /^[a-zA-Z\d]+$/;
	if (!re.test(string))
		return false;
	return true;
}

//只能輸入中文英文數字
function checkCnEnNum(string) {
	var re = /^[a-zA-Z\d\u4E00-\u9FA5]+$/;
	if (!re.test(string))
		return false;
	return true;
}