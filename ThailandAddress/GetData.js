/* var gsjson = require('google-spreadsheet-to-json');
var Set = require('Set');
var fs = require('fs');
var get_data = new Promise(function(resolve, reject) {
  gsjson({
    spreadsheetId: '1nFd4VOmDC829sf2uob3VJuw0LKey0mdiPoBSuwqf7WA',
  })
    .then(function(result) {
      console.log("hello");
      //cashData(result);
      resolve(result);
    })
    .catch(function(err) {
      console.log(err.message);
      console.log(err.stack);
      reject(err);
    });
});

function search(params) {
  return new Promise((resolve, reject) => {
    get_data.then(data => {
      console.log(data.length);
 
      var result = [];
      data.forEach(r => {
        //if (r.zimmer == size && r.geschoss == floor && r.garten == garden[0]) 
        {
          result.push(r.province);
        }
      });

      
      

   
      if (result){
        
        resolve(result);
      } else reject('no result');
    });
  });
}


function cashData(cashing){
fs.readFile(__dirname + '/data.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    
   //convert it back to json
      console.log(cashing);
      var json = JSON.stringify(cashing);
    fs.writeFile(__dirname + '/data.json', json, 'utf8',(err) => {
  if (err) throw err;
  console.log('The file has been saved!');})
}
});

}

module.exports = {
  search: search,
}; 
*/