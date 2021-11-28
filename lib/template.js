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
      list = list + `<li><a href="/?id=${result[i].id}">${result[i].title}</a></li>`;
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
      tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`
    }
    return `
      <select name="author">
      ${tag}
      </select>
    `
  }
}
