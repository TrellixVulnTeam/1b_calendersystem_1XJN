import * as http from "http";
import * as fs from "fs";
import * as url from "url";
import * as IDPASS from "./login/IDPASS.mjs";

const registration_html = fs.readFileSync('./login/registration.html', 'UTF-8');
const registration_js = fs.readFileSync('./login/registration.mjs', 'UTF-8');
const login_txt = fs.readFileSync('./login/login.txt', 'UTF-8');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(RouteSetting);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function RouteSetting(req, res) {
  const url_parts = url.parse(req.url);
  switch (url_parts.pathname) {
    case '/':
    case '/registration.html':
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(registration_html);
        res.end();
        break;

    case '/registration.mjs':
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(registration_js);
        res.end();
        break; 

    case '/login.txt':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(login_txt);
        res.end();
        break; 

    default:
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('お探しのページは見つかりません。');
        break;
  }
  if (req.method == "POST"){
    var postData = "";
    var result = "false";
    req.on("data", function(chunk){
      postData += chunk;
    }).on("end", async function(){
      async function login(){
        var idpass = postData.split(",");
        if (idpass[0] == "UserRegistration"){
          result = await IDPASS.regist(idpass[1], idpass[2]);
        } else if (idpass[0] == "AskRegistration"){
          result = await IDPASS.check(idpass[1], idpass[2]);
        }
        await fs.writeFile("./login/login.txt", result, function(err){
          if (err){
            throw err;
          }
        })
      }
      await login();
      res.end();
      console.log("success");
    })
  }
}
