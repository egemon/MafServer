angular.module('base')
.constant('PAGES', [{

    // default page
    url: 'home',
    name: 'О нас',
    needMemberLevel: 0
},{
    url: 'news',
    name: 'Новости',
    needData: true,
    needMemberLevel: 0
},{
    url: 'rating',
    name: 'Рейтинг',
    controller: 'RatingCtrl as RatingCtrl',
    needData: true,
    needMemberLevel: 0
},{
    url: 'members',
    name: 'Члены клуба',
    needData: true,
    needMemberLevel: 0
},{
    url: 'hall_of_fame',
    name: 'Зал Славы',
    needData: true,
    needMemberLevel: 0
},{
    url: 'photos',
    name: 'Фото',
    controller: 'photosCtrl as photosCtrl',
    needData: true,
    needMemberLevel: 0
},{
    url: 'contacts',
    name: 'Контакты',
    needData: true,
    needMemberLevel: 0
},{
    url: 'protocol',
    name: 'Бланки',
    needMemberLevel: 3
},{
    url: 'players',
    name: 'Игроки',
    controller: 'playersCtrl as playersCtrl',
    needData: true,
    needMemberLevel: 3
},{
    url: 'contents',
    name: 'Контент',
    controller: 'contentsCtrl as contentsCtrl',
    needData: true,
    needMemberLevel: 3
},{
    url: 'register',
    name: 'Регистрация',
    controller: 'registerCtrl as registerCtrl',
    needData: true,
    needMemberLevel: 3
}]);