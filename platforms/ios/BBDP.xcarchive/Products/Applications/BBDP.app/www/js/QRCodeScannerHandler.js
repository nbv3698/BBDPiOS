var user = window.localStorage.getItem('login');

function scan(){
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(!result.cancelled){
				if(result.format == "QR_CODE"){
					//alert("Barcode type is: " + result.format);
					//alert("QR Code內容: " + result.text);	//QR Code內容 (取得醫生ID)

					$.ajax({
						type: "GET",
						url: "http://140.121.197.130:8004/BBDPPatient/ClinicPushServlet",
						data: {option : "getDoctorName", scanText : result.text},
						dataType: "text",
														
		 				success : function(response){
		 					if(response != ""){
								clinicPush(result.text, user);
								navigator.notification.alert("已傳送診間推播給"+response+"醫師", null, "提醒", "確定");
		 					}
		 					else{
		 						navigator.notification.alert("查無該醫師資料", null, "提醒", "確定");
		 					}
									
						},
						error : function(xhr, ajaxOptions, thrownError){
							console.log("Server沒有回應");
						}
					});
					
				}
			}
		},
		function (error) {
			navigator.notification.alert("掃描失敗", null, "提醒", "確定");
		}
	);
}