(function () {
angular.module('ProtocolApp')
.service('pgService', ['$http', 'CONFIG', '$cookies',
    function pgService ($http, CONFIG) {
    this.putGame = function putGame(game) {
        return $http.post(CONFIG.BASE_SERVER_URL + '/api/v1/games', game)
        .then(function (resp) {
            console.log('resp.data', resp.data);
            return resp.data;
        });
    };


}]);


})();