var defaults = require('../data-base/news/defaults.json');
var meetingFields = require('../data-base/news/meetingFields.json');


function applyDefaults (meetings) {
	var meeting = {};
	var result = [];
	for (var i = 0; i < meetings.length; i++) {
		meeting = meetings[i];
		for (var key in defaults) {
			if (!meeting[key]) {
				meeting[key] = defaults[key];
			}
		}
		result.push(meeting);
	}
	return result;
}

function byDate (meeting1, meeting2) {
	var d1 = new Date(meeting1 && (meeting1.when || meeting1.date));
	var d2 = new Date(meeting2 && (meeting2.when || meeting2.date));
	return d2 - d1;
}

function sortItems (meetings) {
	console.log('[meetings] sortItems()', meetings);
	return meetings.sort(byDate);
}

function addImgs(articles, getPlayerByNick) {
	for (var i = 0; i < articles.length; i++) {
		var article = articles[i];
		if (article.type == 'день рождения') {
			var player = getPlayerByNick(article.number);
			article.img = player.img;
		}
	}
	return articles;
}

function getMeetings(meetings) {
	return sortItems(meetings);
}

function getMeetingFields() {
	return meetingFields;
}
module.exports = {
	sortItemsByDate: sortItems,
	getMeetings: getMeetings,
	getMeetingFields: getMeetingFields,
	addImgs: addImgs,
};