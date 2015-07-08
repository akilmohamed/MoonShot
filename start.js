var express = require('express'),
    path = require('path'),
    http = require('http');
var routes = require('./routes');
var moonshot = require('./routes/moonshot');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var appDir = path.dirname(require.main.filename);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);
app.get('/moonshot', moonshot.findAll);
app.get('/moonshot/:id', moonshot.findById);
app.get('/moonshot/:id/:size', moonshot.thumbnail);
app.post('/moonshot/add',multipartMiddleware, moonshot.addMoonShot);
app.put('/moonshot/:id', moonshot.updateMoonShot);
app.delete('/moonshot/:id', moonshot.deleteMoonShot);

 
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});