//Stores the relations in memory
let relations = []
let from = {}
let to = {}

function relate(aid, bid) {
    let relation = {
        id: relations.length,
        aid, bid
    }
    relations.push(relation)

    if(!from[aid]) from[aid] = []
    from[aid].push(relation)
    if(!to[bid]) to[bid] = []
    to[bid].push(relation)
    return relation
}

function get_from(id){
    return from[id]
}

function get_to(id){
    return to[id]
}

module.exports = {
    relate,
    get_from, get_to
}
