const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '09940994',
    database : 'nodejsPractice'
});
db.connect();
module.exports = db;
