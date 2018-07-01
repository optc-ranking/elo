var database;
var a;
var b;

function setup(){
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyAt-JZ5X3ajjfBQsRpX0ZjYwQYc2hh3yRk",
		authDomain: "optc-elo.firebaseapp.com",
		databaseURL: "https://optc-elo.firebaseio.com",
		projectId: "optc-elo",
		storageBucket: "optc-elo.appspot.com",
		messagingSenderId: "997356356537"
	};
        
	firebase.initializeApp(config);

	database = firebase.database();
	var ref = database.ref("units");
	ref.on('value', gotData, errData);

}

function gotData(data){
	var listing = selectAll(".listing");
	for (var i = 0; i < listing.length; i ++) {
		listing[i].remove();
	}
	
	var units = data.val();
	var max = units.length;
	
	/**
	a = Math.floor(max * Math.random());
	b = Math.floor(max * Math.random());
	while (a == b){
		b = Math.floor(max * Math.random());
	}
	**/
	
	for (var i = 0; i < max; i++) {
		var name = units[i].name;
		var elo = units[i].g_captain;
		var li = createElement("li", name + ": " + g_captain);
		li.class("listing");
		li.parent("rankingList");
	}
	
}

function errData(err){

}
