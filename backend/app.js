var express = require('express');
var mustacheExpress = require('mustache-express');
var request = require('request')  
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');


var app = express();

app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

app.get("/", function(req, res) {
	res.render("index.html")
});

app.get("/hello", function(req, res) {
	res.json({'message' : 'Hello World!'});
});

/* Create Friends table if it doesn't exist. Add given Name and Friends to it.*/
app.post('/addFriends', function(req, res) {
	db.serialize(function() {
		db.run("CREATE TABLE IF NOT EXISTS Friends (Name TEXT, Friends TEXT)");
		var name = req.body.Name;
		var friends = req.body.Friends;
		db.run("INSERT INTO Friends (Name, Friends) VALUES (?, ?)", name, friends);
		res.json({'message': 'Successfully added ' + name + ' and their friends ' + friends + ' to the Friends table.'});
	});
});

/* Delete the Friends table.*/
app.get('/deleteFriendsTable', function(req, res) {
	db.serialize(function() {
		db.run("DELETE FROM Friends;");
		res.json({'message': 'Successfully deleted the Friends table! '});
	});
});
 
/* Get friends of the person with the given name */
app.get('/getFriends', function(req, res) {
	var name = req.query.Name;
	db.all("SELECT Friends FROM Friends WHERE Name = ?", name, function (err, friends) {
		console.log(friends)
		res.json(friends[0]);
	});	
});

app.get('/python', function(req, res) {
	//start.js

	url = req.query.url;

	var spawn = require('child_process').spawn,
	    py    = spawn('python', ['nltk_processor.py']),
	    // data = [1,2,3,4,5,6,7,8,9],
	    dataString = '';

	py.stdout.on('data', function(data){
	  	dataString += data.toString();
	});

	py.stdout.on('end', function(){
	 	console.log('Output is: ',dataString);
		res.json({'message' : 'Output is:  ' + dataString});
	});
	py.stdin.write(JSON.stringify(url));
	py.stdin.end();	
});

app.get('/pythonTest', function(req, res) {
	//start.js

	// url = req.query.url;

	var spawn = require('child_process').spawn,
	    py    = spawn('python', ['compute_input.py']),
	    data = [1,2,3,4,5,6,7,8,9],
	    dataString = '';

	py.stdout.on('data', function(data){
	  	dataString += data.toString();
	});

	py.stdout.on('end', function(){
	 	console.log('Output is: ',dataString);
		res.json({'message' : 'Output is:  ' + dataString});
	});
	py.stdin.write(JSON.stringify(data));
	py.stdin.end();	
});

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


// var server = app.listen(process.env.PORT || 3000, function() {
//   var port = server.address().port;
//   console.log('API is live on port: ' + port + '!');
// });

https.createServer(options, app).listen(443);
