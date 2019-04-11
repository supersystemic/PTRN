//Stores the relations in memory
let relations = []
let types = {}
let from = {}
let to = {}

//Creates a relation of type, between a and b
function relate(typeid, aid, bid) {
    let relation = {
        id: relations.length,
        typeid, aid, bid
    }
    relations.push(relation)

    if(!from[aid]) from[aid] = []
    from[aid].push(relation)
    if(!to[bid]) to[bid] = []
    to[bid].push(relation)
    if(!types[typeid]) types[typeid] = []
    types[typeid].push(relation)
    return relation
}

//Returns all relations of type id
function get_type(id){
    return type[id]
}

//Returns all relations from entity id
function get_from(id){
    return from[id]
}

//Returns all relations to entity id
function get_to(id){
    return to[id]
}

module.exports = {
    relate,
    get_type, get_from, get_to
}
