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

    if(!from[aid]) from[aid] = {}
    if(!from[aid][typeid]) from[aid][typeid] = []
    from[aid][typeid].push(relation)

    if(!to[bid]) to[bid] = {}
    if(!to[bid][typeid]) to[bid][typeid] = []
    to[bid][typeid].push(relation)

    if(!types[typeid]) types[typeid] = []
    types[typeid].push(relation)

    return relation
}

function reorder(typeid, aid, oldpos, newpos){
    if(oldpos<0) return false
    if(oldpos>=from[aid][typeid].length) return false
    if(newpos<0) return false
    if(newpos>=from[aid][typeid].length) return false

    from[aid][typeid].splice(newpos, 0, from[aid][typeid].splice(oldpos, 1)[0])
    return true
}

//Returns all relations of type id
function get_type(id){
    return type[id]
}

//Returns all relations from entity id
function get_from(id){
    return from[id]
}

//Returns all relations from entity id
function get_from_by_type(id, typeid){
    return from[id].filter(r=>r.typeid===typeid)
}

//Returns all relations to entity id
function get_to(id){
    return to[id]
}

module.exports = {
    relate, reorder,
    get_type, get_from, get_to,
    get_from_by_type,

}
