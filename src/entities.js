//Stores the entities in memory
let entities = []

//Generates an id and frees memory for this entity
function declare() {
    let entity = {
        id: entities.length
    }
    entities.push(entity)
    return entity
}

//Sets the value for a given entity with id
function set_value(id, value) {
    if(!entities[id]) return false
    entities[id].value = value
    return entities[id]
}

//Returns entity with id
function get(id) {
    if(!entities[id]) return false
    return entities[id]
}

module.exports = {
    declare, set_value,
    get
}
