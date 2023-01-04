const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempval, orgval) =>{
    let temprature =  tempval.replace("{%tempval%}", orgval.main.temp);
    temprature =  temprature.replace("{%tempmin%}", orgval.main.temp_min);
    temprature =  temprature.replace("{%tempmax%}", orgval.main.temp_max);
    temprature =  temprature.replace("{%country%}", orgval.sys.country+"D");
    temprature =  temprature.replace("{%location%}", orgval.name);
    temprature = temprature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temprature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=ahmedabad&appid=2fc26423c52c79c7ac9524d540b2a84a")
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                const realData = arrData.map((val) => replaceval(homeFile, val)).join("");
                res.write(realData);
            })
            .on("end", function (err) {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    }
})

server.listen(80,"127.0.0.1", ()=>{
    console.log("listening...");
})