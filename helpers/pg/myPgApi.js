// var debug = true;
// console.log = function () {
//     if (debug) {
//         console.log(arguments);
//     }
// }

var Record = require('./record.js');
// CRUD-M

function addRecords(table, items) {
    "use strict";

    return make(method.create, table, items);



    // user.reload().then(result => {
    //  return console.log(result.rows[0]);
    // }).catch((error) => {
    //  console.error(error);
    // });
}

function read(table, ids) {
    return make(method.read, table, ids, ids);
}

function create(table, items) {
    return make(method.create, table, items);
}

function del(table, ids) {
    return make(method.delete, table, items, ids);
}

function update(table, item, ids) {
    return make(method.update, table, items, ids);
}

function make(cmd, table, items, ids) {
    items = toArray(items);
    ids = toArray(ids);
    var results = [];
    return items.reduce(function (promise, item, i) {
        var id = ids && ids.length && ids[i];
        return promise.then(function () {
            class BaseUser extends Record {
              constructor(){
                super(table, item, id);
              }
            }
            var user = new BaseUser();
            var result = user[cmd]().catch(function (err) {
                console.log('Error: '+id, err);
                return {item: item, id: id};
            });
            results.push(result);
            return result;
        }, function (err) {
            results.push(err);
            console.log('err', err);
        });
    }, Promise.resolve())
    .then(function (res) {
        console.log('endSuccses', res);
        return Promise.all(results);
    }, function (err) {
        console.log('errInTheEnd', err);
        return Promise.all(results);
    });
}

var method = {
    "create": "save",
    "read": "reload",
    "update": "",
    "delete": "destroy",
}

function toArray(items) {
    return items instanceof Array ? items : items === undefined ? undefined : [items];
}


module.exports = {
    addRecords: addRecords,
    create: create,
    read: read,
    update: update,
    delete: del,
    make: make
};