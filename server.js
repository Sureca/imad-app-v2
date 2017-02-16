var express = require('express');
var morgan = require('morgan');
var path = require('path');

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
                    ${date}
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

app.get('/:test', function (req, res) {
  res.send(createHtml(htmlContent[test]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
