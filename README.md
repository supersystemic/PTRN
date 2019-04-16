# PTRN

Persistently stores distributed networks and patterns of subject oriented knowledge.

## Repl

You can use the interactive repl webclient to interact with the database:

```declare```
creates id and declares memory space

```set: id, value```
sets value at id to value

```get: id```
retuns value at id and all the relations

```relate: typeid, aid, bid```
creates a relation between two entities with aid and bid, and relates them with typeid

```reorder: typeid, aid, oldpos, newpos```
moves and reorders a relation of typeid from entity with aid, from oldpos to newpos


## Version semantics
Objects work by semantics in time
