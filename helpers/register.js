var fs = require('fs');
var PATHS = require('../configs/PATHS.json');


module.exports = {
    getRegister: getRegister,
    calculateDebts: calculateDebts,
    getDebt: getDebt,
};

function getRegister(date) {
    console.log('[register.js] getRegister()', date);


    var debts = [];
    try {
        debts = JSON.parse(fs.readFileSync(PATHS.register + '/debts.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading debts-fields', e);
    }

    var register = [];
    try {
        register = JSON.parse(fs.readFileSync(PATHS.register + '/' + date + '.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading register-fields', e);
    }

    for (var i = 0; i < register.length; i++) {
        if (register.nick in debts) {
            register.debt = debts[register.nick];
        }
    }

    return register;
}


function getDebt(nick) {
    console.log('[register.js] getDebt()', nick);

    var debts = [];
    try {
        debts = JSON.parse(fs.readFileSync(PATHS.register + '/debts.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading register-fields', e);
    }

    return nick === undefined ? debts : (debts[nick] || 0);
}


function calculateDebts (date) {
    console.log('[register.js] calculateDebts()', date);

    var debts = getDebt();
    var register = getRegister(date);
    for (var i = 0; i < register.length; i++) {
        var player = register[i];
        if (player.debts === 0 && player.sum > 0) {
            continue;
        } else {
            var nick = player.nick;
            debts[nick] = debts[nick] || 0;
            debts[nick] += player.sum;
        }
    }
}
