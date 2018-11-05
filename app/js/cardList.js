function GetIdxByID(ID){
	for(var i=0;i<card.length;i++){
		if(card[i].ID==ID)
			return i;}
	return -1;
}
function Reset(){
	for(var i=0;i<card.length;i++){
		card[i].hideflag = 0;}
}
function ReorganizeAtt(att){
	var temp = new Array(9)
	temp[0] = att[0]
	temp[1] = att[3]
	temp[2] = att[6]
	temp[3] = att[1]
	temp[4] = att[4]
	temp[5] = att[7]
	temp[6] = att[2]
	temp[7] = att[5]
	temp[8] = att[8]
	return temp
}
function GetStringFromProp(mode,input,input2,input3){
	switch (mode){
		case "name" :
			if (input2==""){
				return input}
			else{
				return input + '<br><font color="#808080">' + input2 + '</font>'}
		case "rarity" :
			if (input==1){
				return "R"}
			else if(input==2){
				return "<b>SR</b>"}
			else if (input == 3){
				return '<font color="blue"><b>UR</b></font>'}
			else if (input ==4){
				return '特'}
			else {return "error"}
		case "prop" :
			if (input == 0){
				return '<font color = "red">Smile</font>'}
			else if (input == 1){
				return '<font color = "#008000">Pure</font>'}
			else if (input == 2){
				return '<font color = "blue">Cool</font>'}
			else{return "error"}
		case "skill" :
			return input + '<br>' + input2
		case "center" :
		//GetStringFromProp("center",card[i].centski,card[i].prop,card[i].rar)
			if (input == 0){
				if (input3==1){//R
					if (input2 == 0){
						return 'Smile Power<br>Smile P小幅提升(+3%)'}
					else if (input2 == 1){
						return 'Pure Power<br>Pure P小幅提升(+3%)'}
					else if (input2 == 2){
						return 'Cool Power<br>Cool P小幅提升(+3%)'}
					else {return "error"}
					}
				if (input3==2){//SR
					if (input2 == 0){
						return 'Smile Heart<br>Smile P提升(+6%)'}
					else if (input2 == 1){
						return 'Pure Heart<br>Pure P提升(+6%)'}
					else if (input2 == 2){
						return 'Cool Heart<br>Cool P提升(+6%)'}
					else {return "error"}
					}
				if (input3==3){//UR
					if (input2 == 0){
						return 'Smile Princess<br>Smile P大幅提升(+9%)'}
					else if (input2 == 1){
						return 'Pure Angel<br>Pure P大幅提升(+9%)'}
					else if (input2 == 2){
						return 'Cool Empress<br>Cool P大幅提升(+9%)'}
					else {return "error"}
					}
				}
				else if (input==1){
				return GetStringFromProp("center",0,input2,1);}
				else if (input ==3){//-1
					if (input2 == 0){
						return 'Smile Empress<br>Smile P隨著Cool P提升(+12%)'}
					else if (input2 == 1){
						return 'Pure Princess<br>Pure P隨著Smile P提升(+12%)'}
					else if (input2 == 2){
						return 'Cool Angel<br>Cool P隨著Pure P提升(+12%)'}
					else {return "error"}
				}
				else if (input==4){//+1
					if (input2 == 0){
						return 'Smile Angel<br>Smile P隨著Pure P提升(+12%)'}
					else if (input2 == 1){
						return 'Pure Empress<br>Pure P隨著Cool P提升(+12%)'}
					else if (input2 == 2){
						return 'Cool Princess<br>Cool P隨著Smile P提升(+12%)'}
					else {return "error"}
				}
				else {return "error";}
		case "ID" :
			if (input<100){
				return '0' + String(input)}
			else{return String(input)}
		default:
			return "error"
	}
}
function GenTabFromPage(thisPage){
	currentPage = thisPage;
	ClearAll();
	GenerateTab(thisPage);
}
function FilpPage(dir){
	if (dir=="next")
		if (currentPage==totalPage)
			alert("This is the last page");
		else
			GenTabFromPage(currentPage+1);
	else if (dir == "previous")
		if (currentPage==1)
			alert("This is the first page");
		else
			GenTabFromPage(currentPage-1);
	return 
}
function ChangeRowsPerPage(){
	NumPerPage = document.getElementById("SelRowPerPage").value;
	ClearAll();
	GenerateTab(1);
}
function GenPageList(numPage,thisPage){
	var divNam = "llwiki-memberInfo-PageList";
	var dotFlag = new Array();
	dotFlag[0] = thisPage>3?true:false;
	dotFlag[1] = thisPage<numPage-2?true:false;
	document.getElementById(divNam).innerHTML = "";
	var txt = "";
	if (thisPage!=1)
		txt += '<span style="cursor:pointer" onclick = "GenTabFromPage(1)"><u>1</u></span>&nbsp;&nbsp;';
	if (dotFlag[0])
		txt += "<span>......</span>&nbsp;&nbsp;"
	if (thisPage>2)
		txt += '<span style="cursor:pointer" onclick = "GenTabFromPage(' + (thisPage-1) + ')"><u>' + (thisPage-1) + '</u></span>&nbsp;&nbsp;';	
	txt += '<span><font color = "red">' + thisPage + "</font color></span>&nbsp;&nbsp;";
	if (thisPage<numPage-1)
		txt += '<span style="cursor:pointer" onclick = "GenTabFromPage(' + (thisPage+1) + ')"><u>' + (thisPage+1) + '</u></span>&nbsp;&nbsp;';
	if (dotFlag[1])		
		txt += "<span>......</span>&nbsp;&nbsp;"
	if (thisPage!=numPage)
		txt += '<span style="cursor:pointer" onclick = "GenTabFromPage(' + numPage + ')"><u>' + numPage + '</u></span>';
	//alert(txt);
	document.getElementById(divNam).innerHTML = txt;
	
	var offsetHeight = document.getElementById('tab').offsetHeight;
	
	//document.getElementById("llwiki-memberInfo-PreviousPage").style.height = offsetHeight;
	$("#llwiki-memberInfo-PreviousPage").css("height",offsetHeight);
	$("#tab").parent().parent().css("height",offsetHeight);
	//document.getElementById("llwiki-memberInfo-NextPage").style.height = offsetHeight;
	$("#llwiki-memberInfo-NextPage").css("height",offsetHeight);
	return;
}
function GenerateTab(thisPage){
/* 属性说明
ID = 卡牌序号
rar = 稀有度
	R=0,SR=1,UR=2
img = 头像地址
name = 卡牌名称
det = 名称备注(比如xxx时间追加
prop = 卡牌属性
	smile=0,pure=1,cool=2
	若留空，则取能力最大值
stm = 一级体力
att = 人物一级属性
	[smile,pure,cool]
skinam = 技能名称
skides = 技能描述
skicls = 技能分类
	A1 = Note/Combo/Prefect加分		A2 = 时间加分	A3 = 分数到达xxx加分
	B1 = Note/Combo判定				B2 = 时间判定
	C1 = Note/Combo回血				C2 = 时间回血
	若有多重属性，则skicls = "A1+A11"
centski = 主唱技能
	无 = 常规 (比如R对应smile/pure/cool力量,SR对应smile/pure/cool Heart)
	国服尚未开放其他Center技能*/
	var tab = document.getElementById('tab')
	var ii = 0;
	for (var i=0;i<card.length;i++){
	//for (var i=(thisPage-1)*NumPerPage;i<thisPage*NumPerPage;i++){
		if (card[i].hideflag||card[i].avail==0){
			continue}
		ii++
		if (ii>(thisPage-1)*NumPerPage && ii <thisPage*NumPerPage+1){
			var Tr = tab.insertRow(tab.rows.length)
			if (ii%2!=0)
				{Tr.style.background = "#eef6ff"}

			var Td = new Array(11)
			for (var j=0;j<11;j++){			
				Td[j] = Tr.insertCell(j);
				Td[j].align = "center";
				Td[j].className = "td";
				}
			Td[0].innerHTML = GetStringFromProp("ID",card[i].ID)
			if (card[i].ID<1)
				pid = "0" + card[i].ID;
			else
				pid = card[i].ID;
			var imgpath = "http://llsif.noip.me/icon/" + pid + "_icon.png";
			var img_idopath = "http://llsif.noip.me/icon/" + pid + "_icona.png";
			Td[1].innerHTML = '<img style = "width:64px;height:64px" onmouseover="fn_mouseover()" onmouseout="fn_mouseout()" src="'+ imgpath +'" />';
			Td[1].innerHTML += '<img style = "width:64px;height:64px" onmouseover="fn_mouseover()" onmouseout="fn_mouseout()" src="'+ img_idopath +'" />';
			//Td[1].height = "70px";
			var rarity = GetStringFromProp("rarity",card[i].rar,null);
			var name = card[i].name.replace("(",rarity + "<br>(");
			Td[2].innerHTML = name;
			//Td[3].innerHTML = GetStringFromProp("rarity",card[i].rar,null);
			//Td[4].innerHTML = GetStringFromProp("prop",card[i].prop,null)
			var att = ReorganizeAtt(card[i].att)
			for (var j=3;j<9;j++){
				//alert(((j-5)%3)==card[i].prop)
				if (((j-3)%3)==card[i].prop){
					Td[j].width = "30px";
					switch (card[i].prop) {
						case 0:
							Td[j].innerHTML = '<b><font color = "red">' + String(att[j]) + "</font></b>"
							break
						case 1:
							Td[j].innerHTML = '<b><font color = "#008000">' + String(att[j]) + "</font></b>"
							break
						case 2:
							Td[j].innerHTML = '<b><font color = "blue">' + String(att[j]) + "</font></b>"
							break
						default:
							Td[j].innerHTML = "error"
					}
				}
				else{
					Td[j].innerHTML = att[j]}			
			}
			Td[9].innerHTML = GetStringFromProp("skill",card[i].skinam,card[i].skides)
			Td[10].innerHTML = GetStringFromProp("center",card[i].centski,card[i].prop,card[i].rar)
		}
	}
	var numPage = Math.ceil(ii/NumPerPage);
	totalPage = numPage;
	currentPage = thisPage;
	GenPageList(numPage,thisPage)
}
function ClearAll(){
	var Table = document.getElementById('tab')
	 for(var i=Table.rows.length-1;i>=2;i--)
    {
        Table.deleteRow(i);
    }
}
function SelectFromOption(){
	var namelist = new Array(4)
	namelist[0] = ["none","r_r","r_sr","r_ur","r_all"]
	namelist[1] = ["c_smile","c_pure","c_cool","c_all"]
	namelist[2] = ["none","ho" ,"eli" ,"kot","umi","rin","maki","noz","ha","nic","char_all"]
	namelist[3] = ["none","skill_sn","skill_sp","skill_sc","skill_st","skill_ss","skill_dn","skill_dp","skill_dc","skill_dt","none","skill_hn","skill_hp","skill_hc","skill_ht","skill_all"]
	for (var ii=0;ii<namelist.length;ii++){
		namelength = namelist[ii].length-1		
		if (document.getElementById(namelist[ii][namelength]).checked){
			continue}//If "all" is selected, skip this namelist and check next one
		var checklist = new Array(namelength)
		var contflag = 1;
		for(var i=0;i<namelength;i++){
			if (namelist[ii][i]=="none"){
				checklist[i] = false;
				continue;}
			checklist[i] = document.getElementById(namelist[ii][i]).checked
			if (!checklist[i]){contflag=0} // If one of the checkbox is not selected, do the following
		}
		if (contflag){
			continue}
		var r_list = new Array(namelength)
		//alert(namelength)
		for(var i=0;i<namelength;i++){
			if (checklist[i]){
				r_list[i]=99}
			else{
				r_list[i]=i}
		}
		//alert(r_list)
		for(var i=0;i<card.length;i++){
			switch (ii){
				case 0:
					comp = card[i].rar
					break;
				case 1:
					comp = card[i].prop
					break;
				case 2:
					comp = card[i].cha
					break;
				case 3:
					comp = card[i].skicls
					break;
				default:
					return
			}
			for(var j=0;j<namelength;j++){
				if(comp==r_list[j]){
				card[i].hideflag = 1;}
			}
		}
	}
	//return card
}
function SelectedList(){
	Reset()
	ClearAll()
	SelectFromOption()	
	GenerateTab(1)
}
function UpdateCheckBox(n_array,n_all,name){
if (name==n_all){
	if(document.getElementById(name).checked){
		for(var i=0;i<n_array.length;i++){
			document.getElementById(n_array[i]).checked = true
		}			
	}
	else{
		for(var i=0;i<n_array.length;i++){
			document.getElementById(n_array[i]).checked = false	
		}
	}
}
else if(!document.getElementById(name).checked){
	document.getElementById(n_all).checked = false
}
}
function check(name,skipflag1,skipflag2,skipflag3){
if (arguments.length<4)
	skipflag3 = false;
if (arguments.length<3)
	skipflag2 = false;
if (arguments.length<2)
	skipflag1 = false;
var n_array = new Array()
var n_all = ""
if (name=="r_r" || name=="r_sr"||name =="r_ur"||name == "r_all"){
	n_array = ["r_r" ,"r_sr" ,"r_ur"]
	n_all = "r_all"}
else if (name=="c_smile"||name=="c_pure"||name=="c_cool"||name=="c_all"){
	n_array = ["c_smile" ,"c_pure" ,"c_cool"]
	n_all = "c_all"}
else if (name=="ho"||name=="eli"||name=="kot"||name=="umi"||name=="rin"||name=="maki"||name=="noz"||name=="ha"||name=="nic"||name=="char_all"){
	n_array = ["ho" ,"eli" ,"kot","umi","rin","maki","noz","ha","nic"]
	n_all = "char_all"}
else if (name.indexOf("skill_s")>-1){
	n_array = ["skill_sn" ,"skill_sp" ,"skill_sc","skill_st","skill_ss"]
	n_all = "skill_s"}
else if (name.indexOf("skill_d")>-1){
	n_array = ["skill_dn" ,"skill_dp" ,"skill_dc","skill_dt"]
	n_all = "skill_d"}
else if (name.indexOf("skill_h")>-1){
	n_array = ["skill_hn" ,"skill_hp" ,"skill_hc","skill_ht"]
	n_all = "skill_h"}
if ((n_array.length>0) *(1-skipflag1*1)){
	UpdateCheckBox(n_array,n_all,name)}
	
n_all = new Array()
if (skipflag2)
	return
if (name == "skill_s"|| name == "skill_d"|| name =="skill_h"|| name == "skill_all"){
		n_array = ["skill_s" ,"skill_d" ,"skill_h"]
		n_all = "skill_all"	
		UpdateCheckBox(n_array,n_all,name)
		if (!skipflag3){
			for(var i=0;i<n_array.length;i++){
				check(n_array[i],0,1)
			}
		}
	}
else if(name.indexOf("skill")>-1){
	check(name.substring(0,name.length-1),1,0,1)
}
}
	
function FilltFromTable(){
	Reset();
	SelectFromOption();
	/*var tab = document.getElementById('tab')
	var numrow = tab.rows.length-2
	var IDlist = new Array(numrow)
	for(var i=0;i<numrow;i++){
		IDlist[i] = parseInt(tab.rows.item(2+i).cells.item(0).innerHTML,10)
	}
	for (var i=0;i<card.length;i++){
		card[i].hideflag = 1;
		for (var j=0;j<numrow;j++){
			if (card[i].ID==IDlist[j]){
				card[i].hideflag = 0;
				break;}
		}
	}*/
	//return card;
}
function ExchangeFlag(comp,mode){
if (mode){//升序
	if (comp[0]>comp[1]){
		return 1}
	else{
		return 0}
}
else{
	if (comp[0]>comp[1]){
		return 0}
	else{
		return 1}
}
}
function sort(tag){
	var id = tag;
	var mode = 0//降序
	var comp = Array(2)
	if (/^[a-z]+$/.test(tag[0])){
		var temp = tag.toUpperCase()
		tag = temp[0]+tag.slice(1)
		mode = 1//小写,升序
	}	
	FilltFromTable()
	for (var i=0;i<card.length-1;i++){
		for(var j=i+1;j<card.length;j++){
			if (card[j].hideflag){
				continue}
			switch(tag){
				case "No":
					comp[0] = card[i].ID;
					comp[1] = card[j].ID;
					break;
				case "Name":
					comp[0] = card[i].cha;
					comp[1] = card[j].cha;
					break;
				case "Rarity":
					comp[0] = card[j].rar;
					comp[1] = card[j].rar;
					break;
				case "Smile1":
					comp[0] = card[i].att[0];
					comp[1] = card[j].att[0];
					break;
				case "Smile2":
					comp[0] = card[i].att[1];
					comp[1] = card[j].att[1];
					break;
				case "Smile3":
					comp[0] = card[i].att[2];
					comp[1] = card[j].att[2];
					break;
				case "Pure1":
					comp[0] = card[i].att[3];
					comp[1] = card[j].att[3];
					break;
				case "Pure2":
					comp[0] = card[i].att[4];
					comp[1] = card[j].att[4];
					break;
				case "Pure3":
					comp[0] = card[i].att[5];
					comp[1] = card[j].att[5];
					break;
				case "Cool1":
					comp[0] = card[i].att[6];
					comp[1] = card[j].att[6];
					break;
				case "Cool2":
					comp[0] = card[i].att[7];
					comp[1] = card[j].att[7];
					break;				
				case "Cool3":
					comp[0] = card[i].att[8];
					comp[1] = card[j].att[8];
					break;	
				default:
					alert("error in sort")
			}
			if(ExchangeFlag(comp,mode)){
				var tempobj = card[j]
				card[j] = card[i];
				card[i] = tempobj;
			}
		}
	}
	if(mode==0){
	var temp = tag.toLowerCase()
	tag = temp[0]+tag.slice(1)
	}//大写

	document.getElementById(id).id=tag;
	ClearAll()
	GenerateTab(currentPage)
}

function fn_mouseover(){
	event = getEvent()
	var td = event.srcElement||event.target
	cardID = parseInt(td.parentElement.parentElement.cells[0].innerHTML,10)
	var point_s = getMousePoint(event);
	var point = {
		x:event.clientX,
		y:event.clientY
	};
	tid = setTimeout( function(){ShowWindows(point,point_s,cardID)}, 500 );
	
}
function ShowWindows(point,point_s,ID){
	var height =  document.body.clientHeight;
	//var x = document.getElementById("p-.E6.B4.BB.E5.8A.A8").clientWidth
	//var y = document.getElementById("mw-head").clientHeight
	var x = $('#bodyContent').length > 0?document.getElementById("bodyContent").offsetLeft:0;
	var y = $('#bodyContent').length > 0?document.getElementById("bodyContent").offsetTop:0;
	point_s.x -= x;
	point_s.y -= y;
	//alert(point_s.y)
	if (point.y > height*0.5){
		point_s.y -= 450}
	Idx = GetIdxByID(ID)
	if (Idx>=0){
		if (!(card[Idx].cardimg=="" && card[Idx].cardimg_id=="")){
			var e = document.getElementById("Layer1");
			e.style.left = String(point_s.x) + "px"
			e.style.top = String(point_s.y) + "px"
			//document.getElementById("Layer1").style.left = point_s.x;
			//document.getElementById("Layer1").style.top = point_s.y;

			document.getElementById("Layer1").innerHTML = GetImgDes(Idx)
			//document.getElementById("Layer1").innerHTML ='<img src="'+ card[Idx].cardimg +'" /><img hspace = 20 src="' + card[Idx].cardimg_id + '"/>'; 
			document.getElementById("Layer1").style.display = "block";}
			//alert(document.getElementById("Layer1").style.top)
	}
}
function showdetail(){
	if (document.getElementById("sk_det").checked){
		document.getElementById("suppski").style.display = "block";
		document.getElementById("self-exp").style.display = "none";
		}
	else{
		document.getElementById("suppski").style.display = "none";
		document.getElementById("self-exp").style.display = "block";
		}
}
function init(){
		var rawFile = new XMLHttpRequest();
		var allText = "";
		rawFile.open("GET", 'http://llsif.noip.me/DATAfiles/CardDataBase.json',false);
		rawFile.onreadystatechange = function (){
			if(rawFile.readyState === 4){
				if(rawFile.status === 200 || rawFile.status == 0){
					allText = rawFile.responseText;
				}
			}
		}
		rawFile.send(null);
	card = JSON.parse(allText);
	Reset()
	SelectFromOption()
	GenerateTab(currentPage)
}
