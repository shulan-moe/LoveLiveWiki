var tb = document.getElementById('EventList');
var cards = cardgenerator( function(){return true; });
var cardRows = tb.rows.length - 2
alert(cardRows);
for(var i=0;i<cardRows;i++){
	var cardId = tb.rows(i+2).cells(1).innerHTML;
	var card = cards[cardId - 1];
	tb.rows(i+2).cells(1).innerHTML = "<br/><img src='" + card.icon + "' width='70px'/>" + "<img src='" + card.upicon + "' width='70px'/>"
	}
	};