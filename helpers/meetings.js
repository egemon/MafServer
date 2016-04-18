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
	var d1 = new Date(meeting1.when);
	var d2 = new Date(meeting2.when);
	return d2 - d1;
}

function sortMeetings (meetings) {
	console.log('[meetings] sortMeetings()', meetings);
	return meetings.sort(byDate);
}

function getMeetings(meetings) {
	return sortMeetings(applyDefaults(meetings));
}

function getMeetingFields() {
	return meetingFields;
}
module.exports = {
	getMeetings: getMeetings,
	getMeetingFields: getMeetingFields
};