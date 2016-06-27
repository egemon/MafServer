angular.module('base').directive('newPlayer', ()=>{

    return {
        scope: {
            fields:"=",
            addPlayer: "&",
            addPresent: "&",
            startEdit:'&',
            removeItem:'&'
        },
        controller: "newPlayerCtrl as newPlayer",
        restrict: 'A',
        templateUrl: 'newPlayer/new-player.html'
    };
});
