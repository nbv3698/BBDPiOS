		//改網址用的
		//var url = "PatientInstructionServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/PatientInstructionServlet";

		var localUrl = window.location.href;
		var patientInstructionID = localUrl.split("&")[0].split("=")[1];	
		var	page = localUrl.split("&")[1].split("=")[1];			
		
		//取得存在local storage的patientID值
		var patientID = window.localStorage.getItem('login');

		//一進來顯示所有紀錄
		$(document).ready(function() {
			getInstruction();	//取得單一衛教資訊
			isCollect();		//是否有收藏
		});
		
		//返回鍵
		function back(){
			if(page=="1")
				 window.location.href="AllOfPatientInstructions.html";
			else if(page=="2")
				 window.location.href="Subscription.html";
			else
				 window.location.href="PatientInstructionFavoriteList.html";	
		}		
		
		//取得單一衛教資訊//取得留言資訊//放在這裡，因為要改完字體在放
		function getInstruction(){
			$.ajax({
				url : url,
				data : {
					state : "getInstruction",
					patientInstructionID : patientInstructionID
				},
				dataType : "json",
	
				success : function(response) {
					$("#title").append(response.title);
					$("#hospital").append(response.hospital);
					$("#doctor").append(response.department+response.name+"醫師");
					$("#date").append("文章發佈時間："+response.date);
					$("#content").append(getImage(getVideo(response.content))+'<p style="font-size:4vw;color:#C9C9C9;float:right;font-weight: bold;">最後編輯時間：'+response.editDate+'</p>');
					adjustmentImgVideoCss(); //調整長寬
					changeWord();			//修改字體大小為vw
					getComment();			//取得留言資訊//放在這裡，因為要改完字體在放
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//調整長寬
		function adjustmentImgVideoCss(){
			$("#content img").css("height","auto");
			$("#content video").css("height","auto");
			$("#content img").css("max-width","100%");
			$("#content video").css("max-width","100%");
			$("#content iframe").css("height","auto");
		}
		
		//修改圖片位置
		function getImage(content){
			//var pattern = /<img.*?src=[\"'](.+?)[\"'].*?width:(.+?);.*?height:(.+?);.*?>/g; 
			var pattern = /<img.*?src=[\"'](.+?)[\"'].*?>/g; 
			var matches = content.match(pattern); 
			if(matches){
				for (var i=0; i<matches.length; i++){
					var temp = matches[i].match(pattern);
					var str = RegExp.$1;
					content = content.replace(RegExp.$1, url+"?state=getSrc&srcPath="+str);
				}
			}
			return content;
		}
				
		console.log("screenWidth : " + $(window).width());
		console.log("10px = " + changeVW(10) + "vw");

		//修改文字大小px變成vw
		function changeVW(px){
			//var screenWidth = $(window).width();
			var screenWidth = 360;
			var vw = px * 100 / screenWidth;
			return vw;
		}
		//修改文字大小為vw//p預設為14px//span動態//因為要符合標題們的大小，所以轉換完vw再加3
		function changeWord() {
			//p
		   var p = document.getElementsByTagName('p');
		   for(i=4;i<p.length-2;i++) {	//因為前面有標題等，有4個<p>，所以i從4開始,而後面有最後編輯時間及留言板，有兩個<p>，所以長度-2
			   p[i].style.fontSize = 0 + changeVW(14) +"vw";
		   }
		   //ul
		   var ul = document.getElementsByTagName('ul');
		   for(i=0;i<ul.length;i++) {	
			   ul[i].style.fontSize = 0 + changeVW(14) +"vw";
		   }
		   //li
		   var li = document.getElementsByTagName('li');
		   for(i=0;i<li.length;i++) {	
			   li[i].style.fontSize = 0 + changeVW(14) +"vw";
		   }
		   //span
		   var span = document.getElementsByTagName('span');
		   for(i=0;i<span.length;i++) {
		      if(span[i].style.fontSize) {
		    	  var px = parseInt(span[i].style.fontSize.replace("px",""));
		    	  span[i].style.fontSize = 0 + changeVW(px) +"vw";
		      }
		   }	
		}
		

		//修改影片位置
		function getVideo(content){
			var pattern = /<video.*?src=[\"'](.+?)[\"'].*?>/g; 
			var matches = content.match(pattern); 
			if(matches){
				for (var i=0; i<matches.length; i++){
					var temp = matches[i].match(pattern);
					var str = RegExp.$1;
					content = content.replace(RegExp.$1, url+"?state=getSrc&srcPath="+str);
				}
			}
			return content;
		}

		//取得留言資訊
		function getComment(){
			$.ajax({
				url : url,
				data : {
					state : "getComment",
					patientInstructionID : patientInstructionID
				},
				dataType : "json",
	
				success : function(response) {
					$("#comment").empty();
					for(var number=0; number<response.commentIDList.length; number++){
						var insertHtml = "";
						insertHtml += 
							"<div class='panel panel-danger' id='"+response.commentIDList[number]+"' style='font-size:4.5vw;'>"+
							"	<div class='panel-heading' style='background-color: #FFCBCB;'>"+
							"		<p style='color:000000;display:inline;'>"+response.nameList[number]+"</p>"+
							"		<p style='float:right'>"+response.time_1List[number]+"</p>"+
							"	</div>"+
							"	<div class='panel-body'>"+
							"		<div class='col-xs-3 col-sm-3' >";
						if(response.hideImgList[number] == "0"){
							insertHtml += 
							"			<img src='http://140.121.197.130:8004/BBDPPatient/ProfilePictureServlet?option=getProfilePicture&patientID="+response.patientIDList[number]+"' onerror=failToLoadProfilePicture('"+response.patientIDList[number]+"'); width='100%' height='auto' id='img"+response.patientIDList[number]+"'>";
						}
						else if(response.hideImgList[number] == "1"){
							insertHtml +=
							"			<img src='img/user.png' width='100%' height='auto'>";
						}
						insertHtml += 
							"		</div>"+
							"		<div class='col-xs-9 col-sm-9'>"+
							"			<p style='color:#000000;'>"+returnEscapeCharacter(response.comment_1List[number])+"</p>"+
							"		</div>"+
							"	</div>";
						if(response.time_2List[number] != null){
							insertHtml += 	
							"	<div class='panel-footer'>"+
							"		<p class='basicText'>醫師回覆：</p>"+
							"		<p class='basicText' style='color:#000000;'>"+returnEscapeCharacter(response.comment_2List[number])+"</p>"+
							"	</div>";
						}
						insertHtml += 	
							"</div>";
						$("#comment").append(insertHtml);
					}	
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
  
		//是否有收藏
		function isCollect(){
			$.ajax({
				url : url,
				data : {
					state : "isCollect",
					patientInstructionID : patientInstructionID,
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					if(response){
						heartAdd();	//有愛心
					}
					else{
						heartRemove();	//沒愛心
					}
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//新增收藏或取消收藏
		var thisImg;	//0尚未收藏，1已收藏
		function changeImg(){
			if(thisImg==0){
				heartAdd();	//有愛心
				newCollect();	//新增收藏
			}else{
				heartRemove();	//沒愛心
				deleteCollect();	//刪除收藏
			}
		}
		
		//新增收藏
		function newCollect(){
			$.ajax({
				url : url,
				data : {
					state : "newCollect",
					patientInstructionID : patientInstructionID,
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					if(response)
						navigator.notification.alert("已收藏此文章", function(){}, "提醒", "確定");
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		
		//刪除收藏
		function deleteCollect(){
			$.ajax({
				url : url,
				data : {
					state : "deleteCollect",
					patientInstructionID : patientInstructionID,
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
					if(response)
						navigator.notification.alert("已取消收藏", function(){}, "提醒", "確定");
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}

		//有愛心
		function heartAdd(){
			$("#favourite").prop("src", "img/addFavourite.png");
			thisImg=1;
		}
		
		//沒愛心
		function heartRemove(){
			$("#favourite").prop("src", "img/removeFavourite.png");
			thisImg=0;
		}
		
		//是當使用者沒有設定大頭照時會跑的function
		function failToLoadProfilePicture(id){
			$("#img"+id).attr("src", "img/user.png");
		}
		
		//去新增留言
		function goToComment(){
			localStorage.setItem("page", page);
			window.location.href= "NewComment.html?patientInstructionID="+patientInstructionID;
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