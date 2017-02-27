var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user: 'sureca',
    database: 'sureca',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
var htmlContent = {
    'valueHtml1': {   
        title : `One`,
        heading : `First app`,
        content : `This is the testing application`,
        date : `date`
    },
    'valueHtml2':{
        title : `Two`,
        heading : `Second app`,
        content : `This is the second testing application`,
        date : `date`
    }
};

function createHtml (input){
    var title = input.title;
    var content = input.content;
    var date = input.date;
    var heading = input.heading;
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
            
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${heading}
                </h3>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                    <p>
                        ${content}
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/indexHTML', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'indexHTML.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

var pool = new Pool(config);

app.get('/test-db',function(req,res){
    pool.query('select * from test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result));
        }
        
    });
});

app.get('/article/:test', function (req, res) {
    //var value = req.params.test
    //res.send(createHtml(htmlContent[value]));

    pool.query("select * from articles where title = '" + req.params.test +"'", function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length === 0){
                res.status(404).send("Article not found");
            }else{
                var articleData = result.rows[0];
                res.send(createHtml(articleData));
            }
        }
    });
 // res.send(createHtml(htmlContent[value]));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
