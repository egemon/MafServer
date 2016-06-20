angular.module('ProtocolApp').filter('translate', function () {
    var TRANSLATOR = {
        hanged: 'Повешен',
        killed: 'Убит',
        checkedS: 'Проверен',
        checkedD: 'Прослежен',
    };
    return function (key) {
        return TRANSLATOR[key];
    };
});