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
                <form action="/author/create_process" method = "post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="create">
                    </p>
                </form>
                `,
                ``
                );
            response.writeHead(200);
            response.end(html);
        })
    })
};

exports.create_process = (request, response) => {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('INSERT INTO author(name, profile) VALUES(?, ?)', [post.name, post.profile],
        (err, result) =>{
          if(err){
            throw err;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
        })
    });
  };

exports.update = (request, response) =>{
    db.query(`SELECT * FROM topic`, (err, dblist) => {
        if(err) throw err;
        db.query(`SELECT * FROM author`, (err, dbAuthor) => {
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query('SELECT * FROM author WHERE id=?', [queryData.id], (err3, author) => {
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
                    <form action="/author/update_process" method = "post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${author[0].name}" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                    </form>
                    `,
                    ``
                    );
                response.writeHead(200);
                response.end(html);
            })
        })
    })
};

exports.update_process = (request, response) => {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('UPDATE author SET name=?, profile=? WHERE id=?', [post.name, post.profile, post.id],
        (err, result) =>{
          if(err){
            throw err;
          }
          response.writeHead(302, {Location: `/author`});
          response.end();
        })
    });
  };

exports.delete_process = (request, response) => {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id], (err, result) => {
            if(err) throw err;
            db.query(`DELETE FROM author WHERE id= ?`, [post.id], (err2, result2) =>{
                if(err2) throw err;
                response.writeHead(302, {Location: `/author`});
                response.end();
            })
        })
    });
  }