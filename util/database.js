// const mongodb = require('mongodb');

// const mongoClient = mongodb.MongoClient;

// var db;

// const mongoConnection = (cb) => {

//   mongoClient.connect('mongodb+srv://Anuradha:Damith123@cluster0-abiin.mongodb.net/test?retryWrites=true&w=majority',{ useUnifiedTopology: true })
//     .then((client) => {
//       db = client.db();
     
//       cb();

//     })
//     .catch(err => {

//       console.log(err);

//     });

// }

// const getDB=()=>{

//   if(db){
   
//     return db;
//   }

//   throw "the database in not connected!!!";
// }


// exports.getDB=getDB;
// exports.MongoConnection=mongoConnection;
