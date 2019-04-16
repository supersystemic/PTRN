//if a is a philosopher, then a is a scholar

//statements
let statements = [
    {
        predicate: "is a philosopher",
        variable: "socrates"
    },
    {
        predicate: "is a philosopher",
        variable: "plato"
    },
]

let predicates = {}

function parse(statements) {
    statements.forEach(statement=>{
        let p = statement.predicate
        if(!predicates[p]) predicates[p] = []
        predicates[p].push(statement.variable)
    })
}

parse(statements)
console.log(predicates);
