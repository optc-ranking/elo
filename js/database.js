var database;

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
	var units = data.val();
	var max = scores.length;
	
	var a = Math.floor(max * Math.random());
	var b = Math.floor(max * Math.random());
	while (a == b){
		b = Math.floor(max * Math.random());
	}
	
	console.log(units[a].name);
}

function errData(err){

}
