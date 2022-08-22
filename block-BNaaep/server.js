var http = require('http');
var fs = require('fs');
var url = require('url');
const { parse } = require('path');

var server = http.createServer(handleRequest);
var userPath = __dirname + '/contacts/';

function handleRequest(req,res){
    var parsedurl = url.parse(req.url, true)
    var store = '';

    req.on('data',(chunk)=>{
        store += chunk
    });

    req.on('end',()=>{
        if(req.method === 'GET' && req.url === '/'){
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./index.html').pipe(res)
        }
        if(req.method === 'GET' && req.url === '/about'){
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./about.html').pipe(res)
        }
        if(req.method === 'GET' && req.url === '/contact'){
            res.setHeader('Content-Type','text/html');
            fs.createReadStream('./contact.html').pipe(res)
        }

        // handling contact route using post
        if(req.url === '/contact' && req.method === 'POST'){
            var username = JSON.parse(store).username;
            fs.open(userPath + username + '.json', 'wx',(err,fd)=>{
                if(err) return console.log(err);
                fs.writeFile(fd,store,(err)=>{
                    if(err) return console.log(err);
                    fs.close(fd, ()=>{;
                    res.end(`${username} created succesfully`)
                })
                })
            })
        }

        if(parsedurl.pathname === '/contacts' && req.method === 'GET'){
            console.log(parsedurl)
            var username = parsedurl.query.username;
            fs.readFile(userPath + username + '.json',(err,content)=>{
                if(err) return console.log(err);
                res.setHeader('Content-type','application/json');
                res.end(content)
                console.log(err,content)
            })
        }


    if (req.method === "GET" && req.url.split(".").pop() === "css") {
        const cssFile = req.url;
        res.setHeader("Content-Type", "text/css");
        fs.readFile(__dirname + cssFile, "utf8", (err, content) => {
          res.end(content);
        });
      }
      // Handling with the images requests
      if (req.method === "GET" && req.url.split(".").pop() === "png") {
        const imageUrl = req.url;
        res.setHeader("Content-Type", "image/png");
        fs.createReadStream(__dirname + req.url).pipe(res);
      }
       
    })
}

server.listen(3000,()=>{
    console.log('server listening on port 3k')
})