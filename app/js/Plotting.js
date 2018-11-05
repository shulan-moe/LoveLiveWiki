function ConToAdd(ev,PredIdx){//Convert daily data to addition matrix
	var NumEv = ev.length;
	var Add = new Array(NumEv);
	for (var i=0;i<ev.length;i++){
		//if (i==PredIdx)
		if (i==PredIdx||ev[i].SM!=ev[PredIdx].SM)
			continue;
		Add[i] = new Array(2);
		for(var j=0;j<2;j++){
			Add[i][j] = new Array(ev[i].L[j].length)
			Add[i][j][0] = ev[i].L[j][0];
			for(var k=1;k<ev[i].L[j].length;k++)
				Add[i][j][k] = ev[i].L[j][k] - ev[i].L[j][k-1];
		}
	}
	//alert(Add)
	//Add.splice(6,1) //Delete SM data
	if (PredIdx!=-1)
		Add.splice(PredIdx,1); //Delete noncompleted data
	//Add.splice(6,1)
	var NumDel = 0;
	//alert(Add.length)
	for(var i=0;i<Add.length+NumDel;i++){
		if (typeof Add[i-NumDel] == "undefined"){
			Add.splice(i-NumDel,1);
			NumDel++;
		}
	}
/* 	for(var i=0;i<Add.length;i++){
		if (typeof Add[i-NumDel] == "undefined"){
			alert("123")
		}
	} */

	return Add
}
function GetProp(add){//Get Proportion from 10 days addition matrix
	var Num = add.length;
	var prop = new Array(Num);
	for(var i=0;i<Num;i++){
		prop[i] = new Array(2);
		for(var j=0;j<2;j++){
			prop[i][j] = new Array(10);
			var sum = eval(add[i][j].join('+'));
			for (var k=0;k<20;k++){
				prop[i][j][k] = add[i][j][k]/sum;
			}
		}
	}
	return prop
}
function StandardlizeLen(add,ev){//Normalize to 10 Days addition from addition matrix
	var Num = add.length;
	//alert(add[4])
	for (var i=0;i<Num;i++){
		//alert(i)
		//alert(add[i])
		for (var j=0;j<2;j++){
			if (add[i][j].length == 22){
				//alert("123")
				var adj = new Array(2);
				adj[0] = (add[i][j][15] + add[i][j][17]) / 2; // Take average of 8th and 9th days
				adj[1] = (add[i][j][16] + add[i][j][18]) / 2;
				add[i][j].splice(15,4,adj[0],adj[1]);
			}
			else if (add[i][j].length == 18){
				var adj = new Array(2);
				adj[0] = add[i][j][12]; // Repeat 8th day
				adj[1] = add[i][j][13];
				add[i][j].splice(13,0,adj[0],adj[1]);
			}
			else if (add[i][j].length ==20)
				continue;
			else{
				alert("error in NormlizeLen,Plotting.js")
			}
		//alert(add[i][j].length)
		}
	}
	return add
}
function AvgProp(p){ // Get averaged rate from proportion matrix
	var prop = new Array(2);
	prop[0] = new Array(10);
	prop[1] = new Array(10);
	if (p.length<3)
		N = 0;
	else if (p.length<20)
		var N=1;
	else
		var N = Math.floor(p.length/10);// Consider only 80% or 1, whichever is great of the data in the middle for each column
	//N = 1; //Test
	for (var i=0;i<20;i++){
		for (var j=0;j<2;j++){
			var max = new Array(N+1);
			var min = new Array(N+1); // N max/min + 1 temp
			for (k=0;k<=N;k++){ //inilize maximum and minimum vector
				max[k]=0;
				min[k]=1;
			}
			var sum = 0;
			for (var k=0;k<p.length;k++){
				sum += p[k][j][i];
				//alert(p[k][j][i])
				//alert(max[N])
				if (p[k][j][i] < min[N]){ //smaller than minimum
					min[N] = p[k][j][i];
					min.sort(function(a, b){return a-b});
					min[N] = min[N-1];
				}
				if (p[k][j][i] > max[N]){ //greater than maximum
					max[N] = p[k][j][i];
					max.sort(function(a, b){return b-a});
					max[N] = max[N-1];
					//alert(max[N])
				}
			}
			// Sum ,mix and max finished
			//alert(max.length)
			//alert(sum)
			//alert(max)
			//alert(min)
			if (N!=0)
				sum = sum - eval(max.join('+')) - eval(min.join('+')) + max[N] + min[N];
			prop[j][i] = sum/(p.length - N * 2);
		}
	}
	return prop;
}
function AdjToLen(p,L){ // Adjuest Standardlized 10days added proporion to given length, and return the accumulated proporion
	// Adjust for SM Event
	//p[0] = [0.063699,0.063202,0.035907,0.055834,0.031461,0.054699,0.030158,0.082091,0.025616,0.051233,0.025616,0.051233,0.025616,0.051233,0.025616,0.051233,0.025616,0.051233,0.025616,0.17309];
	//p[1] = [0.040114,0.058473,0.029247,0.056589,0.029313,0.056939,0.028789,0.057578,0.028789,0.057578,0.028789,0.057578,0.028789,0.057578,0.028789,0.057578,0.028789,0.057578,0.028789,0.18233];
	// using ratio between SM and Tradition
	/*var ratio = new Array(2);
	ratio[0] = [0.5450379,0.705455776,0.749366654,0.528033242,1.081795664,1.198438768,1.38138723,0.338735769,0.564126098,0.518040145,0.641986122,2.144159966,1.701677952,1.395801004,1.394590811,1.353507446,1.384250185,1.083908101,1.335712713,1.139321387];
	ratio[1] = [0.568821554,0.708829986,0.739303972,0.622731495,0.868833936,0.870688435,0.827937318,0.658341069,0.810725227,0.703083794,0.950397174,1.812942042,1.769480123,1.033430581,1.07306797,1.0221037,1.216118574,0.984307977,1.317255589,1.285206301];
	for (var i=0;i<2;i++)
		for(var j=0;j<20;j++)
			p[i][j]/=ratio[i][j];*/
	// Adjust for EX
		//p[0][p[0].length-1] *= 1.1;
		//p[1][p[1].length-1] *= 1.3;
	// Adjust Len
	if (L==9){
		p[0].splice(12,2);
		p[1].splice(12,2);}
	else if (L==11){
		p[0].splice(14,0,p[0][12],p[0][13]);
		p[1].splice(14,0,p[1][12],p[1][13]);}
	else if (L!=10){
		alert("Error in AdjToLen,Plotting.js")}
	// Accumulated
	for (var i=0;i<2;i++){
		var tmp = 0;
		for (var j=0;j<2*L;j++){
			tmp += p[i][j];
			p[i][j] = tmp;
		}
	}
	// Normalize
	for (var i=0;i<2;i++){
		for (var j=0;j<2*L-1;j++){
			p[i][j] /= p[i][2*L-1];
		}
		p[i][2*L-1] = 1;
	}
	return p;

}
function ParsePred(ev,PredIdx){
	if (PredIdx == -1)
		return 0; // prediction is not required
	var NumEv = ev.length - (PredIdx!=-1)*1;
	if ('p' in ev[NumEv]){
		return ev[NumEv].p;}
	var add = ConToAdd(ev,PredIdx);
	add = StandardlizeLen(add,ev);
	var prop = GetProp(add);
	prop = AvgProp(prop);
	prop = AdjToLen(prop,ev[PredIdx].Len);
	return prop;
}
function GetPredIdx(ev){
	var PredIdx = -1;
	for(var i=1;i<ev.length;i++){//Semi-absence of nico's data,start with i=1;
		if (ev[i].L[0].length < ev[i].Len*2){
			PredIdx = i;break;}
	}
	if (PredIdx==-1)
		return -1;
	if(ev[PredIdx].L[0].length<9999)
		return -1; //Not enough data for prediction
	return PredIdx;
}
function GetPredFromProp(p,L,t,ts){
	var Pred = new Array(ts);
	var Final = L[t-1]/p[t-1];
	for(var i=0;i<ts-1;i++){
		Pred[i] = Math.round(Final * p[t+i]);
	}
	Pred[ts-1] = Math.round(Final);
	return Pred;
}
function DateFormat(date){
var mm = date.getMonth()+1;
var dd = date.getDate();
var yy = date.getFullYear();
var res = "";
res += String(yy);
if (mm<10){res += ("/0" + String(mm));}
else{res += ("/" + String(mm));}
if (dd<10){res +=  "/0" + String(dd);}
else{res += ("/" + String(dd));}
return res;
}
function GetSeriesName(ev,mode,idx){
//mode:0=名字+日期,1=颜色
	var dat = DateFormat(ev.Start)
	var nam = "";
	var col = "";
	for (var i = 0; i < ev.Cha.length; i++) {
		switch (ev.Cha[i]){
			case 0:
				nam += "果";
				col = "#D2691E"
				break;
			case 1:
				nam += "鸟";
				col = "#808080"
				break;
			case 2:
				nam += "海";
				col = "#0066cc"
				break;
			case 3:
				nam += "希";
				col = "#800080"
				break;
			case 4:
				nam += "绘";
				col = "#00e3e3"
				break;
			case 5:
				nam += "妮";
				col = "#FF69B4"
				break;
			case 6:
				nam += "凛";
				col = "#efca00"
				break;
			case 7:
				nam += "阳";
				col = "#008000"
				break;
			case 8:
				nam += "姬";
				col = "#FF0000"
				break;
			case 9:
				if (mode)
					return "#808080";
				else
					return "7_瞎画的对比线"
			case 10:
				nam += "千";
				col = "#e17b00"
				break;
			case 11:
				nam += "梨";
				col = "#ef6e6e"
				break;
			case 12:
				nam += "南";
				col = "#19c89e"
				break;
			case 13:
				nam += "黛";
				col = "#ef2727"
				break;
			case 14:
				nam += "曜";
				col = "#62c4ef"
				break;
			case 15:
				nam += "善";
				col = "#b7b7b7"
				break;
			case 16:
				nam += "丸";
				col = "#d4bc00"
				break;
			case 17:
				nam += "鞠";
				col = "#ac5bef"
				break;
			case 18:
				nam += "露";
				col = "#e36cb8"
				break;
			case 20:
				nam += "步";
				col = "#ca4569"
				break;
			case 21:
				nam += "霞";
				col = "#dbd042"
				break;
			case 22:
				nam += "雫";
				col = "#71b8de"
				break;
			case 23:
				nam += "林";
				col = "#4974ca"
				break;
			case 24:
				nam += "爱";
				col = "#d06200"
				break;
			case 25:
				nam += "彼";
				col = "#a950bc"
				break;
			case 26:
				nam += "雪";
				col = "#ec191f"
				break;
			case 27:
				nam += "艾";
				col = "#64c321"
				break;
			case 28:
				nam += "璃";
				col = "#6f6c71"
				break;
			default:
				nam = "error"
				col = "#000000"
		}
	}
	if (mode)
		{return col;}
	else
		{return (String(idx) + '_' + nam + dat)}
}
function ImpSupAndSort(Fixed,Sup,L){ // Add daily sup into the data and sort to plot
	var TotNum = Fixed.length + Sup.length;
	//alert(Sup.length)
	var dat = new Array(TotNum);
	var F=0;//index of Fixed
	var S=0;//index of Sup
	Fixed[Fixed.length] = [299,0];
	Sup[Sup.length] = [299,0,0];
	//alert(TotNum)
	for(var i=0;i<TotNum;i++){
		dat[i] = new Array(2);
		//alert(Fixed[F][0] + "/" + Sup[S][0])
		//alert(Fixed[F][0]<Sup[S][0])
		if(Fixed[F][0]<Sup[S][0]){
			dat[i] = Fixed[F];
			F++;
		}
		else{
			dat[i] = [Sup[S][0],Sup[S][L+1]];
			S++
		}
		//alert(dat[i])
	}
	//alert(dat)
	Sup.splice(Sup.length-1,1);
	Fixed.splice(Fixed.length-1,1);
return dat
}
function GenLine(idx,ev,Ctype){
	var PredIdx = GetPredIdx(ev);
	if (idx.indexOf(PredIdx)>-1){ // Pred necessary
		var tmp = idx.indexOf(PredIdx);
		idx.splice(tmp+1,0,-1,-2); // add pred(-1) to idx
		var datcon = new Array(2); //third series to connect two different linestyle
	}
	var Series = new Array(idx.length*3)
	for (var i=0;i<idx.length;i++){
		var id = idx[i];
		if (id==-1)
			id = PredIdx;
		else if(id==-2)
			continue;
		var sid = [i*3,i*3+1,i*3+2]
		var name = GetSeriesName(ev[id],0,id)
		if (idx[i]==-1)
			name = name + "(Prediction)"
		var col = GetSeriesName(ev[id],1)

		var offset = (ev[id].Start.getTime() / 3.6e6 - 7 + 12) % 24 - 12;
		var x = [];
		for (var j = 0; j < ev[id].Len; j++) {
			x.push(j * 24 + 7 - offset, j * 24 + 23 - offset);
		}
		if (id == 62) {
			x[19] = 235;
		}
		// var StartTim = ev[id].Start.getTime();
		// for (var k=0;k < x.length;k++){
			// x[k] = StartTim + x[k] * 3600 * 1000;
		// }
		var dat = new Array(sid.length);
		for (var k=0;k<sid.length;k++){
			if (idx[i]==-1){ // + prediction with dashed lines
				var prop = ParsePred(ev,PredIdx);
				var NumExist = ev[id].L[k].length;
				var NumSup = ev[id].Len*2 - NumExist;
				dat[k] = new Array(NumSup);
				var pred = GetPredFromProp(prop[k],ev[id].L[k],NumExist,NumSup);
				for (j=0;j<NumSup;j++){
					dat[k][j] = [x[j+NumExist],pred[j]];
				}
				datcon[k] = [
						[ x[NumExist-1] , ev[id].L[k][NumExist-1] ] ,
						[ x[NumExist] , pred[0] ],
						];
				//alert(pred)
			}
			else{ // Noraml
				dat[k] = new Array(ev[id].L[k].length)
				for (var j=0;j<ev[id].L[k].length;j++){
					if (ev[id].L[k][j] == "")
						dat[k][j] = null;
					else
						dat[k][j] = [x[j],ev[id].L[k][j]];
				}
			}
/* 			if ('L_sup' in ev[id]){
				if(idx[i]!=-1)
					dat[k] = ImpSupAndSort(dat[k],ev[id].L_sup,k);
			} */
		}
		for(var j=0;j<sid.length;j++){
			Series[sid[j]] = {name:name,data:dat[j]}
			if(j!=0 || idx[i]==-1)
				Series[sid[j]].linkedTo = ':previous';
			if(col!="")
				Series[sid[j]].color = col;
			if (idx[i]==-1){
				Series[sid[j]].dashStyle = 'shortdot';
				//alert(datcon)
				Series[sid[j]+2] = {name:name,data:datcon[j],linkedTo:':previous',color:col,enableMouseTracking:false,showInLegend:false,dashStyle:'shortdot',marker:{enabled:false}} // add a third series to connect different linestyle
			}

			//if(i%2==0)
			//		Series[sid[j]].dataLabels={enabled:true}
		}

	}
	$('#charts').highcharts({
		chart: {
			type: "line"
/* 			zoomType: 'x',
			panning: true,
            panKey: 'shift' */
		},
		xAxis: {
			title:{
				text : "Hrs"
			},
			min:0,
			//type:"datetime"
		},
		yAxis: {
			min:0,
			title:{
				text: "Pts"}
		},
		title:{
			text:"走势"},
/* 		subtitle: {
            text: '点击并拖拽可局部放大,按下shift键进行移动区域'
        }, */
/* 					navigation: {
				buttonOptions: {
					theme: {
						// Good old text links
						style: {
							color: '#039',
							textDecoration: 'underline'
						}
					}
				}
			},
			exporting: {
				buttons: {
					contextButton: {
						enabled: false
					},
 					exportButton: {
						text: 'Download',
						// Use only the download related menu items from the default context button
						menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems.splice(2)
					},
					printButton: {
						text: 'Print',
						onclick: function () {
							this.print();
						}
					}
				}
			}, */
		tooltip:{
			crosshairs:true,
			shared: true
		},
		plotOptions:{
			series:{
				connectNulls: true,
				marker:{
					enabled:true
				}
			}
		},
		series:Series
	});
	if (idx.indexOf(PredIdx)>-1){ // Remove Pred from list
		var tmp = idx.indexOf(PredIdx);
		idx.splice(tmp+1,2);
	}
}
function GenCol(idx,ev,Ctype){
	//Ctype:0=1200 colunm,1=6000 colunm
	//Output: series
	var Series = new Array(idx.length)
	var CompLen = 0;
	for(var i=0;i<idx.length;i++){//Get Length of the table
		if (ev[idx[i]].Len>CompLen)
		{CompLen = ev[idx[i]].Len};
	}
	for(var i=0;i<idx.length;i++){//Produce Series for each series
		var id = idx[i];//
		var y = new Array(CompLen + 1)
		var x = new Array(CompLen + 1)
		var name = GetSeriesName(ev[id],0,id)
		var col = GetSeriesName(ev[id],1)
		for (var j=0;j<=CompLen;j++){
			if(Ctype<3){
				x[j] = String(j);
				if (ev[id].L[Ctype].length<1){
					y[0] = "";break;}
				else if (j==0){
					y[j] = ev[id].L[Ctype][0];}
				else if((j*2)<ev[id].L[Ctype].length){
					y[j] = ev[id].L[Ctype][j*2] - ev[id].L[Ctype][j*2 - 2]}
				else{ //Line
					y[j] = ev[id].L[Ctype][j*2 - 1] - ev[id].L[Ctype][j*2 - 2]}
			}
		}

		if(ev[id].Len<10){//Last 3 set of data
			if(CompLen>9){
				var adj = (CompLen==11)*1;
				for(var j=y.length-1-adj;j>=y.length-3-adj;j--){
					y[j] = y[j-1]
				}
				y[y.length-4-adj] = ""
			}
		}
		if(CompLen>10){
			if(ev[id].Len<11){
				var adj = (ev[id].Len==9)*1;
				for(var j=y.length-1;j>=y.length-3-adj;j--){
					y[j] = y[j-1]
				}
				y[y.length-4-adj] = ""
			}
		}
		Series[i] = {name:name,data:y}
		if(col!="")
			Series[i].color = col;
		if (Ctype == 1)
			var str = "日增-二档"
		else if (Ctype == 2)
			var str = "日增-三档"
		else
			var str = "日增-一档"

	}
	$('#charts').highcharts({
			chart: {
				type: "bar"
			},
			xAxis: {
				categories: x,
				title:{
					text : "Days"
				}
			},
			yAxis :{
				title:{
					text: 'Pts'}
			},
			title:{
				text:str},
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						/*useHTML: true,
						formatter: function() {
							return '<div style="text-align:center"><div>' + this.y + '</div><div><img src="http://i2.tietuku.com/57889fef7fe8ff76.png"></div></div>';
						}*/
					},
					borderWidth: 1,
					borderColor: '#000000'
				}
			},
			series:Series
		});
}
function GenScatter(ev,sm){
	var Nev = ev.length;
	var x = new Array(Nev);
	var y = new Array(Nev);
	var leg = ["传统-一档","传统-二档"]
	var Series = new Array(1);
	var data = new Array(2);
	var idxlist = new Array();
	for (var j=0;j<2;j++){
		data[j] = new Array();
		var _i=0;
		for (var i=0;i<Nev;i++){
			if (ev[i].L[j].length < ev[i].Len*2 || ev[i].SM!=sm){
				continue;
			}
			x[_i] = ev[i].Start.getTime();
			y[_i] = ev[i].L[j][ev[i].L[j].length-1];
			data[j][_i] = [x[_i],y[_i]];
			idxlist[_i]=i;
			_i++
		}
		//alert(data[j])
		Series[j] = {name:leg[j],data:data[j],enableMouseTracking:false,marker:{enabled:false}};
	}
	var ScaSer = new Array(2*_i); //Scatter series
	var _j=0;
	for(var j=0;j<2;j++){ //Draw Scatter
		for (var k=0;k<_i;k++){
			var name = GetSeriesName(ev[idxlist[k]],0,idxlist[k]);
			Series[_j+2] = {name:name,data:[ [data[j][k][0] , data[j][k][1]] ],showInLegend:false,marker:{symbol: "url(" + ev[idxlist[k]].img + ")",lineColor: null,lineWidth:0 }};
		_j++
		}
	}
	//Series[_i] = {name:"Dots",data:ScaSer,lineWidth:0};
	//alert(Series[2].marker.symbol)
	$('#charts').highcharts({
	chart: {
		type: "spline"
	},
	xAxis: {
		title:{
			text : "Date"
		},
		type:"datetime"
	},
	yAxis: {
		title:{
			text: "Pts"}
	},
	title:{
		text:"期走势"},
	tooltip:{
		crosshairs:true,
		shared: true
	},
	plotOptions:{
		spline:{
			events:{
				legendItemClick:function(){
					return false;
				}
			},
			allowPointSelect: false
		}
	},
	series:Series
	});
	/*$(function () {
    $('#charts').highcharts({
		chart: {
			type: "spline"
		},
		xAxis: {
		title:{
			text : "Date"
		},
		type:"datetime"
		},
        series: [{
            data: data
        }]
    });
});*/
}

function ReGenTab(showlist,fulllist){
	var hidelist = new Array(fulllist.length - showlist.length);
	var k = 0;
	for (var i=0;i<fulllist.length;i++){
		if (showlist.indexOf(fulllist[i]) < 0 ) {
			hidelist[k] = i;
			k++;}
	}

	switch(document.getElementById("TableType").value){
		case "Daily":
			GenLine(fulllist,EventData,0)
			break;
		case "Daily-f":
			GenLine(fulllist,EventData,0)
			var chart = $('#charts').highcharts();
			var base = EventData[EventData.length-1].Start.getTime();
			for(var i=0;i<chart.series.length;i++){
				for (var j=0;j<chart.series[i].data.length;j++){
						var x = (chart.series[i].data[j].x + 8) * 3600 * 1000 + base;
						var y = chart.series[i].data[j].y;
						chart.series[i].data[j].update([x,y],false,false);
				}
			}
			chart.xAxis[0].update({title:{text:"Time (GMT + 8.0)"},type:"datetime",min:base})
			break;
		case "Incr0":
			GenCol(fulllist,EventData,0)
			break;
		case "Incr1":
			GenCol(fulllist,EventData,1)
			break;
		case "Incr2":
			GenCol(fulllist,EventData,2)
			break;
		case "ByEvent":
			GenScatter(EventData,0)
			return;
		default:
			alert("error")
			return;
	}
	var chart = $('#charts').highcharts();
	if (chart.series[0].type=='line'){
		for(var i=0;i<hidelist.length;i++){
			chart.series[hidelist[i] * 2].hide();
			chart.series[hidelist[i] * 2 + 1].hide();
		}
	}
	else {
		for(var i=0;i<hidelist.length;i++){
			chart.series[hidelist[i]].hide();
		}
	}
}
