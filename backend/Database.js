const {Client}=require('pg')
const db=new Client({host:"localhost",
user:"postgres",
port:5432,
password:"Yns$0821",
database:"customer"})

db.connect();

module.exports=db