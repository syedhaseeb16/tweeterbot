var fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");
const neatCsv = require("neat-csv");
request = require('request')


module.exports.writestats = async function writestats(data) {

    var d = new Date();
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var dir = date + "-" + month + "-" + year;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var stats = data;
    const csv = new ObjectsToCsv(stats);
    await csv.toDisk("./"+dir+"/" + dir+".csv");
    return "ok";
  };




  module.exports.download = function(uri, name, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);


        var d = new Date();
        var date = d.getDate();
        var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
        var year = d.getFullYear();
        var dir = date + "-" + month + "-" + year;


        // let str=name.replace(/[^a-zA-Z ]/g, "");
        // str=str.replace(' ',"_");
        // let len=str.length;
        // var nam = str.substring(0, (len/6));
     
      request(uri).pipe(fs.createWriteStream("./"+dir+"/"+name+".jpg")).on('close', callback);
    });
  };

  
  // module.exports.ReadandSend = async function ReadNumberofStock() {
  //   let data_o = [];
  //   data_o = fs.readFileSync("./src/list.csv");
  //    await neatCsv(data_o);
  // };
  

