var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
const mysql = require('mysql');
const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '09940994',
  database : 'nodejsPractice'
});

db.connect();


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        // fs.readdir('./data', function(error, filelist){
        //   var title = 'Welcome';
        //   var description = 'Hello, Node.js';
        //   var list = template.list(filelist);
        //   var html = template.HTML(title, list,
        //     `<h2>${title}</h2>${description}`,
        //     `<a href="/create">create</a>`
        //   );
        //   response.writeHead(200);
        //   response.end(html);
        // });
        db.query('SELECT * FROM topic', (err, result) => {
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(result);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        // fs.readdir('./data', function(error, filelist){
        //   var filteredId = path.parse(queryData.id).base;
        //   fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        //     var title = queryData.id;
        //     var sanitizedTitle = sanitizeHtml(title);
        //     var sanitizedDescription = sanitizeHtml(description, {
        //       allowedTags:['h1']
        //     });
        //     var list = template.list(filelist);
        //     var html = template.HTML(sanitizedTitle, list,
        //       `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        //       ` <a href="/create">create</a>
        //         <a href="/update?id=${sanitizedTitle}">update</a>
        //         <form action="delete_process" method="post">
        //           <input type="hidden" name="id" value="${sanitizedTitle}">
        //           <input type="submit" value="delete">
        //         </form>`
        //     );
        //     response.writeHead(200);
        //     response.end(html);
        //   });
        // });
        db.query('SELECT * FROM topic', (err, result) => {
          if(err){
            throw err;
          };
          db.query('SELECT * FROM topic WHERE id = ?', [queryData.id], (err2, result) => {
            if(err2){
              throw err2;
            };
            console.log(result);
            var title = result[0].title;
            var description = result[0].description;
            var list = template.list(result);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">create</a>
                  <a href="/update?id=${queryData.id}">update</a>
                  <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete">
                  </form>`
              );
            response.writeHead(200);
            response.end(html);
          }); 
        });
      }
    } else if(pathname === '/create'){
      // fs.readdir('./data', function(error, filelist){
      //   var title = 'WEB - create';
      //   var list = template.list(filelist);
      //   var html = template.HTML(title, list, `
      //     <form action="/create_process" method="post">
      //       <p><input type="text" name="title" placeholder="title"></p>
      //       <p>
      //         <textarea name="description" placeholder="description"></textarea>
      //       </p>
      //       <p>
      //         <input type="submit">
      //       </p>
      //     </form>
      //   `, '');
      //   response.writeHead(200);
      //   response.end(html);
      // });
      db.query('SELECT * FROM topic', (err, result) => {
        var title = 'Create';
        var list = template.list(result);
        var html = template.HTML(title, list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `, '');
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })

          db.query('INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, NOW(), ?)', [post.title, post.description, 1],
          (err, result) =>{
            if(err){
              throw err;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          })
      });
    } else if(pathname === '/update'){
      db.query('SELECT * FROM topic', (err, topics) => {

        if(err) throw err;
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic) =>{
          if(err2) throw err2;


          var list = template.list(topics);
          var html = template.HTML(topic[0].title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?`, [post.title, post.description, post.id], (err, result) => {
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query(`DELETE FROM topic WHERE id= ?`, [post.id], (err, result) =>{
            if(err) throw err;
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
