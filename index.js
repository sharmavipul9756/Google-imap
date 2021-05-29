const express = require('express');
const app = express();
const port = process.env.port || 3000;
var imaps = require('imap-simple');
const _ = require('lodash');
const simpleParser = require('mailparser').simpleParser;
app.get('/',(req, res)=>{
    res.render('login')
})
app.use(express.urlencoded({extended: true}))

 app.post('/',(req, res) => {
     const email = req.body.exampleInputEmail;
     const password = req.body.exampleInputPassword;
     var config = {
        imap: {
            user: email,
            password: password,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 5000,
            tlsOptions: {
                rejectUnauthorized: false
            }
        }
    };
    console.log(email);
    imaps.connect(config).then(function (connection) {
 
        return connection.openBox('INBOX').then(function () {
            var searchCriteria = [
                'ALL'
            ];
     
            var fetchOptions = {
                bodies: ['HEADER', 'TEXT'],
                markSeen: false
            };
     
            return connection.search(searchCriteria, fetchOptions).then(function (results) {
                var from = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'HEADER';
                    })[0].body.from[0];
                });
                var dates = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'HEADER';
                    })[0].body.date[0];
                });
                var to = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'HEADER';
                    })[0].body.to[0];
                });
                var size = results.map(function (res) {
                    return res.parts.filter(function (part) {
                        return part.which === 'TEXT';
                    })[0].body.length;
                });
                console.log(size)
                res.render('index',{
                    to : to,
                    from : from,
                    dates : dates,
                    size : size
                })

                // =>
                //   [ 'Hey Chad, long time no see!',
                //     'Your amazon.com monthly statement',
                //     'Hacker Newsletter Issue #445' ]
            });
            
        });
    });
   
 })


  app.set('view engine', "hbs")
  app.use(express.static("public"));
 app.get('/details', (req,res,next) => {
    
    // res.end()
 })


app.listen(port,()=>{console.log("listening to port" + port);});