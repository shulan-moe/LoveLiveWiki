var ScriptBrowser={
	picAdd:"",
	picExt:"",
	audAdd:"",
	postAdd:"",
	iniPara:function(picAdd,picExt,audAdd,postAdd){
		this.picAdd = picAdd;
		this.picExt = picExt;
		this.audAdd = audAdd;
		this.postAdd = postAdd;
	},
	PostRequest:function(){
		document.getElementById("llwiki-script-result").innerHTML = '<img src = "http://llsif.noip.me/loading.gif"/>';
		var CardID = document.getElementById('llwiki-CardIdInput').value;
		//alert(CardID);
		/***************************************************************/
		$.get(ScriptBrowser.postAdd,{type:"select", cid:CardID} ,function(data,status){
			if (data.indexOf("0 results")>-1)
				document.getElementById("llwiki-script-result").innerHTML = '卡牌未更新';
			else
				ScriptBrowser.GenPage(data);
			})
		/***************************************************************/
		/*var data = 
		ScriptBrowser.GenPage(data);*/
		/***************************************************************/
	},
	GenPage:function (data){
		var scripts = JSON.parse(data);
		var txt = "";
		var IDString = "";
		var CardID = parseInt(document.getElementById('llwiki-CardIdInput').value);
		IDString = String(CardID);
		txt += '</br><img src = "'+ScriptBrowser.picAdd + IDString + '_icon' + ScriptBrowser.picExt + '"/><img src = "'+ScriptBrowser.picAdd + IDString + '_icona' + ScriptBrowser.picExt + '"/><br>'
		txt += "<b>*技能語音</b></br>";
		for (var i=0;i<scripts.length;i++){
			var s = scripts[i];
			if (s.type=="1"){
				txt += s.vid + "," +  s.script + "</br>";
				if (s.script_cn!="na")
					txt += s.vid + "," +  s.script_cn + "</br>";
				txt += ScriptBrowser.Player(s.path);
				break;
			}
		}
		txt += "</br><b>*隨機語音</b></br>"
		for (var i=0;i<scripts.length;i++){
			var s = scripts[i];
			if (s.type=="7"){
				txt += s.vid + "," +  s.script + "</br>";
				if (s.script_cn!="na")
					txt += s.vid + "," +  s.script_cn + "</br>";
				txt += ScriptBrowser.Player(s.path);
			}
		}
		txt += "</br><b>*日期節慶語音</b></br>"
		for (var i=0;i<scripts.length;i++){
			var s = scripts[i];
			if (s.type=="5"){
				txt += s.vid + ","  + s.script + "(" + s.date  + ")" + "</br>";
				if (s.script_cn!="na")
					txt += s.vid + ","  + s.script_cn + "(" + s.date  + ")" + "</br>";
				txt += ScriptBrowser.Player(s.path);
			}
		}
		
		for (var i=0;i<scripts.length;i++){
			var s = scripts[i];
			if (s.type=="6"){
				txt += s.vid + ","  + s.script + "(" + s.time + ")" + "</br>";
				if (s.script_cn!="na")
					txt += s.vid + ","  + s.script_cn + "(" + s.time + ")" + "</br>";
				txt+= ScriptBrowser.Player(s.path);
			}
		}
		txt += "</br><b>*觸摸語音</b></br>"
		for (var i=0;i<scripts.length;i++){
			var s = scripts[i];
			if (s.type=="8"){
				txt += s.vid + ","  + s.script + "</br>";
				if (s.script_cn!="na")
					txt += s.vid + ","  + s.script_cn + "</br>";
				txt+= ScriptBrowser.Player(s.path);
			}
		}
		
		txt += "</br><b>*功能語音</b></br>"
		for (var i=0;i<scripts.length;i++){
			var s = scripts[i];
			if (s.type=="4"){
				txt += s.vid + ","  + s.script + ScriptBrowser.FunString(parseInt(s.fun_id),parseInt(s.fun_typ))  + "</br>";
				if (s.script_cn!="na")
					txt += s.vid + ","  + s.script_cn + ScriptBrowser.FunString(parseInt(s.fun_id),parseInt(s.fun_typ))  + "</br>";
				txt +=  ScriptBrowser.Player(s.path);
			}
		}
		
		document.getElementById("llwiki-script-result").innerHTML = txt;
		//alert("2");
	},
	Player:function(path){
		if (path == "na")
			return '</br>';
		return  '<audio controls preload = "none"><source src="' + ScriptBrowser.audAdd + path.replace(".mp3",".ogg") + '" type="audio/mp3">Your browser does not support the audio element.</audio></br>';
		
	},
	FunString:function(FunId, FunTyp){
		 switch (FunId)
				{
					case 1:
						switch (FunTyp)
						{
							case 1:
								return "(新劇情)";
							case 2:
								return "(未達成目標)";
							case 3:
								return "(新Live)";
							case 4:
								return "(LP見底)";
							case 5:
								return "(商店界面)";
							case 6:
								return "(可以特訓)";
							case 7:
								return "(社員界面)";
							case 8:
								return "(有禮物)";
							case 9:
								return "(免費招募)";
							case 10:
								return "(未讀消息)";
							case 11:
							case 12:
								return "(有活動)";
							case 13:
								return "(客串?)";
						}
						break;
					case 2:
						if (FunTyp ==1)
							return "(下載介面)";
						else
							return "(FunId:" + FunId + ",FunTyp" + FunTyp + ")";
					case 3:
						if (FunTyp==1)
							return "(劇情界面)";
						else
							return "(FunId:" + FunId + ",FunTyp" + FunTyp + ")";
					case 4:
						if (FunTyp == 1)
							return "(商店界面)";
						else
							return "(FunId:" + FunId + ",FunTyp" + FunTyp + ")";
					case 5:
						if (FunTyp == 1)
							return "(Live成功)";
						else if (FunTyp == 2)
							return "(Live失敗)";
						else if (FunTyp == 4)
							return "(開始Live)";
						else
							return "(FunId:" + FunId + ",FunTyp" + FunTyp + ")";
					case 7:
						if (FunTyp == 1)
							return "(好友界面)";
						else
							return "(FunId:" + FunId + ",FunTyp" + FunTyp + ")";
					case 8:
						if (FunTyp == 1)
							return "(社員界面)";
						else
							return "(FunId:" + FunId + ",FunTyp" + FunTyp + ")";
					case 9:
						if (FunTyp == 1)
							return "(Live結算)";
						else if (FunTyp == 2)
							return "(覺醒絆滿)";
					default:
						return " ";
					 
				}



	}
}