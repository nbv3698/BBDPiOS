		//改網址用的
		//var urlAjax = "HealthTrackingServlet";
		var urlAjax = "http://140.121.197.130:8004/BBDPPatient/HealthTrackingServlet";
		
		var url = window.location.href;
		var urlparts = url.split("?");
		var IDparts = urlparts[1].split("=");
		var itemID = IDparts[1];
		itemID = itemID.substring(4);
		
		$(document).ready(function() {
			$.ajax({
				url : urlAjax,
				data : {
					state : "newHealthDetail",
					itemNumber : itemID
				},
				dataType : "json",
	
				success : function(response) {
					var buttonID = "addHealth";
					getPage(response, buttonID);	//貼上細項(空值)
					setValue(response, buttonID);	//新增或編輯紀錄
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});