function videoCapture() {
    //開始錄影（最長錄影時間：15秒）
	navigator.device.capture.captureVideo(onSuccess, onError, {duration: 15});
 
	//錄影成功
	function onSuccess(mediaFiles) {
		var i, path, len;
		//遍历获取录制的文件（iOS只支持一次录制一个视频或音频）
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
		console.log(mediaFiles);
		path = mediaFiles[i].fullPath;
		alert("錄影成功!\n\n"
			+ "檔案名稱：" + mediaFiles[i].name + "\n"
			+ "檔案大小：" + mediaFiles[i].size + "\n\n"
			+ "localURL地址：" + mediaFiles[i].localURL + "\n\n"
			+ "fullPath地址：" + path);
		}
	}
 
               //錄影失敗
	function onError(error) {
		//alert("錄影取消");
		//alert("錄影取消\n(錯誤碼:" + error.code + ")");
		navigator.notification.alert('錄影取消', '錄影取消');
	}
}
		  
function imageCapture() {

	var options = {
		limit: 1
	};

	navigator.device.capture.captureImage(onSuccess, onError, options);

	function onSuccess(mediaFiles) {
		var i, path, len;
				
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			path = mediaFiles[i].fullPath;
			console.log(mediaFiles);
			alert("拍照成功!\n\n"
				+ "檔案名稱：" + mediaFiles[i].name + "\n"
				+ "檔案大小：" + mediaFiles[i].size + "\n\n"
				+ "localURL地址：" + mediaFiles[i].localURL + "\n\n"
				+ "fullPath地址：" + path);
		}
	}

	function onError(error) {
		//navigator.notification.alert('拍照取消' + error.code, null, 'Capture Error');
		navigator.notification.alert('拍照取消', '拍照取消');		  
	}
			
}