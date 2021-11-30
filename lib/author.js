const db = require('./db');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');

exports.home = (request, response) =>{
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (err, dblist) => {
        if(err) throw err;
        db.query(`SELECT * FROM author`, (err, dbAuthor) => {
            var title = 'author';
            var list = template.list(dblist);
            var html = template.HTML(title, list,
                `
                ${template.authorTable(dbAuthor)}
                <style>
                table{
                    border-collapse:collapse;
                }
                td{
                    border: 1px solid black;
                }
                </style>
                `,
                `<a href="/create">create</a>`
                );
            response.writeHead(200);
            response.end(html);
        })
    })
}