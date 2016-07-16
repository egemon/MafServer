var Record = require('./record.js');


function addRecords(table, items) {
    "use strict";
    items.reduce(function (promise, item) {
        return promise.then(function () {
            class BaseUser extends Record {
              constructor(){
                super(table, item);
              }
            }
            var user = new BaseUser();
            return user.save();
        }, function (err) {
            console.log('err', err);
        });
    }, Promise.resolve()).then(function (res) {
        console.log('fullSuccses', res);
    }, function (err) {
        console.log('errInTheEnd', err);
    });



    // user.reload().then(result => {
    //  return console.log(result.rows[0]);
    // }).catch((error) => {
    //  console.error(error);
    // });
}


module.exports.addRecords = addRecords;