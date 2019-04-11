const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})

const entities = require("./entities")

function print_results(result){
    if(result === false){
        console.log(`unknown entity`)
    } else {
        console.log(`${result.id}\t${result.value} `)
    }
}

function parse_query(query){
    let [command, args] = query.split(":")
    if(args) args = args.split(",")

    if(command==="declare"){
        let result = entities.declare()
        print_results(result)
        return
    }

    if(command==="set"){
        let id = parseInt(args[0])
        let value = args[1]
        let result = entities.set_value(id, value)
        print_results(result)
        return
    }

    if(command==="get"){
        let id = parseInt(args[0])
        let result = entities.get(id)
        print_results(result)
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
