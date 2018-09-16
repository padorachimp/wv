var gsjson = require('google-spreadsheet-to-json');

var get_data = new Promise(function(resolve, reject) {
  gsjson({
    spreadsheetId: '1nFd4VOmDC829sf2uob3VJuw0LKey0mdiPoBSuwqf7WA',
  })
    .then(function(result) {
      console.log(result.length);
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
          result.push(r);
        }
      });

      var i = 0;
      while ( result.length > i) {
        var title = result[i].whg + ' ' + result[i].gebäude;
        
        i++;
        
      }

      if (i > 0) {
      
        resolve(result);
      } else reject('no result');
    });
  });
}

module.exports = {
  search: search,
};