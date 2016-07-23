(function () {
angular.module('server')
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
	                priority: getPeriodPriority(honour.periodtype, honour.period)
	            };
	        }
	        period.honours[honour.place - 1] = honour;
	    }
	    var periodsArray = [];
	    for (var title in periods) {
	        periods[title].title = title;
	        periodsArray.push(periods[title]);
	    }
	    return periodsArray;
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


	function getPeriodPriority (periodType, period) {
	    return periodType === "season" ? period * 3 - 3 / 2 : period ;
	}
}]);
})();