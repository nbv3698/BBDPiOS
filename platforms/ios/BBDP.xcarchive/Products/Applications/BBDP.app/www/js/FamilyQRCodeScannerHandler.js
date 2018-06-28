function familyScan(){
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(!result.cancelled){
				if(result.format == "QR_CODE"){
					//alert("Barcode type is: " + result.format);
					//alert("QR Code內容: " + result.text);
					window.location.href = 'FamilyInvitation.html';
					localStorage.setItem("scanAccount", result.text);
				}
			}
		},
		function (error) {
			navigator.notification.alert("掃描失敗", null, "提醒", "確定");
		}
	);
}