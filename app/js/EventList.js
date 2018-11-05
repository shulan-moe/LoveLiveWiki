var tb = document.getElementById('EventList');
var cards = cardgenerator( function(){return true; })
var bd = tb.childNodes;


for(var i in bd)
if(bd[i].tagName == 'TBODY' || bd[i].tagName == 'BODY')
{
	var trs = bd[i].childNodes;
	for(var i in trs)
	{
		if(trs[i].tagName == 'TH') continue;
		var tds = trs[i].childNodes;
		for(var j in tds)
		{
			if(tds[j].tagName == 'TH') break;
			var re = new RegExp(/\d{3}\)/)
			var res = re.test(tds[j].innerHTML);
			if(res)	
			{
				console.log(res);
				var text = tds[j].innerHTML;
				if(text == '') break;
				var num = '';
				for(var k = text.length - 1; k >= 0; k--)
				{
					if(text[k] == ')') continue;
					if(text[k] == ';') 	break;
					num = text[k] + num;
				}
				num = parseInt(num);
				if(parseInt(num) != NaN)
				{
					var card = cards[num - 1];
					if(card == undefined) break;
					tds[j].innerHTML =  tds[j].innerHTML + "<br/><img src='" + card.icon + "' width='70px'/>" + "<img src='" + card.upicon + "' width='70px'/>";
				}
			}
		}
	}
	break;
}