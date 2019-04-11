const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})

const entities = require("./entities")
const relations = require("./relations")

function check_validity(id){
    if(!entities.get(id)){
        console.log(`! unknown entity ${id}, please declare first`)
        return false
    }
    return true
}

function print_results(id){
    let e = entities.get(id)
    console.log(`${e.id}\t${e.value} `)
    let rels = relations.get_from(id)
    if(rels){
        rels.forEach(r=>{
            let er = entities.get(r.bid)
            console.log(`├ ${er.id}\t${er.value} `)
        })
    }
}

function parse_query(query){
    let [command, args] = query.split(":")
    if(args) args = args.split(",")

    if(command==="declare"){
        let result = entities.declare()
        print_results(result.id)
        return
    }

    if(command==="set"){
        let id = parseInt(args[0])
        let value = args[1]
        if(!check_validity(id)) return
        entities.set_value(id, value)
        print_results(id)
        return
    }

    if(command==="relate"){
        let aid = parseInt(args[0])
        let bid = parseInt(args[1])
        if(!check_validity(aid)) return
        if(!check_validity(bid)) return
        let result = relations.relate(aid, bid)
        print_results(aid)
        return
    }



    if(command==="get"){
        let id = parseInt(args[0])
        if(!check_validity(id)) return
        print_results(id)
        return
    }

    console.log(`unknown command ${command}`)
}

function repl_loop(){
    readline.question(`> `, (query) => {
        parse_query(query)
        repl_loop()
    })
}

console.log(`PTRN repl version 0.1`)
repl_loop()
