		//改網址用的
		//var url = "HealthTrackingServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/HealthTrackingServlet";
		
		//一進來就取得新增紀錄項目
		$(document).ready(function() {
			$("#display").empty();
			//一進來先得到存在local storage的patientID值並顯示出來
			var patientID = window.localStorage.getItem('login');
			
			$.ajax({
				url : url,
				data : {
					state : "newHealthItemDefault",
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					var item;
					for(var number = 0; number < response.iDList.length; number++){
						var itemNumber = "item" + response.iDList[number];	//項目數字
						var itemName = returnEscapeCharacter(response.nameList[number]);			//項目名稱
						var docotrName = response.docotrNameList[number];	//醫生名稱
						var hospital = response.hospitalList[number];		//醫院
						var department = response.departmentList[number];	//科別

						//$("#display").append("<div class='row'><button type='submit' class='btn btn-block' id='"+itemNumber+"' onclick='"+itemButton(itemNumber, itemName)+"' style='text-decoration:none;'>"+itemName+"</button><hr></div>");
						$("#display").append(
								"<div class='col-xs-12 col-sm-12'>"+
								"	<div class='row' style='background:#FFFDDB; border:#767676 0.2vw solid;' onclick=itemAdd('"+itemNumber+"')>"+
								"		<div class='col-xs-2 col-sm-2' style='padding-top:5vw;padding-bottom:5vw;'>"+
								"			<img src='img/pencil.png'  width='100%' height='auto'>"+
								"		</div>"+
								"		<div class='col-xs-10 col-sm-10' style='padding-top:2vw;'>"+
								"			<p class='basicText' style='color:#000000;'>"+itemName+"</p>"+
								"			<p class='basicText'>"+hospital+"</p>"+
								"			<p class='basicText'>"+department+""+docotrName+"</p>"+
								"		</div>"+
								"	</div>"+
								"</div>");
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});
		
		function itemAdd(itemNumber){
			window.location.href = 'NewHealthTracking.html?itemID='+itemNumber;
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