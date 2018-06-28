//診間推播
//給QRCodeScannerHandler.js呼叫
function clinicPush(doctorID, patientID) {
	var message = "{\"doctorID\":\"" + doctorID + "\",\"patientID\":\"" + patientID + "\",\"option\":\"clinicPush\"}";		//要傳給醫生的訊息
	var websocket = new WebSocket('ws://140.121.197.130:8004/BBDPDoctor/PushServerEndpoint');
	websocket.onopen = function() {
		this.send(message);
		this.close();
	};
	websocket.onmessage = function(event) {
		this.close();
	};
	websocket.onerror = function() {};
	websocket.onclose = function(event) {};
}

//提醒推播
//傳送提醒推播給醫生端
//title: 病患姓名
//body: 病患姓名 + 的巴金森氏症問卷已填寫完畢 or  病患姓名 + 傳送了一個檔案
//hyperlink: 檔名+get參數
//type: questionnaire, folder
function remindPush(doctorID, patientID, title, body, hyperlink, type) {
	var message = "{\"doctorID\":\"" + doctorID + "\",\"patientID\":\"" + patientID + "\",\"option\":\"remindPush\",\"title\":\"" + title + "\",\"body\":\"" + body + "\",\"hyperlink\":\"" + hyperlink + "\",\"type\":\"" + type + "\"}";		//要傳給醫生的訊息
	var websocket = new WebSocket('ws://140.121.197.130:8004/BBDPDoctor/PushServerEndpoint');
	websocket.onopen = function() {
		this.send(message);
		this.close();
	};
	websocket.onmessage = function(event) {
		this.close();
	};
	websocket.onerror = function() {};
	websocket.onclose = function(event) {};
	
	$.ajax({
		type: "POST",
		url: "http://140.121.197.130:8004/BBDPDoctor/NotificationServlet",		//沒錯!是BBDPDoctor
		data: {
			option: "newRemindPush",
			message: message
		},
		dataType: "text",
		success: function(response) {
			
		},
		error: function() {
			console.log("remindPushHandler.js newRemindPush error");
		}
	});
}