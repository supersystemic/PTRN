//Stores the entities in memory
let entities = []

//Generates an id and frees memory for this entity
function declare() {
    let entity = {
        id: entities.length,
        values: []
    }
    entities.push(entity)
    return entity
}

//Sets the value for a given entity with id
function set_value(id, value) {
    entities[id].values.push(entities[id].value)
    entities[id].value = value
    return entities[id]
}

//Returns entity with id
function get(id) {
    let e = entities[id]
    return {
        version: e.values.length,
        id: e.id,
        value: e.value
    }
}

function get_version(id, v) {
    let e = entities[id]
    return {
        version: v,
        id: e.id,
        value: e.values[v] || e.value
    }
}


module.exports = {
    declare, set_value,
    get, get_version
}
