function TablePage(table, size){
	var trs = table.childNodes;

	table.size = 0;
	table.divs = [];
	table.head = [];
	table.head.push(trs[0]);
	table.head.push(trs[1]);
	var cc = 1;
	while(true)
	{
		var dd = [];
		table.size++;
		for(var j = 0; j < size; j++)
		if(cc < trs.length)
		{
			dd.push(trs[cc]);
			cc++;
		}
		table.divs.push(dd);
		if(cc == trs.length) break;
	}
	table.cur = 0;

	table.loadpage = function(num)
	{
		while(this.hasChildNodes()) this.removeChild(this.firstChild);
		var trs = this.divs[num];
		this.appendChild(this.head[0]);
		this.appendChild(this.head[1]);
		for(var i = 0; i < trs.length; i++)
			this.appendChild(trs[i]);
		table.cur = num;
		
		var tr = document.createElement('tr');
		var td = document.createElement('td')
		td.colSpan = 12;

		if(num != 0)	
		{
			var bc = document.createElement('button');
			bc.innerHTML = '上一页';
			bc.tb = this;	
			bc.num = num - 1;
			bc.onclick = function(){
				this.tb.loadpage(this.num);
			}
			td.appendChild(bc);
		}
		for(var i = Math.max(num - 10, 0); i < Math.min(this.size, num + 10); i++)
		{
			console.log(i);
			var bc = document.createElement('button');
			bc.tb = this;	
			bc.innerHTML = i + 1;
			bc.num = i;
			bc.onclick = function(){
				this.tb.loadpage(this.num);
			}
			td.appendChild(bc);
		}

		if(num != this.size - 1)	
		{
			var bc = document.createElement('button');
			bc.tb = this;	
			bc.innerHTML = '下一页';
			bc.num = num + 1;
			bc.onclick = function(){
				this.tb.loadpage(this.num);
			}
			td.appendChild(bc);
		}

		tr.appendChild(td);
		this.appendChild(tr);
	}
	table.loadpage(0);
}

function getspliter()
{
	var spliter = new Object();
	// table
	spliter.index = {
		'rarity': ['N', 'R', 'SR', 'UR'], 
		'attribute': ['smile', 'pure', 'cool'], 
		'name': ['高坂穗乃果', '绚濑绘里', '南琴梨', '园田海未', '星空凛', '西木野真姬', '东条希', '小泉花阳', '矢泽日香', 'N'], 
		'skill': ['加分', '判定', '恢复', '无'], 
	};

	// table headers
	spliter.header = ['rarity', 'attribute', 'name', 'skill'];

	// show table
	spliter.show = function()
	{
		var table = document.createElement('table');
		var transfer = {'rarity': "稀有度", 'attribute': "属性", 'name': "角色", 'skill': "技能"};
		for(var i = 0; i < spliter.header.length; i++){
			var tr = document.createElement('tr')
			// Add Line Headers
			var th = document.createElement('th');
			th.innerHTML = transfer[spliter.header[i]];
			tr.appendChild(th);

			// Add Attributes
			var values = spliter.index[spliter.header[i]];
			// Add All box
			var all =  document.createElement('input');
			all.boxs = new Array();
			all.type = 'checkbox';

			for(var j = 0; j < values.length; j++)
			{
				var td = document.createElement('td');
				// Add Check Box
				var box =  document.createElement('input');
				box.type = 'checkbox';
				box.value = values[j];
				box.className = spliter.header[i];
				box.checked = true;
				// Add Text
				var text = document.createElement('span');
				text.innerHTML = values[j];

				td.appendChild(box);
				td.appendChild(text)

				all.boxs.push(box);

				tr.appendChild(td);
			}

			// add All CheckBox
			var td = document.createElement('td');

			all.onclick = function(){
				for(var i in this.boxs)
				if(this.checked)
					this.boxs[i].checked = true;
				else
					this.boxs[i].checked = false;
			};
			all.checked = true;
			var text = document.createElement('span');
			text.innerHTML = "All";
			td.appendChild(all);
			td.appendChild(text);

			tr.appendChild(td);

			table.appendChild(tr);
		}
		// Add Id Box
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		var th = document.createElement('th');
		th.innerHTML = "ID: ";
		tr.appendChild(th);
		var input = document.createElement('input');
		input.type= 'text';
		input.setAttribute('id', 'idbox');
		input.value = 'ALL';
		td.appendChild(input);
		tr.appendChild(td);
		table.appendChild(tr);

		var tr = document.createElement('tr');
		var btn = document.createElement('button');
		btn.innerHTML = '筛选';
		btn.id = 'shufflebtn'
		tr.appendChild(btn);
		table.appendChild(tr);
		document.getElementById('splitdiv').appendChild(table);
	}

	return spliter;
}



var cardspliter = function(card)
{
	if(card.smile.length == 0) return false;
	var box = document.getElementById('idbox');
	if(box.value != 'ALL' && box.value != 'all')
	{
		if(parseInt(box.value) != card.id) return false;
		else return true;
	}
	var index = getspliter().index;
	for (var name in index)
	{
		//console.log(name)
		var tags = document.getElementsByClassName(name);
		for(var j in tags)
		if(name != 'skill')
		{
			if(!tags[j].checked && card[name] == tags[j].value) return false;
			if(name == 'name' && card.rarity == 'N' && tags[j].value == 'N' && tags[j].checked == false) return false;
		}
		else{
			if(card[name] == undefined)
			{
				if(card[name] == undefined && tags[j].value == '无' && !tags[j].checked) return false;
			}
			else if(!tags[j].checked && card[name].type == tags[j].value) return false;
		}
	}
	return true;
}

function getcardtb(card){
	var divtb = document.createElement('table');

	//div.style.display = 'none';

	var n1 = document.createElement('img');
	n1.src = card.navi;
	n1.style.width = '300px';
	var n2 = document.createElement('img');
	n2.style.width = '300px';
	n2.src = card.upnavi;
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.appendChild(n1);
	tr.appendChild(td);
	var td = document.createElement('td');
	td.appendChild(n2);
	tr.appendChild(td);
	divtb.appendChild(tr);

	var div = document.createElement('div');
	div.appendChild(divtb);
	return div;
}

function gettable()
{
	var cards = cardgenerator(cardspliter);

	var table = document.createElement('table');
	table.className = 'pinktable';
	table.setAttribute('id', 'cardtb');
	table.border = 1;

	var ths = [{"No": 2, "头像": 2, "名字": 2, '觉醒前满级': -3, "觉醒后满级": -3, "技能": 2, "主唱技能": 2}
			,{"Smile": 1, "Pure": 1, "Cool": 1}];
	for (var i in ths)
	{
		var tr = document.createElement('tr');
		for(var j = 0; j <= i; j++)
		{
			for(var k in ths[i])
			{
				var th = document.createElement('th');
				th.innerHTML = k;
				if(ths[i][k] < 0)
					th.colSpan = -ths[i][k];
				else
					th.rowSpan = ths[i][k];
				tr.appendChild(th);
			}
		}	
		table.appendChild(tr);
	}

	for(var i in cards)
	{
		var tr = document.createElement('tr');

		var id = document.createElement('td');
		id.innerHTML = cards[i].id;
		tr.appendChild(id)

		var icon = document.createElement('td');
		var i1 = document.createElement('img'); i1.style.height = i1.style.width = '50px'; i1.src = cards[i].icon;
		i1.tr = tr;
		i1.card = cards[i];


		i1.showdiv = function(event, open){
			var div = document.getElementById('cardiv');
			while(div.hasChildNodes()){
				div.removeChild(div.firstChild);
			}
			if(open)
			{
				div.appendChild(getcardtb(this.card));
				div.style.position = 'absolute';
				div.style.marginLeft = event.pageX;
				div.style.marginTop = event.pageY;	
			}
		}
				
		i1.onclick = function(){
			var div = document.getElementById('light');
			while(div.hasChildNodes()) div.removeChild(div.firstChild);
			var a = document.createElement('a');
			a.onclick = function(){
				document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'
			};
			a.innerHTML = '关闭';
			a.href = 'javascript:void(0)';

			var cmap = {'smile': 'pink', 'pure': 'lightgreen', 'cool': 'lightblue'};
			div.style.borderColor = cmap[this.card.attribute];
			div.appendChild(a);
			document.getElementById('light').appendChild(getcardtb(this.card));

			document.getElementById('light').style.display='block';
		}

	
		var i2 = document.createElement('img'); i2.style.height = i2.style.width = '50px'; i2.src = cards[i].upicon;
		i2.tr = tr;
		i2.card = cards[i];
				i2.showdiv = function(event, open){
			var div = document.getElementById('cardiv');
			while(div.hasChildNodes()){
				div.removeChild(div.firstChild);
			}
			if(open)
			{
				div.appendChild(getcardtb(this.card));
				div.style.position = 'absolute';
				div.style.marginLeft = event.pageX;
				div.style.marginTop = event.pageY;	
			}
		}
				
		i2.onclick = function(){
			var div = document.getElementById('light');
			while(div.hasChildNodes()) div.removeChild(div.firstChild);
			var a = document.createElement('a');
			a.onclick = function(){
				document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'
			};
			a.innerHTML = '关闭';
			a.href = 'javascript:void(0)';

			var cmap = {'smile': 'pink', 'pure': 'lightgreen', 'cool': 'lightblue'};
			div.style.borderColor = cmap[this.card.attribute];
			div.appendChild(a);
			document.getElementById('light').appendChild(getcardtb(this.card));

			document.getElementById('light').style.display='block';
		}

		icon.appendChild(i1); icon.appendChild(i2);
		tr.appendChild(icon);

		var name = document.createElement('td');
		name.innerHTML = cards[i].name;
		tr.appendChild(name);

		for(var num = 0; num < 2; num++)
		{
			var spc = new Object();
			spc.s = cards[i].smile[num]; spc.p = cards[i].pure[num]; spc.c = cards[i].cool[num];
			for(var k in spc)
			{
				var td = document.createElement('td');
				td.innerHTML = spc[k];
				tr.appendChild(td);
			}
		}

		var sk = document.createElement('td');
		if(cards[i].skill != undefined)
			sk.innerHTML = cards[i].skill.name + "<br/>" + cards[i].skill.text;
		tr.appendChild(sk);

		var ld = document.createElement('td');
		if(cards[i].leader != undefined)
			ld.innerHTML = cards[i].leader.name + "<br/>" + cards[i].leader.text;
		tr.appendChild(ld);
			
		table.appendChild(tr);
	}
	return table;
}
