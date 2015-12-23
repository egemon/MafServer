var defaults = require('../data-base/news/defaults.json');

function applyDefaults (meetings) {
	var meeting = {};
	var result = [];
	for (var i = 0; i < meetings.length; i++) {
		meeting = meetings[i]
		for (var key in defaults) {
			if (!meeting[key]) {
				meeting[key] = defaults[key];
			};
		};
		result.push(meeting);
	};
	return result;
}

function byNumber (meeting1, meeting2) {
	return meeting1.number - meeting2.number;
}

function sortMeetings (meetings) {
	return meetings.sort(byNumber);
}

function getMeetings(meetings) {
	return sortMeetings(applyDefaults(meetings)) 	
} 
module.exports = {
	getMeetings: getMeetings
}