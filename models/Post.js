const mysql = require('mysql');

exports.up = function(db, callback) {  db.createTable('user', {
    id: {
      type: 'int',
      primaryKey: true
    },
    full_name: {
      type: 'string',
      length: 40
    },
    dob: {
      type: 'date'
    },
    email: {
      type: 'string',
      length: 50
    },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });};exports.down = function(db, callback) {  db.dropTable('user', callback);};