let http = require('http');
let url = require('url');
let util = require('util');

let fs = require('fs');

let server = http.createServer((req,res)=>{
  // res.statusCode = 200;
  //
  // res.setHeader("Content-Type","text/plain; charset=utf-8");

 var pathname = url.parse(req.url).pathname;
  fs.readFile(pathname.substring(1),function (err,data) {
    if(err){
      res.writeHead(404,{
        'Content-Typer':'text/html'
      });
    }else{
      res.writeHead(200,{
        'Content-Typer':'text/html'
      });

      res.write(data.toString());
    }

    res.end();
  });

});

server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器已运行,请打开浏览器,输入:http://127.0.0.1:3000/ 来访问")
});