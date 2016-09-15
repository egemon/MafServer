angular.module('base').controller('honoursCtrl',
	function($scope, serverService, $q) {
		var vm = this;
		var defaultHonours = [
			{
				place: 1,
			},{
				place: 2,
			},{
				place: 3,
			},
		];
		vm.newHonours = angular.copy(defaultHonours);
		serverService.read('players').then(function (players) {
			vm.playerNicks = _.map(players, 'nick');
		});

		vm.addHonours = addHonours;
		vm.removeHonours = removeHonours;

		function addHonours () {
			var honoursPromises = _.map(vm.newHonours, function (honour) {

				//TODO: remove after period refactoring
				if (vm.dateTime.periodType === 'month') {
					vm.dateTime.period--;
				}

				honour.periodtype = vm.dateTime.periodType;
				honour.period = vm.dateTime.period.value;
				honour.year = vm.dateTime.year.value;
				return  serverService.create('honours', honour);
			});
			return $q.all(honoursPromises).then(function () {
				location.reload();
			});
		}

		function removeHonours (timePeriod) {
			return serverService.delete('honours', _.map(timePeriod.honours, 'id')).then(function () {
				location.reload();
			});;
		}


});