angular.module('config')
.constant('CONFIG', {
    TEMPLATES_URL: '',
    BASE_SERVER_URL: 'http://bs-mafiaclub.rhcloud.com/', //http://bs-mafiaclub.rhcloud.com/
    LOGIN_URL: 'login',
    SET_URL: 'set',
    inputTypes: {
        nick: 'text',
        password: 'password',
        vk: 'url',
        birthday: 'date',
        name: 'text',
        phone: 'tel',
        position: 'text',
        memberLevel: 'number',
        faculty: 'text',
        experiance: 'text'
    },
    filterFields: {
        "month":{
            name: "Месяц",
            value: [
            {
                value: 1,
                name: 'Январь'
            },{
                value: 2,
                name: 'Февраль'
            },{
                value: 3,
                name: 'Март'
            },{
                value: 4,
                name: 'Апрель'
            },{
                value: 5,
                name: 'Май'
            },{
                value: 6,
                name: 'Июнь'
            },{
                value: 7,
                name: 'Июль'
            },{
                value: 8,
                name: 'Август'
            },{
                value: 9,
                name: 'Сентябрь'
            },{
                value: 10,
                name: 'Октябрь'
            },{
                value: 11,
                name: 'Ноябрь'
            },{
                value: 12,
                name: 'Декабрь'
            }]
        },
        "year":{
            name: "Год",
            value: [
                {
                    value: 2015,
                    name: "2015 год"
                },{
                    value: 2016,
                    name: "2016 год"
                }
            ]
        },
        "season":{
            name: "Сезон",
            value: [
                {
                    value: 1,
                    name: 'Зима'
                },{
                    value: 2,
                    name: 'Весна'
                },{
                    value: 3,
                    name: 'Лето'
                },{
                    value: 4,
                    name: 'Осень'
                }
            ]
        }
    }
});