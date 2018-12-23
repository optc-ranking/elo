function match(type, winner, loser, mult){
	var ea;
	var k = 5;
	
	if (mult){
		k = 10;
	}
	
	//Global captain
	if (type == 0){
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.g_captain - winner.g_captain) / 400.0));
	}
	//Global sailor
	else if (type == 1) {
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.g_sailor - winner.g_sailor) / 400.0));
	}
	//Japan captain
	else if (type == 2) {
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.j_captain - winner.j_captain) / 400.0));
	}
	//Japan sub
	else if (type == 3) {
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.j_sailor - winner.j_sailor) / 400.0));
	}
	//Global other
	else if (type == 4) {
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.g_elo - winner.g_elo) / 400.0));
	}
	//Japan other
	else if (type == 5) {
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.j_elo - winner.j_elo) / 400.0));
	}
	
	return k * (1.0 - ea);
}
