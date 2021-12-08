var sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(result){
    var list = '<ul>';
    var i = 0;

    while(i < result.length){
      list = list + `<li><a href="/?id=${result[i].id}">${sanitizeHtml(result[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors, author_id){
    var tag = '';
    for(let i = 0; i < authors.length; i++){
      var selected = '';
      if(authors[i].id === author_id){
        selected = ' selected'
      }
      tag += `<option value="${authors[i].id}" ${selected}>${sanitizeHtml(authors[i].name)}</option>`
    }
    return `
      <select name="author">
      ${tag}
      </select>
    `
  },authorTable:function(dbAuthor){
    let tag = '<table>';

    for(let i = 0; i <dbAuthor.length; i++){
        tag += `
            <tr>
                <td>${sanitizeHtml(dbAuthor[i].name)}</td>
                <td>${sanitizeHtml(dbAuthor[i].profile)}</td>
                <td><a href="/author/update?id=${dbAuthor[i].id}">update</a></td>
                <td>
                  <form action="author/delete_process" method="post">
                    <input type="hidden" name="id" value="${dbAuthor[i].id}">
                    <input type="submit" value="delete">
                  </form>
                </td>
            </tr>
        `
    }
    tag += '</table>';
    return tag;
  }
}
