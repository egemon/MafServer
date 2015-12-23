function isMember(player) {
    return player.memberLevel > 0;
}
function isOrg (player) {
    return player.memberLevel > 2;
}

function byOrgLevel (player1, player2 ) {
    return player1.memberLevel > player2.memberLevel;
}

function byHonourLevel (player1, player2) {
    return player1.memberLevel > player2.memberLevel;
}


function getOrgs (players) {
	return players.filter(isOrg).sort(byOrgLevel);
}

function getMembers (players) {
	return players.filter(isMember).sort(byHonourLevel);
}

module.exports = {
	getOrgs: getOrgs,
	getMembers: getMembers
}