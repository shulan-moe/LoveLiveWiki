var card_filter = {
	ButSet:['rar','att','cha'],
	ButSetNum:[3,3,9],
	server:"",
	callBack:"",
	ini:function(multi,server,callBack){
		this.callBack = callBack;
		this.server = server;
		this.CreatTab();
		this.iniCls();
		this.iniButEv(multi);
		document.getElementById('post_filter_request').addEventListener('click',function(){
			card_filter.PostRequest(server);
		})
	},
	CreatTab:function(){
		  // $(function() {
			// $( "input[type=submit], a, button" )
			  // .button()
			  // .click(function( event ) {
				// event.preventDefault();
			  // });
		  // });
		  // $(function() {
			// $( "#check" ).button();
			// $( "#format0" ).buttonset();
			// $( "#format1" ).buttonset();
			// $( "#format2" ).buttonset();
		  // });
		var txt = '<fieldset style="margin: auto; padding: 20;width:500px;"><legend>篩選</legend><table id = "card_filter_tab" align = "center"><tr><td><div id="format0">'+
			'<input type="checkbox" id="rar_0"><label id="lrar_0" style = "width:3.5em" for="rar_0">R</label></br>'+
			'<input type="checkbox" id="rar_1"><label id="lrar_1" style = "width:3.5em" for="rar_1">SR</label></br>'+
			'<input type="checkbox" id="rar_2"><label id="lrar_2" style = "width:3.5em" for="rar_2">UR</label></br></br>'+
			'<input type="checkbox" id="rar_-1"><label id="lrar_-1" style = "width:3.5em" for="rar_-1">All</label></br>'+
			'</div></td><td><div id = "format1">' +
			'<input type="checkbox" id="att_0"><label id="latt_0" style = "width:4.5em" for="att_0">Smile</label></br>'+
			'<input type="checkbox" id="att_1"><label id="latt_1" style = "width:4.5em" for="att_1">Pure</label></br>'+
			'<input type="checkbox" id="att_2"><label id="latt_2" style = "width:4.5em" for="att_2">Cool</label></br></br>'+
			'<input type="checkbox" id="att_-1"><label id="latt_-1" style = "width:4.5em" for="att_-1">All</label></br>'+
			'</div></td><td><div id = "format2">' +
			'<input type="checkbox" id="cha_0"><label id = "lcha_0" style = "width:3em" for="cha_0">果</label>'+
			'<input type="checkbox" id="cha_1"><label id = "lcha_1" style = "width:3em" for="cha_1">海</label>'+
			'<input type="checkbox" id="cha_2"><label id = "lcha_2" style = "width:3em" for="cha_2">鳥</label></br>'+
			'<input type="checkbox" id="cha_3"><label id = "lcha_3" style = "width:3em" for="cha_3">希</label>'+
			'<input type="checkbox" id="cha_4"><label id = "lcha_4" style = "width:3em" for="cha_4">繪</label>' +
			'<input type="checkbox" id="cha_5"><label id = "lcha_5" style = "width:3em" for="cha_5">妮</label></br>' +
			'<input type="checkbox" id="cha_6"><label id = "lcha_6" style = "width:3em" for="cha_6">凜</label>'+	
			'<input type="checkbox" id="cha_7"><label id = "lcha_7" style = "width:3em" for="cha_7">花</label>'+
			'<input type="checkbox" id="cha_8"><label id = "lcha_8" style = "width:3em" for="cha_8">姬</label></br></br>'+
			'<input type="checkbox" id="cha_-1"><label id = "lcha_-1" style = "width:10em" for="cha_-1">All</label></div></td>' +
			'</table><div align = "center"><a id = "post_filter_request">Filter</a></input></div></fieldset>'
		
		document.getElementById("llwiki-card-filter-tab-div").innerHTML = txt;
		//document.getElementById("cha_8").checked = true;
	},
	iniCls:function(){
		document.getElementById("post_filter_request").className = "ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all";
		document.getElementById("post_filter_request").style.padding = "0.5em";
		ButSet = card_filter.ButSet;
		ButSetNum = card_filter.ButSetNum;
		for (var i=0;i<ButSet.length;i++){
			for(var j=-1;j<ButSetNum[i];j++){
				document.getElementById('l'+ButSet[i]+'_'+j).className = "ui-button ui-widget ui-state-default ui-button-text-only ui-corner-all";
				document.getElementById(ButSet[i]+'_'+j).className = "ui-helper-hidden-accessible";
				//document.getElementById('l'+ButSet[i]+'_'+j).style.height = "1.8em";
				document.getElementById('l'+ButSet[i]+'_'+j).style.padding = "0.3em";
			}
		}
	},
	iniButEv:function(multi){
		ButSet = card_filter.ButSet;
		ButSetNum = card_filter.ButSetNum;
		for (var i=0;i<ButSet.length;i++){
			if (!multi){
				for (var j=-1;j<ButSetNum[i];j++){
					var But = document.getElementById(ButSet[i]+'_'+j);
					But.addEventListener('change',function(){
						card_filter.ButAction(this);
					});
				}
			}
		}
	},
	ButAction:function(obj){
		//alert(document.getElementById("post_filter_request").className);
		var tmp = obj.id.split('_');
		var nam = tmp[0];
		var id = parseInt(tmp[1]);
		var num = 3;
		if (nam=='att')
			num = 3;
		if (nam=='cha')
			num = 9;
		if (id!=-1){
			for (var i=-1;i<num;i++){
				if (i==id){
					if (!obj.checked){
						if (num==3){
							$("#l"+ nam+'_' + i).removeClass("ui-state-active");
							$("#l"+ nam+'_' + i).addClass("ui-state-default");	
						}
						else
							document.getElementById(nam+'_'+id).checked = true;
					}
					else{
						$("#l"+ nam+'_' + i).removeClass("ui-state-default");
						$("#l"+ nam+'_' + i).addClass("ui-state-active");
					}
				}
				else if (document.getElementById(nam+'_'+i).checked == true && (num>3||i==-1)){					
					document.getElementById(nam+'_'+i).checked = false;
					$("#l"+ nam+'_' + i).removeClass("ui-state-active");
					$("#l"+ nam+'_' + i).addClass("ui-state-default");					
				}
			}
		}
		else if(obj.checked){
			for (var i=-1;i<num;i++){
				document.getElementById(nam+'_' + i).checked = obj.checked;
				$("#l"+ nam+'_' + i).removeClass("ui-state-default");
				$("#l"+ nam+'_' + i).addClass("ui-state-active");
			}
		}
		else{
			for (var i=-1;i<num;i++){
				document.getElementById(nam+'_' + i).checked = obj.checked;
				$("#l"+ nam+'_' + i).removeClass("ui-state-active");
				$("#l"+ nam+'_' + i).addClass("ui-state-default");
			}			
		}
	},
	PostRequest:function(){		
		ButSet = card_filter.ButSet;
		ButSetNum = card_filter.ButSetNum;
		var postData = new Object;
		for (var i=0;i<ButSet.length;i++){
			var numSelected = 0;
			postData[ButSet[i]] = new Array();
			for (var j=0;j<ButSetNum[i];j++){
				if (document.getElementById(ButSet[i]+'_' + j).checked){
					postData[ButSet[i]][numSelected] = j;
					numSelected++;
				}
			}
			if (numSelected == 0 || numSelected ==ButSetNum[i] ){
				postData[ButSet[i]] = new Array(1);
				postData[ButSet[i]][0] = -1;
			}
		}
		if (postData.cha==-1){
			alert("Character must be selected");
			return;
		}
		document.getElementById("llwiki-filter-result").innerHTML = '<img src = "http://llsif.noip.me/loading.gif"/>';
		//alert(JSON.stringify(postData));
		$.get(card_filter.server,{condition:postData} ,function(data,status){
			data = JSON.parse(data);
			//var data = ["279","366","164","133","198","428","474","455","956"];
			eval(card_filter.callBack+'(data)');
		})
		
		
	},
	PushRes:function(id){
		document.getElementById('llwiki-CardIdInput').value = id;
	}
}