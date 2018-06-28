		//貼上細項(空值)
		function getPage(response, buttonID){
			$("#display").empty();
			var temp = "";
			if(buttonID == "updateHealth"){		//看要不要顯示日期
				var showTime = time.substr(0, 10) + " " + time.substr(11, 2) + ":" + time.substr(14, 2);
				temp = "<p style='float:right;color:C9C9C9;font-Size:3.5vw'>"+showTime+"</p><div style='height:5vw;'></div>";
			}
			$("#display").append(
					"	<div style='height:2vw;'></div>"+
					"	<p class='basicText' style='color:#000000'>"+returnEscapeCharacter(response.itemName)+"</p>"+temp+
					"	<hr color='#999999' style='height:0.1vw;'><div style='height:1vw;'></div>");
			for(var number = 0; number < response.iDList.length; number++){
				var detailNumber = response.iDList[number];				//細項數字
				var detailName = returnEscapeCharacter(response.nameList[number]);				//細項名稱
				var detailUnit = response.unitList[number];				//細項單位
				var detailRange_1 = response.range_1List[number];		//細項合理值(下限)
				var detailRange_2 = response.range_2List[number];		//細項合理值(上限)

				if(detailUnit == 'NULL'){	//如果單位為NULL 就不要顯示
					detailUnit = "";
				}
				$("#display").append(
						"<p class='basicText' style='text-align: left'>"+detailName+"：</p>"+
						"<input type='number' class='form-control inputLg' id='"+detailNumber+"' min='"+detailRange_1+"' max='"+detailRange_2+"' placeholder='"+detailUnit+"'>"+
						"<div style='height:6vw;'></div>");
			}
			/*如果有文字敘述在加*/
			if(response.selfDescription == 1){
				$("#display").append(
						"<p class='basicText' style='text-align: left'>症狀描述：</p>"+
						"<input type='text' class='form-control inputLg' id='selfDescriptionValue' placeholder='簡單說明您的症狀'>"+
						"<div style='height:6vw;'></div>");
			}
			
			/*按鈕*/
			var buttonHtml = "<center><button type='button' class='btn btn-pink btn-lg' id='"+buttonID+"' style='outline: none;' >";


			if(buttonID == "updateHealth"){		//編輯紀錄
				buttonHtml += "修改";
			}
			else if(buttonID == "addHealth"){	//新增紀錄
				buttonHtml += "新增";
			}
			buttonHtml += 
					"</button></center>"+
					"<div style='height:6vw;'></div>";
			$("#display").append(buttonHtml);
		}
		
		//新增或編輯紀錄
		function setValue(response, buttonID){
			$("#"+buttonID).click(function() {
				var iDList = response.iDList;
				var range_1List = response.range_1List;
				var range_2List = response.range_2List;
				var selfDescription = response.selfDescription;
				
				//一進來先得到存在local storage的patientID值
				var patientID = window.localStorage.getItem('login');
	
				//取得輸入的欄位值
				var detailValueArray = new Array();
				var detailValue, range_1, range_2;
				var flag = false;
				for(var i=0; i<iDList.length; i++){
					detailValueArray[i] = $("#"+iDList[i]+"").val();
					detailValue = detailValueArray[i];
					range_1 = range_1List[i];
					range_2 = range_2List[i];
					//console.log("detailValueArray[i] : " +detailValueArray[i]);
					
					flag = judgeInput(detailValue, range_1, range_2);
					if(!flag){
						break;
					}
				}
				
				if(flag && judgeSelfDescription(selfDescription)){
					if(selfDescription == 0)
						var selfDescriptionValue = "";
					else if(selfDescription == 1)
						var selfDescriptionValue = htmlEscapeCharacter($("#selfDescriptionValue").val());

					var data;
					var href;
					if(buttonID == "updateHealth"){		//編輯紀錄
						href = 'HealthTrackingList.html';
						data = {
								state : "updateHealth",
								patientID : patientID,
								itemNumber : response.itemID,
								detailIdArray : iDList,
								detailValueArray : detailValueArray,
								selfDescriptionValue : selfDescriptionValue,
								time : time,
								healthTrackingID : healthTrackingID
							};
					}
					else if(buttonID == "addHealth"){	//新增紀錄
						href = 'SelectItemHealthTracking.html';
						data = {
								state : "addHealth",
								patientID : patientID,
								itemNumber : itemID,
								detailIdArray : iDList,
								detailValueArray : detailValueArray,
								selfDescriptionValue : selfDescriptionValue,
							};
					}
					$.ajax({
						url : urlAjax,
						data : data ,
						dataType : "json",
		
						success : function(response) {
							$("#display").empty();
							console.log(response.result);
							navigator.notification.alert(
								response.result,
								function(){window.location.href=href;},
								'提醒',
								'確定'
							);
						},
						error : function() {
							console.log("錯誤訊息");
						}
					});
				}
			});
		}
		
		//判斷是否有輸入及輸入是否合理
		function judgeInput(detailValue, range_1, range_2){
			var flag=true;
			if(detailValue==""){
				flag=false;
				console.log("請填寫所有欄位");
				navigator.notification.alert(
					"請填寫所有欄位",
					function(){},
					'提醒',
					'確定'
				);
			}
			else if((range_1!="NULL" && parseFloat(detailValue)<parseFloat(range_1))||(range_2!="NULL" && parseFloat(detailValue)>parseFloat(range_2))){
				flag=false;
				console.log("輸入的值不合理");
				navigator.notification.alert(
					"輸入的值不合理",
					function(){},
					'提醒',
					'確定'
				);
			}
			return flag;
		}
		
		//判斷是否有輸入文字敘述及輸入是否合理//可輸入可不用輸入，因此直接回傳true即可
		function judgeSelfDescription(selfDescription){
			var flag = true;
			/*if(selfDescription == 1){
				if($("#selfDescriptionValue").val() == ""){
					flag = false;
					console.log("請填寫症狀描述欄位");
					navigator.notification.alert(
						"請填寫症狀描述欄位",
						function(){},
						'提醒',
						'確定'
					);
				}
			}*/
			return flag;
		}
		
		//取得現在時間
		function getNowDate(){
			var timeDate= new Date();
			var tMonth = (timeDate.getMonth()+1) > 9 ? (timeDate.getMonth()+1) : '0'+(timeDate.getMonth()+1);
			var tDate = timeDate.getDate() > 9 ? timeDate.getDate() : '0'+timeDate.getDate();
			var tHours = timeDate.getHours() > 9 ? timeDate.getHours() : '0'+timeDate.getHours();
			var tMinutes = timeDate.getMinutes() > 9 ? timeDate.getMinutes() : '0'+timeDate.getMinutes();
			var tSeconds = timeDate.getSeconds() > 9 ? timeDate.getSeconds() : '0'+timeDate.getSeconds();
			timeDate= timeDate.getFullYear()+'/'+ tMonth +'/'+ tDate +' '+ tHours +':'+ tMinutes +':'+ tSeconds;
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