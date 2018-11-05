var tid
function getEvent(){ //同时兼容ie和ff的写法 
        if(document.all)   return window.event;    
        func=getEvent.caller;        
        while(func!=null){  
            var arg0=func.arguments[0];
            if(arg0){
				var temp = typeof(arg0)=="object" * arg0.preventDefault * arg0.stopPropagation
				if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || temp){  
				return arg0;
              }
            }
            func=func.caller;
        }
        return null;
}
function getMousePoint(ev) {
	// 定义鼠标在视窗中的位置
	var point = {
		x:0,
		y:0
	};
 
	// 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
	if(typeof window.pageYOffset != 'undefined') {
		point.x = window.pageXOffset;
		point.y = window.pageYOffset;
	}
	// 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
	// IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
	else if (!(typeof document.compatMode == 'undefined' || document.compatMode == 'BackCompat')) {
		point.x = document.documentElement.scrollLeft;
		point.y = document.documentElement.scrollTop;
	}
	// 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
	else if(typeof document.body != 'undefined') {
		point.x = document.body.scrollLeft;
		point.y = document.body.scrollTop;
	}
 
	// 加上鼠标在视窗中的位置
	point.x += ev.clientX;
	point.y += ev.clientY;
 
	// 返回鼠标在视窗中的位置
	return point;
}

function fn_mouseout(){
	document.getElementById("Layer1").innerHTML = ""; 
	document.getElementById("Layer1").style.display = "none"; 
	clearTimeout( tid );
}
function GetCenSki(c,mode){
	//mode = 1,return name
	//mode = 2,return description
	var temp = ""
	if (c.centski==0){
		if (c.rar==1){//R or Special
			if (c.prop == 0){		
				temp = 'Smile Power<br>Smile P小幅提升(+3%)'}
			else if (c.prop == 1){
				temp =  'Pure Power<br>Pure P小幅提升(+3%)'}
			else if (c.prop == 2){
				temp =  'Cool Power<br>Cool P小幅提升(+3%)'}
			else {temp =  "error"}
		}
		else if (c.rar==2){//SR
			if (c.prop == 0){
				temp =  'Smile Heart<br>Smile P提升(+6%)'}
			else if (c.prop == 1){
				temp =  'Pure Heart<br>Pure P提升(+6%)'}
			else if (c.prop == 2){
				temp =  'Cool Heart<br>Cool P提升(+6%)'}
			else {temp =  "error"}
		}
		else if (c.rar==3){//UR
			if (c.prop == 0){
				temp =  'Smile Princess<br>Smile P大幅提升(+9%)'}
			else if (c.prop == 1){
				temp =  'Pure Angel<br>Pure P大幅提升(+9%)'}
			else if (c.prop == 2){
				temp =  'Cool Empress<br>Cool P大幅提升(+9%)'}
			else {temp =  "error"}
		}
	}
	else if (c.centski==1){
		if (c.prop == 0){		
			temp = 'Smile Power<br>Smile P小幅提升(+3%)'}
		else if (c.prop == 1){
			temp =  'Pure Power<br>Pure P小幅提升(+3%)'}
		else if (c.prop == 2){
			temp =  'Cool Power<br>Cool P小幅提升(+3%)'}
		else {temp =  "error"}
	}
	else if (c.centski == 3){
		if (c.prop == 0){
			temp = 'Smile Empress<br>依照Cool P的數值Smile P提升(+12%)'}
		else if (c.prop == 1){
			temp = 'Pure Princess<br>依照Smile P的數值Pure P提升(+12%)'}
		else if (c.prop == 2){
			temp = 'Cool Angel<br>依照Pure P的數值Cool P提升(+12%)'}
		else {temp = "error"}
	}
	else if (c.centski == 4){
		if (c.prop == 0){
			temp = 'Smile Angel<br>依照Pure P的數值Smile P提升(+12%)'}
		else if (c.prop == 1){
			temp = 'Pure Empress<br>依照Cool P的數值Pure P提升(+12%)'}
		else if (c.prop == 2){
			temp = 'Cool Princess<br>依照Smile P的數值Cool P提升(+12%)'}
		else {temp = "error"}
	}
	var result = temp.split('<br>')
	return result[mode]
}
function FormatAttFromProp(att,prop){
	if(prop==0)
		return ('<font color="red"><b>' + att + '</b><color>')
	else if(prop==1)
		return ('<font color="#00cc33"><b>' + att + '</b><color>')
	else if(prop==2)
		return ('<font color="blue"><b>' + att + '</b><color>')
	else 
		return ('<font color="black"><b>' + att + '</b><color>')
}
function GetImgDes(Idx,Info){
	if (Info != undefined)
		var c = Info;
	else
		var c = card[Idx]
	
	var lv = new Array(3)
	if(c.rar==1)
		{lv = [60,40,1]}
	else if(c.rar==2)
		{lv = [80,60,1]}
	else if(c.rar==3)
		{lv = [100,80,1]}
	else
		{lv = [40,30,1]}
	var att = new Array(9)
	att[0] = c.att[2]
	att[1] = c.att[5]
	att[2] = c.att[8]
	att[3] = c.att[1]
	att[4] = c.att[4]
	att[5] = c.att[7]
	att[6] = c.att[0]
	att[7] = c.att[3]
	att[8] = c.att[6]
	/*<table border = 1 bgcolor="#FFFFFF">
	<tr>
		<td rowspan = 16 align="center"><img src="http://i2.tietuku.com/aa641dc3dd6ffa3d.jpg" /></td>
		<td rowspan = 16 align="center"><img src = "http://i2.tietuku.com/d1e5883964c2604b.jpg"/></td>
		<td colspan = 4 align="center">高板穗乃果<br> (职业篇)<br>2014年6月25日追加</td>	
	</tr>
	<tr><td align="center">LV</td><td align="center">Smile</td><td align="center">Pure</td><td align="center">Cool</td></tr>
	<tr><td align="center">1</td><td align="center">1000</td><td align="center">2000</td><td align="center">3000</td></tr>
	<tr><td align="center">1</td><td align="center">1000</td><td align="center">2000</td><td align="center">3000</td></tr>
	<tr><td align="center">1</td><td align="center">1000</td><td align="center">2000</td><td align="center">3000</td></tr>
	
	<tr><td colspan = 4 align = "center" style = "border-bottom:none "> 技能 </td></tr>
	<tr><td colspan = 4 align = "center" style = "border-bottom:none ;border-top:none"> μ's的活力 </td></tr>
	<tr><td colspan = 4 style = "border-top:none" width=120px align="center">每20个节奏图示就有36%的机率获得增强判定的状态，该状态持续3秒</td></tr>
	<tr><td colspan = 4 align = "center" style = "border-bottom:none "> Center技能 </td></tr>
	<tr><td colspan = 4 align = "center" style = "border-bottom:none;border-top:none"> Pure Angel </td></tr>
	<tr><td colspan = 4 style = "border-top:none">Pure大幅提升(+9%)</td></tr>
	</table>*/
	var iHTML = '<table border = 1 bgcolor="#FFFFFF"><tr>'


	if (c.rar!="4"){
	iHTML += '<td rowspan = 16 align="center"><img src="http://llsif.noip.me/card/' + c.ID + '.png" width="256px" /></td>'}
	
	if (c.det != "")
		{iHTML += '<td colspan = 4 align="center">' + c.name.replace("(","(") + "<br>" + c.det + '</td>'}
	else
		{iHTML += '<td colspan = 4 align="center">' + c.name.replace("(","(") + '</td>'}
	iHTML += '<td rowspan = 14 align="center"><img src="http://llsif.noip.me/card/' + c.ID + 'ru.png" width="256px" /></td></tr>'



	iHTML += '</tr><tr><td align="center">LV</td><td align="center"><font color = "red">Smile</font></td><td align="center"><font color = "#00cc33">Pure</font></td><td align="center"><font color = "blue">Cool</font></td></tr>'
	
	for (var i=0;i<3;i++){
		iHTML += '<tr><td align="center">' + String(lv[i]) + '</td>'
		for (var j=0;j<3;j++){
			var lclatt = String(att[i*3+j])
			if(c.prop==j)
				{lclatt = FormatAttFromProp(lclatt,c.prop)}
				iHTML += '<td align="center">' + lclatt + '</td>'
		}
		iHTML += '</tr>'
	}
	iHTML += '<tr><td colspan = 4 align = "center" style = "border-bottom:none "> 技能 </td></tr>'
	iHTML += '<tr><td colspan = 4 align = "center" style = "border-bottom:none ;border-top:none">' + c.skinam + '</td></tr>'
	iHTML += '<tr><td colspan = 4 style = "border-top:none" width=120px align="center">' + c.skides + '</td></tr>'
	iHTML += '<tr><td colspan = 4 align = "center" style = "border-bottom:none "> 主唱技能 </td></tr>'
	iHTML += '<tr><td colspan = 4 align = "center" style = "border-bottom:none;border-top:none"> ' + GetCenSki(c,0) + ' </td></tr>'
	iHTML += '<tr><td colspan = 4 align = "center" style = "border-bottom:none;border-top:none"> ' + GetCenSki(c,1) + ' </td></tr>'
	iHTML += '</table>';
	return iHTML
}

