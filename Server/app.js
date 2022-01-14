var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');
var cors = require('cors');

var app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({type: '*/*'}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'));
var session = driver.session();

app.get('/get-all-users', (req, res) => {
    let users = [];
    session.run("MATCH(user:KORISNIK) RETURN user")
        .then(result => {
            result.records.forEach(record => {
                users.push(record._fields[0].properties);
            })
            res.send(JSON.stringify(users));
        })
        .catch(err => {
            res.send(err);
        })
})

app.get('/get-all-surveys', (req, res) => {
    let surveys = [];
    session.run("MATCH(anketa:ANKETA) RETURN anketa")
        .then(result => {
            result.records.forEach(record => {
                surveys.push(record._fields[0].properties);
            })
            res.send(JSON.stringify(surveys));
        })
        .catch(err => {
            res.send(err);
        })
})

app.get('/get-all-type-of-games', (req, res) => {
    let types = [];
    session.run("MATCH(tip_igrica:TIP_IGRICA) RETURN tip_igrica")
        .then(result => {
            result.records.forEach(record => {
                types.push(record._fields[0].properties);
            })
            res.send(JSON.stringify(types));
        })
        .catch(err => {
            res.send(err);
        })
})

app.get('/get-all-games', (req, res) => {
    let games = [];
    session.run("MATCH(igrica:IGRICA) RETURN igrica")
        .then(result => {
            result.records.forEach(record => {
                games.push(record._fields[0].properties);
            })
            res.send(JSON.stringify(games));
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/get-user', (req, res) => {
    const userName = req.body.username;
    session.run(`MATCH(user:KORISNIK) WHERE user.username = "${userName}" RETURN user`)
        .then(result => {
            res.send({status:200, body: JSON.parse(result.records[0]._fields[0].properties)});
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/get-user-by-username', (req, res) => {
    const userName = req.body.token.token;
    session.run(`MATCH(user:KORISNIK) WHERE user.username = "${userName}" RETURN user`)
        .then(result => {
            res.send({status:200, body: result.records[0]._fields[0].properties});
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/get-user-surveys', (req, res) => {
    const userName = req.body.username;
    console.log(userName);
    let surveys = [];

    session.run(`MATCH(n:KORISNIK {username: "${userName}"}) -[v:IZABRAO]-> (m:ANKETA) RETURN m`)
        .then(result => {
            result.records.forEach(record => {
                surveys.push(record._fields[0].properties.naziv);
            })
            console.log(surveys)
            res.send(JSON.stringify(surveys));
        })
        .catch(err => {
            res.send(err);
        })
})

app.get('/get-filtered-types', (req, res) => {
    const userName = req.body.username;
    //const selectedSurvey = req.body.selectedSurvey;
    let surveys = [];

    session.run(`MATCH(n:KORISNIK {username: "${userName}"}) -[v:IZABRAO]-> 
    (a:ANKETA) -[sv:FILTRIRANO]-> (m:TIP_IGRICA) RETURN m`)
        .then(result => {
            result.records.forEach(record => {
                surveys.push(record._fields[0].properties);
            })
            res.send(JSON.stringify(surveys));
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/get-recomended-games', (req, res) => {
    const userName = req.body.username;
    const nazivAnkete = req.body.nazivAnkete;
    const games = [];

    session.run(`MATCH(n:KORISNIK {username: "${userName}"}) -[v:IZABRAO]-> 
    (a:ANKETA {naziv: "${nazivAnkete}"}) -[vs:FILTRIRANO]-> (m:TIP_IGRICA) -[vv:PREPORUCENO]-> (k:IGRICA) RETURN k`)
        .then(result2 => {
            result2.records.forEach(game => {
                games.push(game._fields[0].properties);
            })
            res.send(JSON.stringify(games));
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/set-user', (req, res) => {
    const newUser = req.body;

    session.run(`CREATE(n:KORISNIK {ime:"${newUser.ime}", prezime:"${newUser.prezime}", username:"${newUser.username}"
    , sifra:"${newUser.sifra}", email:"${newUser.email}"})`)
        .then(resposne => {
            res.send(resposne);
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/set-survey', (req, res) => {
    const newSurvey = req.body

    session.run(`CREATE (m:ANKETA {naziv: "${newSurvey.naziv}", gVrednost: ${newSurvey.gVrednost}, 
    dVrednost: ${newSurvey.dVrednost}, avgVrednost: ${newSurvey.avgVrednost}})`)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/set-survey-connection', (req, res) => {
    const newSurveyConnection = req.body;

    session.run(`MATCH(n:KORISNIK {username:"${newSurveyConnection.username}"}), (m:ANKETA {naziv:"${newSurveyConnection.nazivAnkete}"})
    CREATE (n)-[v:IZABRAO]->(m)`)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/set-recomended-category', (req, res) => {
    const recCat = req.body;

    session.run(`MATCH(n:ANKETA {naziv:"${recCat.nazivAnkete}"}), (m:TIP_IGRICA {naziv:"${recCat.nazivTipa}"})
    CREATE (n)-[v:FILTRIRANO {precizno: ${recCat.precizno}}]->(m)`)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.send(err);
        })
})

app.listen(3000);
console.log('Server Started on Port 3000');

module.exports = app;