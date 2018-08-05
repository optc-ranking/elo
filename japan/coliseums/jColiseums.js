var coliseums;
var j_coliseums;
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
var ref = database.ref("coliseums");
ref.orderByChild("j_elo").once("value", gotData, errData);

function gotData(snapshot){
	gotData2(snapshot);
	
	j_coliseums = filter(coliseums);
	max = j_coliseums.length;
	
	generatePair();
		
	for(x = max - 1; x >= 0; x--){
		var temp = j_coliseums[x];rankImg[x] = new Image();
		rankImg[x].src = Utils.getThumbnailUrlNew(temp.unit_id);
		
		wrapper[x] = document.createElement("div");
		wrapper[x].id = "https://optc-db.github.io/characters/#/view/" + temp.unit_id;
		wrapper[x].className = "ranking";
		wrapper[x].setAttribute("border", "solid");
		rankImage.appendChild(wrapper[x]);
	}		
		
	for(x = max - 1; x >= 0; x--){
		var temp = j_coliseums[x];
		
		
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
		btn3.innerHTML = Math.round(10 * temp.j_elo) / 10;
		btn2.id = wrapper[x].id;
		btn2.addEventListener("click", function(){window.open(this.id)}, false);
		wrapper[x].appendChild(btn3);
		
		
		rankImage.appendChild(wrapper[x]);
	}
}

function generatePair(){
	var a = Math.floor(max * Math.random());
	
	// Increases the rate of newly added units - will need to be manually adjusted for Global
	var r = Math.random();
	if (r < 4.0/max){
		a = find(g_coliseums, 1628);
	}
	else if (r < 9.0/max){
		a = find(g_coliseums, 1401);
	}
	
	var b = Math.floor(max * Math.random());
	while (a == b){
		b = Math.floor(max * Math.random());
	};
	
	a_id = j_coliseums[a].unit_id;
	b_id = j_coliseums[b].unit_id;
	
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

	
	left.innerHTML = "Vote" + "<br />" + j_coliseums[a].name;
	right.innerHTML = "Vote" + "<br />" + j_coliseums[b].name;
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
		if(array[i].japan){
			temp.push(array[i]);
		}
		i++;
	}
	return temp;
}

function gotData2(snapshot){
	coliseums = [];
	snapshot.forEach(function(child) {
		coliseums.push(child.val());
	});
}

left.onclick = function(){	

	var authS = firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			database.ref("coliseums").orderByChild("unit_id").on("value", gotData2, errData);
			coliseums.sort(function(a, b){return a.unit_id - b.unit_id});
			
			var winner = find(coliseums, a_id);
			var loser = find(coliseums, b_id);
			
			var adj = match(5,coliseums[winner],coliseums[loser], true);
			
			var updates = {};
			updates[winner + "/j_elo"] = coliseums[winner].j_elo + adj;
			updates[loser + "/j_elo"] = coliseums[loser].j_elo - adj;
			
			
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
			database.ref("coliseums").orderByChild("unit_id").on("value", gotData2, errData);
			coliseums.sort(function(a, b){return a.unit_id - b.unit_id});
			
			var winner = find(coliseums, b_id);
			var loser = find(coliseums, a_id);

			var adj = match(5,coliseums[winner],coliseums[loser], true);
			
			var updates = {};
			updates[winner + "/j_elo"] = coliseums[winner].j_elo + adj;
			updates[loser + "/j_elo"] = coliseums[loser].j_elo - adj;
			
			ref.update(updates);
		} else {
			window.alert("To prevent vote manipulation, you have reached your hourly voting limit");
		}
	});
	authS();
	
	window.location.reload(true);
}

skip.onclick = function(){
	firebase.auth().signOut();
	firebase.auth().signInAnonymously().catch(function(error) {
		});
	var authS = firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			generatePair();
			authS();
		} else {
			window.alert("To prevent vote manipulation, you have reached your hourly voting limit");
			authS();
			window.location.reload(true);
		}
	});
}