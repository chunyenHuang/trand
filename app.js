var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

app.use(express.static('./public/'));

if (!require.main.loaded) {
  app.listen(port, function () {
    console.log('running on port: '+port);
  })
}

app.on('close', function() {
  console.log('rs');
})

module.exports = app;
