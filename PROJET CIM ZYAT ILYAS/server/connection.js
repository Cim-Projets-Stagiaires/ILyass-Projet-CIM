const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',  
  user: 'root',       
  password: '',   
  database: 'plat_gest_cmd_cim'   
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to database');
});

module.exports = connection;