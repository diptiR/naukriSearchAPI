var fs = require('fs');
var express = require('express');
const bodyParser = require("body-parser");
var app = express();


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send("HELLO WORLD");
});

let obj = [];
function firstEntry(skill) {
    obj.push(skill);
    var json = JSON.stringify(obj);
    fs.writeFile('./skills.json', json, 'utf8', function callback(err, data) {
        if (err) return console.error(err);
    });
}

function appendEntry(skill) {
    fs.readFile('skills.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            firstEntry()
        } else {
            obj = data ? JSON.parse(data) : []; //now it an object
            obj.push(skill); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('skills.json', json, 'utf8', function callback(err, data) {
                if (err) return console.error(err);
            }); // write it back 
        }
    });
}

app.post('/create-skill', function (req, res) {
    fs.stat('skills.json', function (err, stat) {
        if (err == null) {
            // File exists
            appendEntry(req.body);
        } else if (err.code === 'ENOENT') {
            // file does not exist
            firstEntry(req.body);
        } else {
            console.log('Some other error: ', err.code);
        }
    });
    res.end("yes");
});

function getSkills() {
    let skills;
    return fs.readFile('skills.json', 'utf8', function readFileCallback(err, data) {
        skills = data ? JSON.parse(data) : []; //now it an object   
        return skills
    });
}

app.get('/skills', function (req, res) {
    let skills_res;
    fs.stat('skills.json', function (err, stat) {
        if (err == null) {
            // File exists
            fs.readFile('skills.json', 'utf8', function readFileCallback(err, data) {
                skills_res = data ? JSON.parse(data) : []; //now it an object  
                res.json(skills_res);
            });
        } else {
            res.json([]);
        }
    });
});

app.post('/search-skill', function (req, res) {
    //gets the seatch parameter from angular
    param = req.body;

    res.send("Hi!");
    var child = require('child_process').spawn('java', ['-cp', param + '.jar', param]);

    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.stderr.on("data", function (data) {
        console.log(data.toString());
    });
});

app.listen(3000);