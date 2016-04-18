var express = require('express');
var app = express();

app.use(express.static('./public/'));

if (!require.main.loaded) {
  app.listen(3000, function () {
    console.log('running on port: 3000');
  })
}

app.on('close', function() {
  console.log('rs');
})

module.exports = app;
