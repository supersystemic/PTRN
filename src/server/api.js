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

const PARENT = entities.declare().id
entities.set_value(PARENT, "parent")

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

    if(query==="instantiate"){
        if(!check_validity(args.id)){
            return {executed: false, error: "unknown entity "+args.id}
        }

        let n = entities.declare()
        relations.relate(PARENT, n.id, args.id)

        return {
            executed: true,
            answer: n
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
            return {executed: false, error: "unknown entity "+args.id}
        }

        let entity = entities.get(args.id)
        let answer = {
            id: entity.id,
            value: entity.value,
        }

        let rels = relations.get_from(args.id) || {}


        //deal with inheritance of values
        if(rels[PARENT]!==undefined && answer.value===undefined) {
            let parent = rels[PARENT][0].bid
            answer.value = entities.get(parent).value
            let parent_rels = relations.get_from(parent) || {}

            console.log(rels, parent_rels)
            //merge parent_rels with rels
            let newrels = Object.assign({}, parent_rels)
            Object.keys(rels).forEach(key=>{
                rels[key].forEach((r,i)=>{
                    if(newrels[key]===undefined) newrels[key] = []
                    newrels[key][i] = r
                })
            })
            rels = newrels
        }

        answer.relations = Object.keys(rels).map(key=>{
            return {
                key: entities.get(key),
                values: rels[key].map(rel=>entities.get(rel.bid))
            }
        })

        return {
            executed: true,
            answer
        }
    }

    if(query==="getversion"){
        if(!check_validity(args.id)){
            return {
                executed: false,
                error: "unknown entity "+args.id
            }
        }

        let entity = entities.get_version(args.id, args.version)

        return {
            executed: true,
            answer: entity
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

    if(query==="reorder"){
        if(!check_validity(args.typeid)){
            return {executed: false, error: "unknown entity "+args.typeid}
        }
        if(!check_validity(args.aid)){
            return {executed: false, error: "unknown entity "+args.aid}
        }

        if (!relations.reorder(args.typeid, args.aid, args.oldpos, args.newpos)) {
            return {executed: false, error: "position out of range"}
        }

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
