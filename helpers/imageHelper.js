module.exports = {
    handleImages: handleImages,
    addImgSrc: addImgSrc
};

function handleImages(players) {
    console.log('[dataBase] handleImages()');
    return players.map(function (player) {
        if (player.imglink) {

            //hardcode fromat for sinplicity
            // var format = '.'+ RegExp(/\/.*;base64/).exec(player.imgFile)[0].slice(1,-7);
            var format = '.jpg';
            player = addImgSrc(format, player);
            saveImg(player.imglink, player.img, format);
            player.imglink = player.img;
            delete player.img;
        } else {
            delete player.img;
        }
        return player;
    });
}

function addImgSrc (format, player) {
    if (player.img) {
        return player;
    }
    format = format || '.jpg';
    player.img = player.nick.replace(/\s+/g, '') + format;
    return player;
}
