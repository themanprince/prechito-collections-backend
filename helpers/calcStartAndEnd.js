//CREDIT - my lifelog serverside

//this module gon calc where a page starts and ends, given a partiicular entry length and a pgNum
//it also takes into cognicance the size of a page i.e. PG_LENGTH

module.exports = function(entrySize, pgNum, PG_LENGTH) {
	const maxObtainable = Math.ceil(entrySize / PG_LENGTH); //max obtainable number of page
	if((pgNum < 1) || (pgNum > maxObtainable))
		throw new RangeError("unexisiting page number");
	
	let pgEnd = (pgNum * PG_LENGTH); //this value may soon change,,. just need this first in order to obtain the pgStart
	let pgStart = (pgNum === 1)? 0 : (pgEnd - PG_LENGTH);
	//now, for the pgEnd... it may change from that set value if the user asked for the max i.e. max Obtainable
	if(pgNum === maxObtainable)
		pgEnd = entrySize; //so we gon stop at the exact last


	return [pgStart, pgEnd];
}