(function () {
    angular.module('base').controller('registerCtrl', ['$scope', 'serverService', registerCtrl]);

    function registerCtrl($scope, serverService) {
        console.log('[register.controller.js] registerCtrl()', arguments);
        var vm = this;

        // ========= INIT PART
        restoreDefaults();
        $scope.$on('register-request', restoreDefaults);
        $scope.$watch('date', function(newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            $scope.fetchDataFor(null, {
                date: dateToStr($scope.date)
            });
        });


        vm.setRegister = setRegister;
        vm.getSum = getSum;
        vm.isValid = isValid;
        vm.playerNicks = [];

        // ========= METHODS =============
        function setRegister(register, date) {
            for (var i = 0; i < register.length; i++) {
                if (register[i].nick === null) {
                    register[i].nick = '';
                }
                if (register[i].sum === null) {
                    register[i].sum = 0;
                }
                if (register[i].debt === null) {
                    register[i].debt = 0;
                }

            }

         //TODO: implement registation
        }

        function getSum() {
            if (!$scope.register) {
                return;
            }
            return $scope.register.data.reduce(function (prev, cur) {
             return prev + cur.sum;
            }, 0);
        }

        function isValid() {
            if (!$scope.register) {
                return;
            }
            return $scope.register.data.reduce(function (prev, cur) {
                 return prev && cur.nick;
             }, true);
        }

        // ====== HELPERS ========
        function dateToStr(date) {
            return date.toISOString().split('T')[0];
        }

        function restoreDefaults() {
            $scope.date = new Date();
            serverService.$_fetchData({url:'players'}).then(updateAutocomplete);
        }

        function updateAutocomplete(data) {
            vm.playerNicks = data.data.map(function(el) {
                return el.nick;
            });
        }
    }

})();
