		//改網址用的
		//var urlAjax = "HealthTrackingServlet";
		var urlAjax = "http://140.121.197.130:8004/BBDPPatient/HealthTrackingServlet";
		
		var url = window.location.href;
		var urlparts = url.split("?");
		var IDparts = urlparts[1].split("=");
		var temp = IDparts[1].split("_");
		var time = temp[0];
		var healthTrackingID = temp[1];

		$(document).ready(function() {
			$.ajax({
				url : urlAjax,
				data : {
					state : "editHealthDetail",
					time : time,
					healthTrackingID : healthTrackingID
				},
				dataType : "json",
	
				success : function(response) {
					var buttonID = "updateHealth";
					getPage(response, buttonID);	//貼上細項(空值)
					getValue(response); 			//貼上細項值(有值)
					setValue(response, buttonID);	//新增或編輯紀錄
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});
		
		//貼上細項值(有值)
		function getValue(response){
			for(var number = 0; number < response.iDList.length; number++){
				$("#" + response.iDList[number]).val(response.detailValueList[number]);
			}
			/*如果有文字敘述在加*/
			if(response.selfDescription == 1){
				$("#selfDescriptionValue").val(returnEscapeCharacter(response.selfDescriptionValue));
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
		