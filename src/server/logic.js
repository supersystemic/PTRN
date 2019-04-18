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
    {
        predicate: "is a gardener",
        variable: "plato"
    },
]

let formulas = [
    {
        if: {
            variable: "x",
            predicate: {
                and: ["is a philosopher", "is a gardener"]
            }
        },
        then: {
            variable: "x",
            predicate: "is a scholar"
        },
    }
]

let predicates = {}

function parse(statements) {
    statements.forEach(statement=>{
        let p = statement.predicate
        if(!predicates[p]) predicates[p] = []
        predicates[p].push(statement.variable)
    })
}

function deduce(formulas, predicates){
    formulas.forEach(formula=>{
        let pA = formula.if.predicate
        let resultsA = []
        if(pA.and){
            //and is an intersection intersect
            resultsA = predicates[pA.and[0]].filter(value => -1 !== predicates[pA.and[1]].indexOf(value))
        } else {
            resultsA = predicates[pA]
        }
        let pB = formula.then.predicate
        predicates[pB] = resultsA
    })
}

parse(statements)
deduce(formulas, predicates)
console.log(predicates);
