function getdata(diff,songId){
		var ajaxURL = "https://app2.lovelivewiki.com/getvideo.php?diff=" + diff +  "&songId=" + songId;
		var divId = diff + "-" + songId;
	$.ajax({
		type: "GET",
		url: ajaxURL,
		dataType: "html",
		success: function inset(src){
		var input = src;
		var video = document.createElement("div");
		video.innerHTML = input;
		document.getElementById(divId).appendChild(video);
		}
	});	
	}