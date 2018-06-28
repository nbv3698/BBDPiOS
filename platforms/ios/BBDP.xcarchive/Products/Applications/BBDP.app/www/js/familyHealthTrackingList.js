		//改網址用的
		//var url = "HealthTrackingServlet";
		var url = "http://140.121.197.130:8004/BBDPPatient/HealthTrackingServlet";
		
		var urlLocal = decodeURI(window.location.href);			//取得目前的網址
		var patientID = urlLocal.split("&")[0].split("=")[1];	//家屬id
		var healthtrackingLimit= urlLocal.split("&")[1].split("=")[1];		//查看該家屬的xxx權限 （1：開放 0:不開放）

		if(healthtrackingLimit==1){
		
		//一進來顯示所有紀錄
		$(document).ready(function() {
			//清空
			$("#display").empty();
			
			//給予初始日期
			var now = new Date();
		    var month = (now.getMonth() + 1);
		    var day = now.getDate();
		    if(month < 10)
		        month = "0" + month;
		    if(day < 10) 
		        day = "0" + day;
		    var today = now.getFullYear() + '-' + month + '-' + day;
		    $("#dateEnd").val(today);
			
			$.ajax({
				url : url,
				data : {
					state : "historyRecord",
					patientID : patientID
				},
				dataType : "json",
	
				success : function(response) {
				    //取得最早日期
					$("#dateStart").val(response.dateStart.substring(0, 10));
					//限制選取範圍，開始日期不可大於結束日期，結束日期不可小於開始日期
					 $("#dateStart").attr({	
					    	"max" : dateEnd
					    });
					 $("#dateEnd").attr({
					    	"min" : dateStart
					    });
					//取得下拉選單的值
					for(var number = 0; number < response.itemNameList.length; number++){
						var itemName = response.itemNameList[number];		//item Name
						var optionValue = response.optionValueList[number];	//item ID
						$("#healthType").append("<option value='"+optionValue+"'>"+itemName+"</option>");
					}
					
					//印出列表
					printList(response);
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		});
		
		function editHealth(healthIDPlusTime){
			//window.location.href = 'EditHealthTracking.html?healthIDPlusTime='+ healthIDPlusTime;
		}
		
		
		function selectDate(){
			 var dateStart = $('#dateStart').val();
			 var dateEnd = $('#dateEnd').val();
			 
			 //限制選取範圍，開始日期不可大於結束日期，結束日期不可小於開始日期
			 $("#dateStart").attr({	
			    	"max" : dateEnd
			    });
			 $("#dateEnd").attr({
			    	"min" : dateStart
			    });
			 changeList();
		}
		
		//選擇日期後顯示的紀錄
		function changeList(){
			var select = $("#healthType :selected").text();
			select = $("#healthType :selected").val();

			//清空
			$("#display").empty();
			
			//取得選取的日期
			var dateStart = $("#dateStart").val();
			var dateEnd = $("#dateEnd").val();
			dateEnd = getAfterOneDay(dateEnd);	//dateEnd日期加一

			$.ajax({
				url : url,
				data : {
					state : "historyRecordChangeList",
					patientID : patientID,
					select : select,
					dateStart : dateStart,
					dateEnd : dateEnd
				},
				dataType : "json",
	
				success : function(response) {
					//印出列表
					printList(response)
				},
				error : function() {
					console.log("錯誤訊息");
				}
			});
		}
		//印出列表
		function printList(response){
			//如果沒有紀錄的話顯示"無紀錄"
			if(response.itemIDList.length == 0)
				$("#display").append(
						"<div><center><br><p class='basicText' style='font-size:6vw'>無健康追蹤紀錄</p></center></div>");
			//顯示所有紀錄
			for(var i=0; i<response.itemIDList.length; i++){
				var divID = response.healthIDPlusTimeList[i];
				var itemTime = response.itemTimeList[i];
				
				//印出時間
				var html =
					"<div class='col-xs-12 col-sm-12'>"+
					"	<div class='row' style='background:#FFFDDB; border:#767676 0.2vw solid;' id='"+divID+"' onclick=editHealth('"+divID+"')>"+
					"		<div class='col-xs-2 col-sm-2' style='padding-top:5vw;padding-bottom:5vw;'>"+
					"			<img src='img/cardiogram.png' width='100%' height='auto'>"+
					"		</div>"+
					"		<div class='col-xs-10 col-sm-10' style='padding-top:2vw;'>"+
					"			<p class='basicText'>"+itemTime+"</p>";
				//暫存的arrayList
				var detailIDList = response.detailIDList[i];
				var detailNameList = response.detailNameList[i];
				var detailValueList = response.detailValueList[i];
				var detailUnitList = response.detailUnitList[i];
				var detailLowerLimitList = response.detailLowerLimitList[i];
				var detailUpperLimitList = response.detailUpperLimitList[i];
				var needDayton = false;
				//印出細項、值、單位
				for(var number=0; number<detailIDList.length; number++){
					var detailName = detailNameList[number];
					var detailValue = detailValueList[number];
					var detailUnit = detailUnitList[number];
					var detailLowerLimit = detailLowerLimitList[number];
					var detailUpperLimit = detailUpperLimitList[number];

					if(detailUnit == 'NULL'){	//如果單位為NULL 就不要顯示
						detailUnit = "";
					}
					html += 
						"		<p class='basicText' style='color:#000000;'>"+detailName+"："+detailValue+" "+detailUnit+"</p>";
						
					//判斷是否印出警示值
					var warningString = "";
					if(parseFloat(detailValue)>parseFloat(detailUpperLimit)){
						warningString += 
							"		<p class='basicText' style='color:red'>"+detailName+"高於"+detailUpperLimit+"</p>";
					}
					if(parseFloat(detailValue)<parseFloat(detailLowerLimit)){
						warningString += 
							"		<p class='basicText' style='color:red'>"+detailName+"低於"+detailLowerLimit+"</p>";
					}
					html += warningString;
				}
				html += "</div></div></div>";
				$("#display").append(html);
			}
		}
		
		
		/*取得隔天的日期*/
        function getAfterOneDay(date) { 
            var arr = date.split('-'); 
            var year = arr[0]; 	//獲取當前日期的年份
            var month = arr[1]; //獲取當前日期的月份 
            var day = arr[2]; 	//獲取當前日期的日 
            var days = new Date(year, month, 0); 
            days = days.getDate(); //獲取當前日期的月的天數
            var year2 = year; 
            var month2 = parseInt(month)	//解析當前月份成int	
            var day2 = parseInt(day); 		//解析當前日期成int	
            
            if (day2 == days) { //如果現在日期等於這個月份最後一天
                day2 = 1; 		//日期變為1
                month2 += 1; 	//月份加1
            } 
            else
            	day2 += 1;		//如果不等於最後一天//日期加1
            if (month2 == 13) { //如果月份變為13
                month2 = 1; 	//月份變為1
            	year2 = parseInt(year2) + 1;	//年分加1 
            } 
            if (month2 < 10) { 
                month2 = '0' + month2; 
            } 
            if (day2 < 10) { 
            	day2 = '0' + day2; 
            }
            var t2 = year2 + '-' + month2 + '-' + day2; 
            return t2; 
        } 
		}