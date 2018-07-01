var database = firebase.database();
var ref = database.ref("units");
ref.once("value", gotData, errData);

function gotData(data){
	var listing = selectAll(".listing");
	for (var i = 0; i < listing.length; i ++) {
		listing[i].remove();
	}
	
	var units = data.val();
	var max = units.length;
	
	var li = createElement("li", units[0].name());
	li.parent("rankingList");
	
	/**
	a = Math.floor(max * Math.random());
	b = Math.floor(max * Math.random());
	while (a == b){
		b = Math.floor(max * Math.random());
	}
	
	for (var i = 0; i < max; i++) {
		var name = units[i].name;
		var elo = units[i].g_captain;
		var li = createElement("li", name + ": " + g_captain);
		li.class("listing");
		li.parent("rankingList");
	}
	
	**/
}

function errData(err){

}
