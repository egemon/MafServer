angular.module('base')
.constant('CONFIG', {
    TEMPLATES_URL: '',
    // STATIC_URL: 'http://localhost:8090',
    STATIC_URL: 'https://bs-static.herokuapp.com',
    LOGIN_URL: 'login',
    SET_URL: 'set',
    DATA_URL: 'data',
    inputTypes: {
        nick: 'text',
        password: 'password',
        vk: 'url',
        birthday: 'date',
        name: 'text',
        phone: 'tel',
        position: 'text',
        memberlevel: 'number',
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
                },{
		        value: 2017,
		        name: "2017 год"
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
