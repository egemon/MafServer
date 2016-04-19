var fs = require('fs');

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
	return players.filter(isOrg).sort(byOrgLevel).map(addImgSrc);
}

function getMembers (players) {
	return players.filter(isMember).sort(byHonourLevel).map(addImgSrc);
}

function addImgSrc (player) {
    player.img = player.nick.replace(/\s+/g, '');
    console.log('player', JSON.stringify(player));
    return player;
}

function getPlayerByNick (players, nick) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].nick == nick) {
            return players[i];
        }
    }
}

function authentificate (players, credentials) {
    console.log('[playerHelper] authentificate() ', arguments);
    var password = credentials.password;
    var user = credentials.nick;
    var player = getPlayerByNick(players, user);
    if (player && player.password === password) {
        return player;
    } else {
        return false;
    }
}


function getPlayerFields () {
    var playerFields = [
        "nick",
        "password",
        "vk",
        "birthday",
        "name",
        "presents",
        "phone",
        "position",
        "memberLevel",
        "faculty",
        "experiance",
        "honours"
    ];

    try {
        playerFields = JSON.parse(fs.readFileSync('./data-base/players/player-fields.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading players-fields', e);
    }
    return playerFields;
}

module.exports = {
	getOrgs: getOrgs,
	getMembers: getMembers,
    getPlayerByNick: getPlayerByNick,
    getPlayerFields: getPlayerFields,
    authentificate: authentificate
};