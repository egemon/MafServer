"use strict";
var _ = require('lodash');
var Connection = require('./connection.js');

module.exports = class Record extends Connection {
  constructor(table_name, attrs, record_id){

    super();

    this.attributes = attrs;
    this.table_name = table_name;
    this.record_id =  record_id;
    this.sql_fetcher = `select * from ${this.table_name} `;

  }

  identifierCondition(){
    if (this.record_id === '' || this.record_id === null) {
      throw new Error('Unable to identify record. Id is absent.');
    }

    return `where id = ${this.record_id}`;
  }

  assign_attributes(attrs){
    this.attributes = attrs;

    return this.attributes;
  }

  getAttributes(){
    return this.attributes;
  }

  reload(){
    this.sql = `${this.sql_fetcher} ${this.identifierCondition()} limit 1`;
    return this.execQuery().then( data => data.rows[0]);
  }

  getBy(filters, params) {
    var self = this;
    self.sql = `${self.sql_fetcher} where `;
    _.each(filters, function (checker, key) {
      self.sql += `${key} ${checker} and `;
    });
    self.sql = self.sql.slice(0, self.sql.lastIndexOf('and')) +
    self.sql.slice(self.sql.lastIndexOf('and')).replace('and', '');
    _.each(params, function (val, key) {
	   self.sql += `${key} ${val} `
    });

    return self.execQuery().then( data => data.rows);
  }

  getAll(filters, params){
	this.sql = `${this.sql_fetcher}`;
	_.each(params, (val, key)=> {
		this.sql += `${key} ${val} `
	});
	return this.execQuery().then( data => data.rows);
  }

  save(){
    if (this.record_id) {
      throw new Error("Record#update method isn't implemented yet.");
      // this.sql = this.updateSql();
    } else {
      this.sql = this.insertSql();
    }

    return this.execQuery().then( data => this.record_id = data.rows[0] && data.rows[0].id);
  }

  update(){
    this.sql = this.updateSql();
    return this.execQuery().then( data => this.record_id = data.rows[0] && data.rows[0].id);
  }

  destroy(){
    this.sql = this.deleteSql();
    return this.execQuery().then( data => this.record_id = data.rows[0] && data.rows[0].id);
  }

  deleteSql(){
    return `delete from ${this.table_name} ${this.identifierCondition()} returning id`;
  }

  columns(prefix){
    return _.keys(this.attributes).map((k) => {
      if(prefix) {
        return `${prefix}.${k}`;
      } else {
        return k;
      }
    });
  }

  values(){
    return _.values(this.attributes)
    .map( e => {
      if (_.isNumber(e)) {
        return e;
      } else {
        return `'${e}'`;
      }
    });
  }

  insertSql(){
    let columns = this.columns().join(', ');
    return `insert into ${this.table_name} (${columns}) values(${this.values()}) returning id;`
  }

  updateSql(){
    let columns = this.columns().join(', ');
    return `update ${this.table_name} set
    (${columns}) = (${this.values()})
    ${this.identifierCondition()}
    returning id;`;
  }

};
//
// let obj = {id: 1905, login: 'user', email: 'user@cogniance.com'};
// let obj = {login: 'user1', email: 'user@cogniance.com1'};
// var user = new Record('users', 1955, obj);

//Examples of usage
// user.destroy().then(result => {
//   console.log(user.sql);
//   return console.log(result)
// }).catch((error) => {
//   console.error(error);
// });

// user.reload().then(result => {
//   return console.log(result.rows[0])
// }).catch((error) => {
//   console.error(error);
// });


