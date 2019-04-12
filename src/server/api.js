var express = require("express")
var bodyParser = require("body-parser")

const entities = require("./entities")
const relations = require("./relations")

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

function check_validity(id){
    if(!entities.get(id)){
        return false
    }
    return true
}

function parse_query(q){
    let query = q.query
    let args = q.args

    if(query==="declare"){
        return {
            executed: true,
            answer: entities.declare()
        }
    }

    if(query==="set_value"){
        if(!check_validity(args.id)){
            return {
                executed: false,
                error: "unknown entity "+args.id
            }
        }

        return {
            executed: true,
            answer: entities.set_value(args.id, args.value)
        }
    }

    if(query==="get"){
        if(!check_validity(args.id)){
            return {
                executed: false,
                error: "unknown entity "+args.id
            }
        }
        return {
            executed: true,
            answer: entities.get(args.id)
        }
    }

    if(query==="relate"){
        if(!check_validity(args.typeid)){
            return {executed: false, error: "unknown entity "+args.typeid}
        }
        if(!check_validity(args.aid)){
            return {executed: false, error: "unknown entity "+args.aid}
        }
        if(!check_validity(args.bid)){
            return {executed: false, error: "unknown entity "+args.bid}
        }
        relations.relate(args.typeid, args.aid, args.bid)
        return {
            executed: true,
            answer: entities.get(args.aid)
        }
    }
}


app.post("/", function(req, res) {
    res.status(200).send(parse_query(req.body))
});

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port)
});


/*var http = require('http')

const entities = require("./entities")
const relations = require("./relations")

function parse_query(q){
    let query = q.query
    let args = q.args

    if(query==="declare"){
        return entities.declare()
    }

    if(query==="set_value"){
        return entities.set_value(args.id, args.value)
    }

    if(query==="get"){
        return entities.get(args.id)
    }

    if(query==="relate"){
        return entities.get(args.typeid, args.aid, args.bid)
    }
}

http.createServer((request, response) => {
    const { headers, method, url } = request
    let body = []
    request.on('error', (err) => {
        console.error(err)
    }).on('data', (chunk) => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        let jsonbody
        try {
            jsonbody = JSON.parse(body)
        } catch (e) {
            response.statusCode = 404;
            response.end();
            return
        }

        response.on('error', (err) => {
            console.error(err)
        })

        response.writeHead(200, {'Content-Type': 'application/json'})

        //const responseBody = { headers, method, url, jsonbody }
        response.write(JSON.stringify(parse_query(jsonbody)))

        response.end()
    })
}).listen(8080)
*/
