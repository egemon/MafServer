(function () {
angular.module('base')
.service('serverHelper', [
function serverHelper () {
	var honourTitle = "Лучшие игроки";
	var MONTHS = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
	var SEASONS = ["","ЗИМЫ", 'ВЕСНЫ', "ЛЕТА", "ОСЕНИ"];

	return {
		getHallOfFame: createPeriods
	};

	function createPeriods (honours) {
	    var periods = {};
	    var periodTitle = "";
	    var period = {};
	    var honour = {};
	    for (var i = 0; i < honours.length; i++) {
	        honour = honours[i];
	        periodTitle = createPeriodTitle(honours[i]);
	        period = periods[periodTitle];
	        if (!period) {
	            period = periods[periodTitle] = {
	                honours: [],
	                year: honour.year,
	                periodType: honour.periodtype,
	                period: honour.period,
	                priority: getPeriodPriority(honour.periodtype, honour.period, honour.year)
	            };
	        }
	        period.honours[honour.place - 1] = honour;
	    }
	    var periodsArray = [];
	    for (var title in periods) {
	        periods[title].title = title;
	        periodsArray.push(periods[title]);
	    }
	    console.log(_.map(periodsArray, 'priority'));
	    return _.chain(periodsArray)
	    	.sortBy('priority')
	    	.reverse()
	    	.value();
	}

	function createPeriodTitle (honour) {
	    switch (honour.periodtype) {
	        case "year":
	            return honourTitle + ' ' + honour.period + '-го года';
	        case "season":
	            return honourTitle + ' ' + SEASONS[honour.period] + ' '+ honour.year;
	        case "month":
	            return honourTitle + ' ' + MONTHS[honour.period] + ' '+ honour.year;
	    }
	}


	function getPeriodPriority (periodType, period, year) {
		var priorInYear = 0;
		switch (periodType) {
			case 'month':
				priorInYear = period;
			break;
			case 'season':
				priorInYear = period * 3 - 3 / 2;
			break;
			case 'year':
				priorInYear = 11.5;
			break;
		}
	    return year + priorInYear / 100;
	}
}]);
})();