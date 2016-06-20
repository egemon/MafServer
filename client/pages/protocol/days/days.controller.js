angular.module('ProtocolApp')
.controller('DaysCtrl', ['$scope', 'club', DaysCtrl]);

function DaysCtrl ($scope, club) {
    console.log('[days.controller] init');


    this.state = 'stopped';

    $scope.days = [angular.copy(club.defaultDay)];
    var currentDay = 0;

    this.decrNumber = decrNumber;
    this.incrNumber = incrNumber;
    this.startGame = startGame;
    this.addVote = addVote;
    this.addDay = addDay;
    this.removeItem = removeItem;

    function startGame () {
        console.log('[days.controller] startGame()');
        this.state = 'started';
    }

    function decrNumber(details, key) {
        console.log('[days.controller] decrNumber()', arguments);
        details[key]--;
    }

    function incrNumber(details, key) {
        console.log('[days.controller] incrNumber()', arguments);
        details[key]++;
    }

    function addVote(votes) {
        console.log('[days.controller] addVote()', arguments);
        votes.push(angular.copy(club.defaultVote));
    }

    function addDay() {
        $scope.days.push(angular.copy(club.defaultDay));
        currentDay++;
    }

    function removeItem(vote ,arr) {
        var i = arr.indexOf(vote);
        arr.splice(i, 1);
    }
}
