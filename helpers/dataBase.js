var fs = require('fs');

var periodHelper = require('../helpers/famePeriods');
var playerHelper = require('../helpers/players');
var meetingHelper = require('../helpers/meetings');

var PATHS = {
    players: './data-base/players/players.json',
    photos: './data-base/photos.json',
    contents: './data-base/news/meetings.json'
};

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

function setData(data, field) {
    var promise = {
        callback: null,
        resolve: function (data) {
            if (typeof this.callback === 'function') {
                this.callback(data);
            } else {
                console.warn('[dataBase] Promise doesn"t work!');
            }
        },
        when: function (callback) {
            this.callback = callback;
        }
    };

    fs.writeFile(PATHS[field], JSON.stringify(data, null, 4), 'utf8', function (err) {
        if (err) {
            promise.resolve({errorText: err});
        } else {
            promise.resolve({succesText: 'Данные сохранены!'});
        }
    });
    return promise;
}

function getPlayers() {
    return dataBase.players;
}
function getPhotos() {
    return dataBase.photos;
}

function getNews() {
    return meetingHelper.getMeetings(dataBase.contents);
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
    getMeetingFields: meetingHelper.getMeetingFields
};

