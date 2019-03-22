import express from 'express';
import Zoho from 'zoho';
import _ from 'lodash';
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

const router = express.Router();
const Token = 'YOUR-AUTH-TOKEN';
const crm = new Zoho.CRM({
  authtoken: Token
});

// create application/x-www-form-urlencoded parser
let loop_break = 0;
let count = 1;
let initial = 1;
let final = 0;
let end=200;
for(let start=1; start<=end; start++){
  loop_break++;
  if(start==end){
    count++;
    final=end;
crm.getRecords('Leads', {"fromIndex":initial, "toIndex":final }, function (err, data) {
  if (err) {
    return console.log(err);
  }
  var individual = data.data.Leads.row;
  individual.forEach(element => {
    let obj = {}
    for (let i = 0; i < element.FL.length; i++) {
      obj[element.FL[i].val] = element.FL[i].content;
    }
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, (err, db) => {
      if (err) {
        throw err;
      }
      let dbo = db.db('zoho');
      dbo.collection('Leads').insert(obj, ((err, res) => {
        if (err) {
          throw err;
        }
        console.log('done')
      }))
    })
  });
});
    initial = start+1;
    end=count*200;
  }
  else{
    if(loop_break>2600){
      break;
    }
  }
}

export default router;