const mysql = require('mysql');

// Create Database Connection in Mysql

// var connection = mysql.createConnection({
//   host: "oepp-test-db.cicpyn8m19jx.ap-south-1.rds.amazonaws.com",
//   user: "test-user",
//   password: "g1br3AL",
//   database: "automate1_test",
//   insecureAuth : true,
//   dateStrings : true 
//  });

var connection = mysql.createConnection({
  "host": "13.232.19.121",
  "user": "test-user",
  "database": "automate1_test",
  "password": "g1br3AL",
  insecureAuth : true, 
  dateStrings : true  
 });  
 

connection.connect(function(err,res) {
  if (err) {
        console.error('database not connected : ' + err.stack);
        return;
      }
    console.log('Database Connnected');
});

module.exports = connection;