var legends;
var g_captains;
var a_id;
var b_id;
var max;
var keys;

var left = document.getElementById("left");
var right = document.getElementById("right");
var skip = document.getElementById("skip");

var lImg = new Image();
var leftImage = document.getElementById("leftImage");
var rImg = new Image();
var rightImage = document.getElementById("rightImage");

var rankImg = [];
var rankImage = document.getElementById("rankImage");
var wrapper = [];
var wrapLink = [];

// Only allows 3 skips per login
var skipCounter = 3;

/**
var authStop = firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		if (user.isAnonymous()) {
			firebase.auth().signOut();
			firebase.auth().signInAnonymously().catch(function(error) {
			});
		}
	} else {
		firebase.auth().signInAnonymously().catch(function(error) {
		});
	}
});
authStop();
**/

firebase.auth().signOut();
firebase.auth().signInAnonymously().catch(function(error) {
});


var database = firebase.database();
var ref = database.ref("legends");
ref.orderByChild("g_captain").once("value", gotData, errData);

function gotData(snapshot){
	gotData2(snapshot);
	
	g_captains = filter(legends);
	max = g_captains.length;
	
	generatePair();
		
	for(x = max - 1; x >= 0; x--){
		var temp = g_captains[x];rankImg[x] = new Image();
		rankImg[x].src = Utils.getThumbnailUrlNew(temp.unit_id);
		
		wrapper[x] = document.createElement("div");
		wrapper[x].id = "https://optc-db.github.io/characters/#/view/" + temp.unit_id;
		wrapper[x].className = "ranking";
		wrapper[x].setAttribute("border", "solid");
		rankImage.appendChild(wrapper[x]);
	}		
		
	for(x = max - 1; x >= 0; x--){
		var temp = g_captains[x];
		
		
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
		btn3.innerHTML = temp.g_captain.toFixed(1);
		btn2.id = wrapper[x].id;
		btn2.addEventListener("click", function(){window.open(this.id)}, false);
		wrapper[x].appendChild(btn3);
		
		
		rankImage.appendChild(wrapper[x]);
	}
}

function generatePair(){
	var a = Math.floor(Math.random());
	var ran = Math.random();
	// Increases the rate of newly added units - will need to be manually adjusted for Global
	if (ran < 0.17){
		a = find(g_captains, 1910);
	}
	else if (ran < 0.34){
		a = find(g_captains, 2025);
	}
	else if (ran < 0.51){
		a = find(g_captains, 1763);
	}	
	else if (ran < 0.68){
		a = find(g_captains, 2113);
	}
	else if (ran < 0.84){
		a = find(g_captains, 2074);
	}
	else {
		a = find(g_captains, 2505);
	}
	
	var b = Math.floor(max * Math.random());
	while (a == b){
		b = Math.floor(max * Math.random());
	};
	
	a_id = g_captains[a].unit_id;
	b_id = g_captains[b].unit_id;
	
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

	
	left.innerHTML = "Vote" + "<br />" + g_captains[a].name;
	right.innerHTML = "Vote" + "<br />" + g_captains[b].name;
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

function filter(array){
	var temp = [];
	var i = 0;
	while (array[i] != undefined && array[i] != null){
		if(array[i].global){
			temp.push(array[i]);
		}
		i++;
	}
	return temp;
}

function gotData2(snapshot){
	legends = [];
	snapshot.forEach(function(child) {
		legends.push(child.val());
	});
}

left.onclick = function(){	

	var authS = firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			database.ref("legends").orderByChild("unit_id").on("value", gotData2, errData);
			legends.sort(function(a, b){return a.unit_id - b.unit_id});
			
			var winner = find(legends, a_id);
			var loser = find(legends, b_id);
			
			var adj = 2*match(0,legends[winner],legends[loser], false);
			
			var updates = {};
			updates[winner + "/g_captain"] = legends[winner].g_captain + adj;
			updates[loser + "/g_captain"] = legends[loser].g_captain - adj;
			
			
			ref.update(updates);
	
		} else {
			window.alert("To prevent vote manipulation, you have reached your hourly voting limit");
		}
	});
	authS();
	
	window.location.reload(true);
}

right.onclick = function(){
	var authS = firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			database.ref("legends").orderByChild("unit_id").on("value", gotData2, errData);
			legends.sort(function(a, b){return a.unit_id - b.unit_id});
			
			var winner = find(legends, b_id);
			var loser = find(legends, a_id);

			var adj = 2*match(0,legends[winner],legends[loser], false);
			
			var updates = {};
			updates[winner + "/g_captain"] = legends[winner].g_captain + adj;
			updates[loser + "/g_captain"] = legends[loser].g_captain - adj;
			
			ref.update(updates);
		} else {
			window.alert("To prevent vote manipulation, you have reached your hourly voting limit");
		}
	});
	authS();
	
	window.location.reload(true);
}

skip.onclick = function(){
	var authS = firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
		} else {
			window.alert("To prevent vote manipulation, you have reached your hourly voting limit");
		}
	});
	authS();
	window.location.reload(true);
}
