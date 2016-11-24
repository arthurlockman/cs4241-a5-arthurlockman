var http = require('http')
  , fs   = require('fs')
  , mustache = require('mustache')
  , marked = require('marked')
  , url  = require('url')
  , querystring = require('querystring')
  , port = 8080
  , aws = require('aws-sdk')

var movies = []
//Load movies from S3
s3 = new aws.S3()

function loadFromS3()
{
  var params = {Bucket: 'cs4241', Key: 'movies.txt'}
  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      movies = data.Body.toString().split('\n')
    }
  })
}

loadFromS3()

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/search':
      handleSearch(res, uri)
      break
    case '/add':
      handleAddMovie(res, req, uri)
      break
    case '/delete':
      handleDeleteMovie(res, req, uri)
      break
    case '/':
      sendIndex(res)
      break
    case '/index.html':
      sendIndex(res)
      break
    case '/template.html':
      sendFile(res, 'template.html')
      break
    case '/css/style.css':
      sendFile(res, 'style.css', 'text/css')
      break
    case '/js/scripts.js':
      sendFile(res, 'scripts.js', 'text/javascript')
      break
    case '/server.js':
      sendFile(res, 'server.js', 'text/javascript')
      break
    case '/template.html':
      sendFile(res, 'template.html')
      break
    case '/movies.txt':
      sendFile(res, 'movies.txt')
      break
    case '/readme.md':
    case '/README.md':
      sendReadme(res)
      break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

// subroutines

function handleAddMovie(res, req, uri) {
  if (req.method == 'POST') {
    var postData = ''
    req.on('data', function (data) {
      postData += data
    })
    req.on('end', function () {
      var post = querystring.parse(postData)
      addMovie(post.movie)
      sendIndex(res)
    })
  }
}

function handleDeleteMovie(res, req, uri) {
  if (req.method == 'POST') {
    var postData = ''
    req.on('data', function (data) {
      postData += data
    })
    req.on('end', function () {
      var post = querystring.parse(postData)
      deleteMovie(post.movie)
      sendIndex(res)
    })
  }
}

function addMovie(movieName)
{
  movies.push(movieName)
  var outString = movies.join('\n')
  writeMovieListToS3(outString)
}

function deleteMovie(movieName)
{
  var idx = movies.indexOf(movieName)
  if (idx > -1) {
    movies.splice(idx, 1)
  }
  var outString = movies.join('\n')
  writeMovieListToS3(outString)
}

function writeMovieListToS3(movieListTxt)
{
  var params = {
    Bucket: 'cs4241',
    Key: 'movies.txt',
    Body: movieListTxt
  }
  s3.putObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log("Uploaded to S3 successfully.")
    }
  })
}

function generateListItem(item) {
  return '<li class="list-group-item">'+item+'<button type="submit" class="btn btn-xs btn-danger btn-delete" onClick="deleteButtonClick(this)" value="'+item+'">Delete</buttton></li>'
}

function handleSearch(res, uri) {
  var contentType = 'text/html'

  fs.readFile(__dirname + '/template.html', 'utf8', function(err, html) {
    if (err) {
      throw err
    }
    //Generate filtered movie list
    if (uri.query && querystring.parse(uri.query)['searchterm']) {
      query = querystring.parse(uri.query)
      searchTerm = query['searchterm']
      searchResult = filterList(searchTerm, movies)
      if (searchResult.length > 0) {
        movieList = searchResult.map(function(d) { return generateListItem(d) }).join(' ')
      } else {
        movieList = '<div class="alert alert-danger" role="alert">No results found.</div>'
      }
    } else {
      searchTerm = ""
      movieList = '<div class="alert alert-warning" role="alert">No Search Term Provided!</div>'
      movieList = movieList + movies.map(function(d) { return generateListItem(d) }).join(' ')
    }
    
    //Serve rendered page
    mustache.parse(html)
    var rendered = mustache.render(html, {movielist: movieList, searchterm: searchTerm})
    res.writeHead(200, {'Content-type': contentType})
    res.end(rendered, 'utf-8')
  })
}

// Note: consider this your "index.html" for this assignment
function sendIndex(res) {
  var contentType = 'text/html'
  fs.readFile(__dirname + '/template.html', 'utf8', function(err, html) {
    if (err) {
      throw err
    }
    //Generate movie list
    movieList = movies.map(function(d) { return generateListItem(d) }).join(' ')
    
    //Serve rendered page
    mustache.parse(html)
    var rendered = mustache.render(html, {movielist: movieList})
    res.writeHead(200, {'Content-type': contentType})
    res.end(rendered, 'utf-8')
  })
}

function sendReadme(res) {
  var contentType = 'text/html'
  fs.readFile(__dirname + '/README.md', 'utf8', function(err, md) {
    if (err) {
      throw err
    }
    
    //Serve rendered readme
    res.writeHead(200, {'Content-type': contentType})
    res.end(marked(md), 'utf-8')
  })
}

function filterList(searchterm, list) {
  return list.filter(function f(value) {
    if (value.toLowerCase().includes(searchterm.toLowerCase()))
    {
      return true
    } else {
      return false
    }
  })
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html'

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}
