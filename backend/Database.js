const {Client}=require('pg')
const db=new Client({host:"localhost",
user:process.env.REACT_APP_DATABASE_USER,
port:process.env.REACT_APP_DATABASE_PORT,
password:process.env.REACT_APP_DATABASE_PASSWORD,
database:process.env.REACT_APP_DATABASE_NAME})

db.connect();
console.log("Connected To DataBase")
module.exports=db