	var serverURL = "http://140.121.197.130:8004/BBDPPatient/ProfilePictureServlet?option=uploadProfilePicture";
	var patientID = window.localStorage.getItem('login');

	var pictureSource;
	var destinationType;
	var selectPictrue = "";		//圖片路徑

	$(document).ready(function() {
		//顯示大頭貼
		$("#profilePicture").empty();
		$("#profilePicture").append("<img style='height:30vw; width:30vw; margin-top: 6vw; object-fit:cover;' src='http://140.121.197.130:8004/BBDPPatient/ProfilePictureServlet?option=getProfilePicture&patientID="+patientID+"' onerror='failToLoadProfilePicture();'/>");

		document.addEventListener("deviceready", onDeviceReady, false); 	//偵測事件
		function onDeviceReady() {       
			pictureSource=navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;    
		}       		
	});

	function failToLoadProfilePicture(){
		$("#profilePicture").empty();
		$("#profilePicture").append("<img src='img/user.png' style='margin-top: 6vw;height:30vw'/>");
	}

	//取得相簿中的相片
    function getPhoto(source) {
		selectPictrue = "";
		
        /*Camera Plugin Code*/
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType : source,
            mediaType:Camera.MediaType.PICTURE,
        });
        
        /*
        navigator.camera.getPicture(onPhotoURISuccess,
									function(error){console.log("取得相片失敗！")},
									{quality:50,
									destinationType: Camera.DestinationType.FILE_URL ,
									sourceType : source,
									mediaType:Camera.MediaType.PICTURE,
									allowEdit:true, //出现裁剪框
								    targetWidth:200,//图片裁剪高度
								    targetHeight:200 });//图片裁剪高度
                                    */
    }

    function onSuccess(imageData) {
           console.log(imageData);
           /*Crop Image Plugin Code*/
           plugins.crop(function success (data) {
               checkFileSize(data);
           }, 
            function fail () {},
            imageData, {quality:100});
    }

     function onFail(message) {
        console.log('Failed because: ' + message);
     }

    //取得照片成功後
	function checkFileSize(imageURI) {
        window.resolveLocalFileSystemURI(
            imageURI, 
            function(fileEntry) {
                fileEntry.file(function(fileObj) {
                    console.log("Size = " + fileObj.size);								
                    if(fileObj.size>5242880){	//5MB
                        navigator.notification.alert('檔案大小請勿超過5MB',function(){imageURI = "";},'提醒','確定');	
                    }
                    else{	//上傳照片
                        console.log("照片路徑:" + imageURI);	//照片路徑
                        selectPictrue = imageURI;	//設定照片路徑
                        upload(selectPictrue, serverURL);		//上傳照片	
                    }					
                },
                function (error) {});
            },
            function (error) {});				
    }

	//上傳檔案
	function upload(fileURL, SERVER) {
		//上傳成功           
		var success = function (r) {					
			//SpinnerDialog
			if(device.platform=="Android"){
				SpinnerDialog.hide();
			}
			else if(device.platform=="iOS"){
				window.plugins.spinnerDialog.hide();
			}			
			navigator.notification.alert('修改大頭照成功',function(){},'提醒','確定');
			console.log("上傳成功! Code = " + r.responseCode);							
			location.reload();		//重新整理
		}
 
		//上傳失敗
		var fail = function (error) {
			//清空原有參數
			selectPictrue = "";
			//SpinnerDialog
			if(device.platform=="Android"){
				SpinnerDialog.hide();
			}
			else if(device.platform=="iOS"){
				window.plugins.spinnerDialog.hide();
			}					
			navigator.notification.alert('修改大頭照失敗',function(){},'提醒','確定');
		}

		var options = new FileUploadOptions();
			
		options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
			
		//options.chunkedMode = true;	//設置 chunkedMode 選項 false ，防止將上載到 Nginx 伺服器的問題。
		
		//上傳參數
		var params = new Object();
		params.patientID = patientID;
		params.type = "picture";

		options.params = params;			
		
		var ft = new FileTransfer();
		ft.onprogress = function (e) {
			console.info(e);
			if (e.lengthComputable) {
				//console.log('上傳進度：' + e.loaded / e.total);
			}
			//SpinnerDialog
			if(device.platform=="Android"){
				SpinnerDialog.show("上傳中", "請稍後...", function(){});
			}
			else if(device.platform=="iOS"){
				window.plugins.spinnerDialog.show("上傳中", "請稍後...", function(){});
			}
		}

		ft.upload(fileURL, encodeURI(SERVER), success, fail, options);				
	}