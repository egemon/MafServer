angular.module('timer')
.controller('timerCtrl', ['$scope', '$interval', timerCtrl]);

function timerCtrl ($scope, $interval) {
    var STATES = ['Старт', 'Пауза'];
    var vm = this;
    //======= FIELDS =========
    vm.state = 'Старт';
    vm.time = 0;


    //======== METHODS ==========
    vm.toggleState =  toggleState;
    vm.reset =  reset;

    //////////////

    function toggleState() {
        switch(vm.state) {
            case 'Старт':
                intervalID = $interval(increaseTime, 1000);
                vm.state = 'Пауза';
            break;
            case 'Пауза':
                $interval.cancel(intervalID);
                vm.state = 'Старт';
            break;
        }
    }

    function reset() {
        vm.time = 0;
        vm.state = 'Старт';
        $interval.cancel(intervalID);
    }

    //private
    var intervalID = null;
    function increaseTime() {
        vm.time++;
    }
}
