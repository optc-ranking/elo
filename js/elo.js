function match(type, winner, loser){
	var ea;
	
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
	else {
		ea = 1.0 / (1.0 + Math.pow(10.0, (loser.j_sailor - winner.j_sailor) / 400.0));
	}
	
	return 20 * (1.0 - ea);
}