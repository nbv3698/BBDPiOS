		//改網址用的
		//var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		var localUrl = window.location.href;
		var urlparts = localUrl.split("?");
		var IDparts = urlparts[1].split("=");
		var patientInstructionID = IDparts[1];
		
		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		var page = localStorage.getItem("page");;
		$(document).ready(function(){
			localStorage.removeItem("page");
			getTitle();	//取得文章標題
		});	
		
		//取得文章標題
		function getTitle(){
			$.ajax({
				url : url,
				data : {
					state : "getInstruction",
					patientInstructionID : patientInstructionID
				},
				dataType : "json",
	
				success : function(response) {
					$("#title").append(response.title);
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//去新增留言
		function newComment(){
			if($("#comment_1").val() == ""){
				console.log("請輸入留言");
				navigator.notification.alert("請輸入留言", function(){}, "提醒", "確定");
			}
			else{
			var hideImg;
				if(document.getElementsByName("hideImg")[0].checked)
					hideImg = "1";
				else
					hideImg = "0";
				//新增留言
				$.ajax({
					url : url,
					data : {
						state : "newComment",
						patientInstructionID : patientInstructionID,
						patientID : patientID,
						comment_1 : htmlEscapeCharacter($("#comment_1").val()),
						hideImg : hideImg
					},
					dataType : "json",
		
					success : function(response) {
						if(response.flag){
							remindPush(response.doctorID, patientID, response.name, response.name+"回覆了"+response.title+"文章", "EditPatientInstructionComment.html?patientInstructionID="+patientInstructionID, "patientInstuction");	//推播
							navigator.notification.alert("已成功留言", function(){window.location.href= "PatientInstruction.html?patientInstructionID="+patientInstructionID+"&from="+page;}, "提醒", "確定");
						}
					},
					error : function() {
						console.log("錯誤訊息");
					}
				});
			}
		}
		
		//返回衛教資訊
		function goToInstruction(){
			window.location.href= "PatientInstruction.html?patientInstructionID="+patientInstructionID+"&from="+page;
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