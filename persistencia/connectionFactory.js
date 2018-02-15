var mysql = require('mysql');

function connectDb() {    
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'pele0000',
        database: 'payfast'
    });
}

module.exports = function() {
    return connectDb;
}