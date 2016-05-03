var fs = require('fs');
var PATHS = require('../configs/PATHS.json');


module.exports = {
    getRegister: getRegister,
    updateDebts: updateDebts,
    getDebt: getDebt,
};

function getRegister(date) {
    console.log('[register.js] getRegister()', date);

    var register = [];
    try {
        register = JSON.parse(fs.readFileSync(PATHS.register + '/' + date + '.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading register-fields', e);
    }

    return register;
}


function getDebt(nick) {
    console.log('[register.js] getDebt()', nick);

    var debts = {};
    try {
        debts = JSON.parse(fs.readFileSync(PATHS.register + '/debts.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading debt-fields', e);
    }

    return nick === undefined ? debts : (debts[nick] || 0);
}

function setDebts(debts) {
    console.log('[register.js] setDebts()', debts);

    try {
        JSON.parse(fs.writeFileSync(PATHS.register + '/debts.json', JSON.stringify(debts, null, 4)));
    } catch(e) {
        console.error('Error with writing debts-fields', e);
    }
}

function updateDebts (date) {
    console.log('[register.js] updateDebts()', date);

    var debts = getDebt();
    var register = getRegister(date);
    for (var i = 0; i < register.length; i++) {
        var player = register[i];
        if (player.debt > 0 || debts[player.nick]) {
            debts[player.nick] = player.debt;
        }
    }
    setDebts(debts);
}
