let user = require('./User');

console.log(user.userName);
console.log(user.sayHello())

let http = require('http');

http.createServer((req,res)=>{
  res.statusCode = 200;

  res.setHeader("Content-Type","text/plain; charset=utf-8")
})
