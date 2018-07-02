var legends;
var j_sailors;
var a_id;
var b_id;
var keys;

var left = document.getElementById("left");
var right = document.getElementById("right");

var lImg = new Image();
var leftImage = document.getElementById("leftImage");
var rImg = new Image();
var rightImage = document.getElementById("rightImage");

var rankImg = [];
var rankImage = document.getElementById("rankImage");
var wrapper = [];
var wrapLink = [];

var database = firebase.database();
var ref = database.ref("units");
ref.orderByChild("j_sailor").once("value", gotData, errData);

function gotData(snapshot){
	gotData2(snapshot);
	
	j_sailors = legends;
	var max = j_sailors.length;
	
	a = Math.floor(max * Math.random());
	b = Math.floor(max * Math.random());
	while (a == b){
		b = Math.floor(max * Math.random());
	};
	
	a_id = j_sailors[a].unit_id;
	b_id = j_sailors[b].unit_id;
	
	lImg.src = Utils.getThumbnailUrlNew(a_id);
	lImg.onerror = function(){this.src = "https://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png";};
	
	rImg.src = Utils.getThumbnailUrlNew(b_id);
	rImg.onerror = function(){this.src = "https://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png";};
	
	
	
	leftImage.onclick = function(){
		window.open("https://optc-db.github.io/characters/#/view/" + a_id);
	}

	lImg.onload = function() {
		leftImage.appendChild(lImg);
	};

	rightImage.onclick = function(){
		window.open("https://optc-db.github.io/characters/#/view/" + b_id);
	}

	rImg.onload = function() {
		rightImage.appendChild(rImg);
	};

	
	left.innerHTML = "Vote" + "<br />" + j_sailors[a].name;
	right.innerHTML = "Vote" + "<br />" + j_sailors[b].name;

		
	for(x = max - 1; x >= 0; x--){
		var temp = j_sailors[x];rankImg[x] = new Image();
		rankImg[x].src = Utils.getThumbnailUrlNew(temp.unit_id);
		
		wrapper[x] = document.createElement("div");
		wrapper[x].id = "https://optc-db.github.io/characters/#/view/" + temp.unit_id;
		wrapper[x].className = "ranking";
		
		rankImage.appendChild(wrapper[x]);
	}		
		
	for(x = max - 1; x >= 0; x--){
		var temp = j_sailors[x];
		
		
		var btn1 = document.createElement("a");
		btn1.className = "animated zoomIn r1button";	
		rankImg[x].onerror = function(){this.src = "https://onepiece-treasurecruise.com/wp-content/themes/onepiece-treasurecruise/images/noimage.png";};
		btn1.appendChild(rankImg[x]);
		btn1.id = wrapper[x].id;
		btn1.addEventListener("click", function(){window.open(this.id)}, false);
		wrapper[x].appendChild(btn1);
		
		
		
		
		
		var btn2 = document.createElement("a");
		var place = max - x;
		btn2.className = "animated zoomIn r2button";
		btn2.align = "left";
		btn2.innerHTML = place + " - " + temp.name;
		btn2.id = wrapper[x].id;
		btn2.addEventListener("click", function(){window.open(this.id)}, false);
		wrapper[x].appendChild(btn2);
		
		var btn3 = document.createElement("a");
		btn3.className = "animated zoomIn r3button";
		btn3.innerHTML = Math.round(10 * temp.j_sailor) / 10;
		btn3.id = wrapper[x].id;
		btn3.addEventListener("click", function(){window.open(this.id)}, false);
		wrapper[x].appendChild(btn3);
		
		
		rankImage.appendChild(wrapper[x]);
	}
}

function errData(err){
	window.alert("error");
}

function find(array, val){
	var i = 0;
	while (array[i] != undefined && array[i] != null){
		if (array[i].unit_id == val){
			return i;
		};
		i++;
	};
	return false;
}

function gotData2(snapshot){
	legends = [];
	snapshot.forEach(function(child) {
		legends.push(child.val());
	});
}

left.onclick = function(){	
	database.ref("units").orderByChild("unit_id").on("value", gotData2, errData);
	legends.sort(function(a, b){return a.unit_id - b.unit_id});
	
	var winner = find(legends, a_id);
	var loser = find(legends, b_id);

	var adj = match(3,legends[winner],legends[loser]);
	
	var updates = {};
	updates[winner + "/j_sailor"] = legends[winner].j_sailor + adj;
	updates[loser + "/j_sailor"] = legends[loser].j_sailor - adj;
	
	ref.update(updates);
	
	window.location.reload(true);
}

right.onclick = function(){
	database.ref("units").orderByChild("unit_id").on("value", gotData2, errData);
	legends.sort(function(a, b){return a.unit_id - b.unit_id});
	
	var winner = find(legends, b_id);
	var loser = find(legends, a_id);

	var adj = match(3,legends[winner],legends[loser]);
	
	var updates = {};
	updates[winner + "/j_sailor"] = legends[winner].j_sailor + adj;
	updates[loser + "/j_sailor"] = legends[loser].j_sailor - adj;
	
	ref.update(updates);
	
	window.location.reload(true);
}