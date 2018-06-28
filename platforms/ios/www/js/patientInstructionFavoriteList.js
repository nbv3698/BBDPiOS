		//改網址用的
		//var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');
		
		//一進來顯示所有紀錄
		$(document).ready(function() {
			changeSort();	//因為預設為收藏時間，所以因此取得收藏列表
		});
		
		//顯示收藏列表
		function showList(response){
			if(response.patientInstructionIDList.length == 0){
				$("#collectionList").append(
						"	<p style='color:767676;font-size:4.5vw;text-align:center;'>"+
						"			<br>無收藏"+
						"	</p>");
			}
			for(var number = 0; number < response.patientInstructionIDList.length; number++){
				$("#collectionList").append(
						"<a href='PatientInstruction.html?patientInstructionID="+response.patientInstructionIDList[number]+"&from=3' style='text-decoration:none'>"+
						"	<div style='border:#767676 0.2vw solid;font-size:4.5vw'>"+
						"		<div class='panel-heading' style='background-color: #FFCBCB;'>"+
						"			<p class='label' style='float:right;font-size:4.5vw;background-color:#888888'>"+returnEscapeCharacter(response.symptomList[number])+"</p>"+
						"			<p style='color:000000;display:inline;'>"+returnEscapeCharacter(response.titleList[number])+"</p>"+
						"		</div>"+
						"		<div class='panel-body'>"+
						"			<p style='color:767676;font-size:4vw;margin-bottom:-1vw'>"+response.hospitalList[number]+"-"+response.departmentList[number]+""+response.nameList[number]+"<br>"+response.dateList[number]+"</p>"+
						"		</div>"+
						"	</div>"+
						"</a>");
			}
		}
		
		///更改排序
		function changeSort(){
			$("#collectionList").empty();	//清空
			$.ajax({
				url : url,
				data : {
					state : "getFavoriteList",
					patientID : patientID,
					sort : $("#sort option:selected").val()
				},
				dataType : "json",
	
				success : function(response) {
					showList(response);	//顯示列表
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