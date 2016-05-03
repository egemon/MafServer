var fs = require('fs');
var PATHS = require('../configs/PATHS.json');

var periodHelper = require('../helpers/famePeriods');
var playerHelper = require('../helpers/players');
var meetingHelper = require('../helpers/meetings');
var registerHelper = require('../helpers/register');



var dataBase = {
    players: require('.' + PATHS.players),
    photos: require('.' + PATHS.photos),
    contents: require('.' + PATHS.contents),
};

function initializeWatching(field) {
    console.log('[dataBase] initializeWatching()', arguments);
    if (field ==='all') {
        for(var key in dataBase){
            initializeWatching(key);
        }
    } else {
        console.log('[dataBase] initializeWatching()', field, PATHS[field]);
        fs.watch(PATHS[field], refreshInfoFor.bind(this, field));
    }
}

function watchLocalStorage () {
    fs.watch(PATHS.games, {recursive: true}, addItemsFromProtocols.bind(this, 'players'));
    fs.watch(PATHS.games, {recursive: true}, addItemsFromProtocols.bind(this, 'register'));
    var handlers = {
        players: getPlayers,
        register: registerHelper.getRegister,
    };

    function addItemsFromProtocols(type, ev, filename) {
        fs.readFile(PATHS.games + '/' + filename, 'utf8', function(err, data){
            console.log('[dataBase] addItemsFromProtocols()' + type);
            console.log('[dataBase] settingDataInProcess  =');
            if (err) {
                console.warn('[dataBase] addItemsFromProtocols() error with file reading');
                return;
            }
            var game = {};
            try{
                game = JSON.parse(data);
            }catch(e){
                console.warn('[dataBase] addItemsFromProtocols() error with file parsing', e);
                return;
            }
            var oldItems = handlers[type](game.metadata.date);
            var nicks = {};
            oldItems.forEach(function(player){
                nicks[player.nick] = true;
            });
            game.playerLines.forEach(function(playerLine){
                if (playerLine.nick in nicks || !playerLine.nick) {
                    return true;
                } else {
                    nicks[playerLine.nick] = true;
                    oldItems.push(formatItem(playerLine, type)) ;
                }
            });
            setData(oldItems, type, type ==='register' ? ('/' + game.metadata.date + '.json') : '');
        });
    }
}

function formatItem(playerLine, type) {
    switch(type) {
        case 'players':
           return {
                "nick": playerLine.nick,
                "password": playerLine.nick,
                "name": playerLine.nick,
                "presents": [],
                "memberLevel": 0,
                "honours": []
            };
        case 'register':

            return {
                "nick": playerLine.nick,
                "sum": 0,
                "debt": registerHelper.getDebt(playerLine.nick)
            };
    }
}

function refreshInfoFor (field) {
    console.log('[dataBase] refreshInfoFor()', arguments);
    if (field === 'all') {
        for(var key in dataBase){
            refreshInfoFor(key);
        }
    } else {
        fs.readFile(PATHS[field], function (err, data) {
            if (err) {
                console.log('Error!!! ', err);
            } else {
                try {
                    JSON.parse(data);
                    dataBase[field] = JSON.parse(data);
                    console.log('[dataBase] refreshInfoFor() dataBase.'+field);
                } catch(e){
                    console.error('[dataBase] refreshInfoFor() readFile error', e);
                }
            }
        });
    }
}

function setData(data, field, path) {
    console.log('[dataBase] setData()', field);

    path = path || '';

    if (field === 'debts') {
        registerHelper.calculateDebts(path.replace('.json', ''));
        return;
    }

    if (field === 'players') {
        data = handleImages(data);
    }

    fs.writeFileSync(PATHS[field] + path, JSON.stringify(data, null, 4), 'utf8');
    return {succesText: 'Данные сохранены!'};
}

function handleImages(players) {
    console.log('[dataBase] handleImages()');
    return players.map(function (player) {
        if (player.imgFile) {
            var format = '.'+ RegExp(/\/.*;base64/).exec(player.imgFile)[0].slice(1,-7);
            console.log('[dataBase handleImages()] format ', format);
            player = playerHelper.addImgSrc(format, player);
            console.log('[dataBase] handleImages() player.img = ', player.img);
            saveImg(player.imgFile, player.img, format);
            delete player.imgFile;
        }
        return player;
    });
}

function saveImg(base64text, fileName, format) {
    console.log('[dataBase] saveImg()', fileName);
    var FORMATS = {
        '.png': true,
        '.jpg': true,
        '.jpeg': true,
        '.bmp': true
    };
    if (format in FORMATS) {
        var base64Data = base64text.replace(/^.*;base64,/, "");
        fs.writeFile("./data-base/players/img/"+ fileName, base64Data, 'base64', function(err) {
            console.log('[dataBase] wirteImage error = ', err);
        });
    } else {
        return {
            errorText: 'Неподдерживаемый формат изображения!'
        };
    }
}


function getPlayers() {
    return playerHelper.getSortedPlayers(dataBase.players);
}
function getPhotos() {
    return meetingHelper.sortItemsByDate(dataBase.photos);
}

function getNews() {
    var meetings = meetingHelper.getMeetings(dataBase.contents);
    return meetingHelper.addImgs(meetings, playerHelper.getPlayerByNick.bind(null, dataBase.players));
}

function getMembers() {
    return playerHelper.getMembers(dataBase.players);
}

function getHallOfFame () {
    return periodHelper.createFrom(dataBase.players);
}

function getOrgs () {
    return playerHelper.getOrgs(dataBase.players);
}

function getPlayerFields() {
    return playerHelper.getPlayerFields();
}


function getRegisterFields() {

    var fields = [];
    try {
        fields = JSON.parse(fs.readFileSync(PATHS.register + '/fields.json', 'utf8'));
    } catch(e) {
        console.error('Error with reading register-fields', e);
    }

    return fields;
}



module.exports = {
    initializeWatching: initializeWatching,
    refreshInfoFor: refreshInfoFor,
    setData: setData,
    getPlayers: getPlayers,
    getPhotos: getPhotos,
    getNews: getNews,
    getMembers: getMembers,
    getHallOfFame: getHallOfFame,
    getOrgs: getOrgs,
    getPlayerFields: getPlayerFields,
    authentificate: playerHelper.authentificate.bind(this, dataBase.players),
    getMeetingFields: meetingHelper.getMeetingFields,
    watchLocalStorage: watchLocalStorage,
    getRegister: registerHelper.getRegister,
    getRegisterFields: getRegisterFields,
    calculateDebts: registerHelper.calculateDebts,
};

