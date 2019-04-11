var http = require('http')

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
